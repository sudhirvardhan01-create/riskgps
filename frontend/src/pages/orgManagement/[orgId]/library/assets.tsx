import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Search,
  Delete,
  Close,
  EditOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { useOrganization } from "@/hooks/useOrganization";
import Image from "next/image";
import AddLibraryItemsModal from "@/components/OrgManagement/AddLibraryItemsModal";
import { AssetLibraryService } from "@/services/orgLibraryService/assetLibraryService";
import {
  createOrganizationAssets,
  getOrganizationAssets,
  updateOrganizationAsset,
  deleteOrganizationAsset,
} from "@/pages/api/organization";
import { fetchAssetsById } from "@/pages/api/asset";
import AssetFormModal from "@/components/Library/Asset/AssetFormModal";
import MenuItemComponent from "@/components/MenuItemComponent";
import { AssetForm } from "@/types/asset";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import {
  fetchOrganizationProcessesForListing,
  fetchProcessesForListing,
} from "@/pages/api/process";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Asset {
  id: string | number;
  applicationName: string;
  assetDescription: string;
}

function AssetsPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const { organization, loading, error } = useOrganization(orgId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orgAssets, setOrgAssets] = useState<any[]>([]); // Full org assets for matching
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Success! Assets have been added."
  );
  const [selectedAssets, setSelectedAssets] = useState<(string | number)[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Set<string | number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetForm | null>(null);
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}?tab=1`);
  };

  const handleAddAssets = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const fetchOrganizationAssets = async () => {
    if (!orgId || typeof orgId !== "string") return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getOrganizationAssets(orgId);

      // Backend returns { message: "...", data: [assets array] }
      if (response?.data && Array.isArray(response.data)) {
        // Store full org assets for matching with library items
        setOrgAssets(response.data);

        // Map to display format
        const assetsList: Asset[] = response.data.map((asset: any) => ({
          id: asset.id,
          applicationName: asset.applicationName || "",
          assetDescription: asset.assetDescription || "",
        }));
        setAssets(assetsList);
      } else {
        // If data is empty or not in expected format, set empty array
        setOrgAssets([]);
        setAssets([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch organization assets:", err);
      setErrorMessage(
        err.message || "Failed to fetch assets. Please try again."
      );
      setOrgAssets([]);
      setAssets([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (orgId && typeof orgId === "string" && isInitialLoad) {
      fetchOrganizationAssets();
      (async () => {
        try {
          const [processes] = await Promise.all([
            fetchOrganizationProcessesForListing(orgId as string)          
          ]);
          setProcessesData(processes.data ?? []);
        } catch (err) {
          console.error("Failed to fetch supporting data:", err);
        }
      })();
    }
  }, [orgId, isInitialLoad]);

  // Fetch processes and metaDatas for the edit modal
  useEffect(() => {
    (async () => {
      try {
        const [meta] = await Promise.all([
          fetchMetaDatas(),
        ]);
        setMetaDatas(meta.data ?? []);
      } catch (err) {
        console.error("Failed to fetch supporting data:", err);
      }
    })();
  }, []);

  const handleAddAssetsFromModal = async (selectedAssets: any[]) => {
    if (!orgId || typeof orgId !== "string" || selectedAssets.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Fetch full asset data from library using the IDs
      const fullAssetData: any[] = await Promise.all(
        selectedAssets.map(async (asset) => {
          const fullData = await fetchAssetsById(asset.id!);
          return fullData;
        })
      );

      // Format the data to match the GET response structure exactly (same format as library GET API)
      const formattedData = fullAssetData.map((data: any) => {
        // Transform attributes to match the expected format (same as GET response)
        const attributes =
          data.attributes?.map((attr: any) => {
            let metaDataKeyId: string | undefined;

            if (attr.metaData?.id) {
              // When metaData association is included
              metaDataKeyId = attr.metaData.id;
            } else if (attr.meta_data_key_id) {
              // When using snake_case field name
              metaDataKeyId = attr.meta_data_key_id;
            } else if (attr.metaDataKeyId) {
              // When using camelCase field name
              metaDataKeyId = attr.metaDataKeyId;
            }

            return {
              meta_data_key_id: metaDataKeyId || "",
              values: attr.values || [],
            };
          }) || [];

        // Transform related_processes - handle both array of IDs and array of objects
        let relatedProcesses: string[] = [];
        if (data.related_processes && Array.isArray(data.related_processes)) {
          relatedProcesses = data.related_processes.map((processId: any) => {
            if (typeof processId === "object" && processId?.id) {
              return processId.id;
            }
            return String(processId);
          });
        } else if (data.processes && Array.isArray(data.processes)) {
          // When processes association is included
          relatedProcesses = data.processes.map((p: any) => String(p.id));
        }

        // Return data in exact same format as GET response
        return {
          id: data.id,
          autoIncrementId: data.autoIncrementId,
          assetCode: data.assetCode,
          applicationName: data.applicationName,
          applicationOwner: data.applicationOwner || null,
          applicationItOwner:
            data.applicationITOwner || data.applicationItOwner || null,
          isThirdPartyManagement: data.isThirdPartyManagement || null,
          thirdPartyName: data.thirdPartyName || null,
          thirdPartyLocation: data.thirdPartyLocation || null,
          hosting: data.hosting || null,
          hostingFacility: data.hostingFacility || null,
          cloudServiceProvider: data.cloudServiceProvider || null,
          geographicLocation: data.geographicLocation || null,
          hasRedundancy: data.hasRedundancy || null,
          databases: data.databases || null,
          hasNetworkSegmentation: data.hasNetworkSegmentation || null,
          networkName: data.networkName || null,
          assetCategory: data.assetCategory || "",
          assetDescription: data.assetDescription || "",
          status: data.status || "published",
          attributes: attributes,
          related_processes: relatedProcesses,
          parentObjectId: data.id,
        };
      });

      // Call the POST API to save to organization
      await createOrganizationAssets(orgId, formattedData);

      // Refresh the list
      await fetchOrganizationAssets();

      setSuccessMessage("Success! Assets have been added.");
      setShowSuccessMessage(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add assets:", err);
      setErrorMessage(err.message || "Failed to add assets. Please try again.");
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetToggle = (assetId: string | number) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleRemoveSelected = async () => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    if (selectedAssets.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Convert selected asset IDs to strings
      const assetIds = selectedAssets.map((id) => String(id));

      await deleteOrganizationAsset(orgId, assetIds);

      // Refresh the list after successful deletion
      await fetchOrganizationAssets();

      setSuccessMessage(
        `Success! ${selectedAssets.length} asset(s) have been deleted.`
      );
      setShowSuccessMessage(true);
      setSelectedAssets([]);
    } catch (err: any) {
      console.error("Failed to delete assets:", err);
      setErrorMessage(
        err.message || "Failed to delete assets. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedAssets([]);
  };

  const handleDeleteSingleAsset = async (assetId: string | number) => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      await deleteOrganizationAsset(orgId, String(assetId));

      // Refresh the list after successful deletion
      await fetchOrganizationAssets();

      setSuccessMessage("Success! Asset has been deleted.");
      setShowSuccessMessage(true);
    } catch (err: any) {
      console.error("Failed to delete asset:", err);
      setErrorMessage(
        err.message || "Failed to delete asset. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to transform orgAsset to AssetForm format
  const transformToAssetForm = useCallback((fullAsset: any): AssetForm => {
    return {
      id: fullAsset.id,
      assetCode: fullAsset.assetCode,
      applicationName: fullAsset.applicationName || "",
      assetName: fullAsset.assetName || null,
      assetCategory: fullAsset.assetCategory || "",
      assetDescription: fullAsset.assetDescription || "",
      applicationOwner: fullAsset.applicationOwner || null,
      applicationITOwner:
        fullAsset.applicationItOwner || fullAsset.applicationITOwner || null,
      isThirdPartyManagement: fullAsset.isThirdPartyManagement ?? null,
      thirdPartyName: fullAsset.thirdPartyName || null,
      thirdPartyLocation: fullAsset.thirdPartyLocation || null,
      hosting: fullAsset.hosting || null,
      hostingFacility: fullAsset.hostingFacility || null,
      cloudServiceProvider: fullAsset.cloudServiceProvider || null,
      geographicLocation: fullAsset.geographicLocation || null,
      hasRedundancy: fullAsset.hasRedundancy ?? null,
      databases: fullAsset.databases || null,
      hasNetworkSegmentation: fullAsset.hasNetworkSegmentation ?? null,
      networkName: fullAsset.networkName || null,
      attributes:
        fullAsset.attributes?.map((attr: any) => ({
          meta_data_key_id: attr.meta_data_key_id || attr.metaDataKeyId || null,
          values: attr.values || [],
        })) || [],
      relatedProcesses:
        fullAsset.related_processes?.map((p: any) => {
          // Handle different formats: object with id, string, or number
          if (typeof p === "object" && p?.id) {
            return p.id;
          } else if (typeof p === "string") {
            // Try to parse as number if possible, otherwise keep as string
            const num = parseInt(p, 10);
            return isNaN(num) ? p : num;
          }
          return p;
        }) || [],
      status: fullAsset.status || "published",
    };
  }, []);

  // Memoized handler for editing an asset
  const handleEditAsset = useCallback(
    (assetId: string | number) => {
      const fullAsset = orgAssets.find((a: any) => a.id === assetId);
      if (fullAsset) {
        const assetData = transformToAssetForm(fullAsset);
        setSelectedAsset(assetData);
        setIsEditOpen(true);
      }
    },
    [orgAssets, transformToAssetForm]
  );

  // Update asset
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedAsset?.id || !orgId || typeof orgId !== "string") {
        throw new Error("Invalid selection");
      }

      // Transform the selectedAsset to match the API format
      // Convert relatedProcesses to strings (organization process IDs)
      const relatedProcesses =
        selectedAsset.relatedProcesses?.map((p: any) => String(p)) || [];

      const body = {
        ...selectedAsset,
        status,
        relatedProcesses: relatedProcesses,
      };

      await updateOrganizationAsset(orgId, String(selectedAsset.id), body);

      setIsEditOpen(false);
      setSelectedAsset(null);

      // Refresh the list
      await fetchOrganizationAssets();

      setSuccessMessage("Success! Asset has been updated.");
      setShowSuccessMessage(true);
      setErrorMessage(null);
    } catch (err: any) {
      console.error("Failed to update asset:", err);
      setErrorMessage(
        err.message || "Failed to update asset. Please try again."
      );
      setShowSuccessMessage(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const toggleDescription = (
    assetId: string | number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(
    (asset) =>
      asset.applicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || (isInitialLoad && isLoading)) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress sx={{ color: "#04139A" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading organization: {error}
        </Typography>
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Organization not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 95px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#F0F2FB",
      }}
    >
      {/* Breadcrumb */}
      <Stack sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 2 }}>
          <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              Org Management/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              {organization.name}/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
              }}
            >
              Library/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#04139A",
              }}
            >
              Assets
            </Box>
          </Typography>
        </Box>
      </Stack>

      {/* Error Toast */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{
            width: "100%",
            backgroundColor: "#FFEBEE",
            color: "#C62828",
            border: "1px solid #EF5350",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              color: "#EF5350",
            },
            "& .MuiAlert-message": {
              fontWeight: 500,
            },
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Success Toast */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "#E8F5E8",
            color: "#2E7D32",
            border: "1px solid #4CAF50",
            borderRadius: "8px",
            "& .MuiAlert-icon": {
              color: "#4CAF50",
            },
            "& .MuiAlert-message": {
              fontWeight: 500,
            },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          px: 3,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // Important for flex children to shrink
        }}
      >
        {assets.length === 0 ? (
          // Empty state
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "667px",
                p: 4,
                border: "1px solid #E7E7E8",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Empty state icon placeholder */}
              <Box
                sx={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={"/create.png"}
                  alt="org-image"
                  width={120}
                  height={120}
                />
              </Box>

              <Typography variant="h6" sx={{ mb: 2, color: "#484848" }}>
                Looks like there are no assets added yet. <br /> Click on
                &apos;Add Assets&apos; to start adding assets.
              </Typography>

              <Button
                variant="contained"
                onClick={handleAddAssets}
                sx={{
                  backgroundColor: "#04139A",
                  color: "#FFFFFF",
                  p: "12px, 40px",
                  height: "40px",
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#030d6b",
                  },
                }}
              >
                Add Assets
              </Button>
            </Box>
          </Box>
        ) : (
          // Main content with assets
          <Box
            sx={{
              mx: "auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              pl: "40px",
              pr: "40px",
              mt: "10px",
              position: "relative",
            }}
          >
            {/* Loading Overlay */}
            {isLoading && !isInitialLoad && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000,
                  borderRadius: "8px",
                }}
              >
                <CircularProgress sx={{ color: "#04139A" }} />
              </Box>
            )}
            {/* Fixed Header */}
            <Box sx={{ mb: 1, flexShrink: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: "20px",
                  color: "#484848",
                  mb: 3,
                }}
              >
                Assets
              </Typography>

              {/* Search Bar and Action Buttons Row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  width: "1100px",
                }}
              >
                <TextField
                  placeholder="Search by keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#91939A" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    maxWidth: "480px",
                    maxHeight: "40px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E7E7E8",
                      },
                      "&:hover fieldset": {
                        borderColor: "#04139A",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#04139A",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddAssets}
                  sx={{
                    backgroundColor: "#04139A",
                    color: "#FFFFFF",
                    textTransform: "none",
                    fontWeight: 600,
                    p: "12px 40px",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#030d6b",
                    },
                  }}
                >
                  Add Assets
                </Button>
              </Box>

              {/* Section Header */}
              {selectedAssets.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#04139A",
                      mb: selectedAssets.length > 0 ? 2 : 0,
                    }}
                  >
                    Select Assets
                  </Typography>

                  {/* Selection Controls */}
                  {selectedAssets.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={`${selectedAssets.length} selected`}
                        onDelete={handleClearSelection}
                        deleteIcon={<Close />}
                        sx={{
                          backgroundColor: "#F3F8FF",
                          color: "#04139A",
                          fontWeight: 500,
                          border: "1px solid #04139A",
                          borderRadius: "4px",
                          paddingTop: "7px",
                          paddingRight: "16px",
                          paddingBottom: "7px",
                          paddingLeft: "16px",
                          gap: "8px",
                          opacity: 1,
                          "& .MuiChip-deleteIcon": {
                            color: "#04139A",
                            "&:hover": {
                              opacity: 0.8,
                            },
                          },
                        }}
                      />
                      <Button
                        variant="text"
                        startIcon={<Delete />}
                        onClick={handleRemoveSelected}
                        sx={{
                          color: "#F44336",
                          textTransform: "none",
                          fontWeight: 500,
                          p: "8px 16px",
                          paddingTop: "7px",
                          paddingRight: "16px",
                          paddingBottom: "7px",
                          paddingLeft: "16px",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                          "& .MuiButton-startIcon": {
                            marginRight: "8px",
                          },
                        }}
                      >
                        Remove Selected
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Scrollable Assets Grid */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
                mb: 4,
              }}
            >
              <Grid container spacing={2}>
                {filteredAssets.map((asset) => {
                  const isExpanded = expandedDescriptions.has(asset.id);
                  const descriptionText = `Description: ${asset.assetDescription}`;
                  const actualDescription = asset.assetDescription || "";
                  const shouldShowToggle = actualDescription.trim().length > 80;

                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={asset.id}>
                      <Box
                        sx={{
                          border: "1px solid #E7E7E8",
                          borderLeft: "4px solid #04139A",
                          borderRadius: "8px",
                          p: 2,
                          backgroundColor: "#FFFFFF",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#04139A",
                            backgroundColor: "rgba(4, 19, 154, 0.02)",
                          },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedAssets.includes(asset.id)}
                              onChange={() => handleAssetToggle(asset.id)}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                color: "#04139A",
                                "&.Mui-checked": {
                                  color: "#04139A",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: "20px",
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                flex: 1,
                                pr: 4,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#484848",
                                  fontSize: "14px",
                                  lineHeight: "20px",
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                {asset.applicationName}
                              </Typography>
                              <Box sx={{ position: "relative" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#484848",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    fontWeight: 400,
                                    overflow: isExpanded ? "visible" : "hidden",
                                    display: isExpanded
                                      ? "block"
                                      : "-webkit-box",
                                    WebkitLineClamp: isExpanded ? undefined : 2,
                                    WebkitBoxOrient: isExpanded
                                      ? undefined
                                      : "vertical",
                                    textOverflow: isExpanded
                                      ? "clip"
                                      : "ellipsis",
                                    maxHeight: isExpanded ? "none" : "40px",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {descriptionText}
                                </Typography>
                                {shouldShowToggle && (
                                  <Button
                                    onClick={(e) =>
                                      toggleDescription(asset.id, e)
                                    }
                                    sx={{
                                      textTransform: "none",
                                      color: "#04139A",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      p: 0,
                                      minWidth: "auto",
                                      mt: 0.5,
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    {isExpanded ? "View less" : "View more"}
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          }
                          sx={{
                            alignItems: "flex-start",
                            m: 0,
                            flex: 1,
                            width: "100%",
                            "& .MuiFormControlLabel-label": {
                              flex: 1,
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                          }}
                        >
                          <MenuItemComponent
                            items={[
                              {
                                onAction: () => handleEditAsset(asset.id),
                                color: "primary.main",
                                action: "Edit",
                                icon: <EditOutlined fontSize="small" />,
                              },
                              {
                                onAction: () =>
                                  handleDeleteSingleAsset(asset.id),
                                color: "#CD0303",
                                action: "Delete",
                                icon: (
                                  <DeleteOutlineOutlined fontSize="small" />
                                ),
                              },
                            ]}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>

      {/* Add Assets Modal */}
      <AddLibraryItemsModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddAssetsFromModal}
        title="Add Assets"
        service={AssetLibraryService}
        itemType="assets"
        orgItems={orgAssets}
      />

      {/* Edit Asset Modal */}
      {isEditOpen && selectedAsset && (
        <AssetFormModal
          operation="edit"
          open={isEditOpen}
          assetFormData={selectedAsset}
          setAssetFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedAsset((prev) => val(prev as AssetForm));
            } else {
              setSelectedAsset(val);
            }
          }}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleUpdate}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm Dialog for Edit Cancellation */}
      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Asset Updation?"
        description="Are you sure you want to cancel the asset updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedAsset(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />
    </Box>
  );
}

export default withAuth(AssetsPage);
