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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import { ProcessData } from "@/types/process";
import AddLibraryItemsModal from "@/components/OrgManagement/AddLibraryItemsModal";
import { ProcessLibraryService } from "@/services/orgLibraryService/processLibraryService";
import {
  getOrganizationProcess,
  createOrganizationProcesses,
  updateOrganizationProcess,
  deleteOrganizationProcess,
} from "@/pages/api/organization";
import {
  fetchOrganizationProcessesForListing,
  fetchProcessById,
  fetchProcessesForListing,
} from "@/pages/api/process";
import { getBusinessUnits } from "@/services/businessUnitService";
import { BusinessUnitData } from "@/types/business-unit";
import ProcessFormModal from "@/components/Library/Process/ProcessFormModal";
import MenuItemComponent from "@/components/MenuItemComponent";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Process {
  id: string | number;
  processName: string;
  processDescription: string;
}

function ProcessesPage() {
  const router = useRouter();
  const { orgId, businessUnitId } = router.query;
  const { organization, loading, error } = useOrganization(orgId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [orgProcesses, setOrgProcesses] = useState<any[]>([]); // Full org processes for matching
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>(
    "Success! Processes have been added."
  );
  const [selectedProcesses, setSelectedProcesses] = useState<
    (string | number)[]
  >([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Set<string | number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentBusinessUnitId, setCurrentBusinessUnitId] = useState<
    string | string[] | undefined
  >(businessUnitId);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [loadingBusinessUnits, setLoadingBusinessUnits] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessData | null>(
    null
  );
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}?tab=1`);
  };

  const handleAddProcesses = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const fetchOrganizationProcesses = async (
    buId: string | string[] | undefined
  ) => {
    if (
      !orgId ||
      typeof orgId !== "string" ||
      !buId ||
      typeof buId !== "string"
    )
      return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getOrganizationProcess(orgId, buId, 0, 10);

      // Backend returns { data: { data: [...], total, page, limit, totalPages }, msg: "..." }
      const processesData = response?.data?.data || response?.data || [];

      if (Array.isArray(processesData)) {
        // Store full org processes for matching with library items
        setOrgProcesses(processesData);

        // Map to display format
        const processesList: Process[] = processesData.map((process: any) => ({
          id: process.id,
          processName: process.processName || "",
          processDescription: process.processDescription || "",
        }));
        setProcesses(processesList);
      } else {
        // If data is empty or not in expected format, set empty array
        setOrgProcesses([]);
        setProcesses([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch organization processes:", err);
      const errorMessage =
        err.message || "Failed to fetch processes. Please try again.";

      // If error is "No processes found", treat it as empty state (not an error)
      // This allows the "Add Processes" section to be visible for new business units
      if (errorMessage.toLowerCase().includes("no processes found")) {
        setErrorMessage(null);
        setOrgProcesses([]);
        setProcesses([]);
      } else {
        setErrorMessage(errorMessage);
        setOrgProcesses([]);
        setProcesses([]);
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Fetch business units when component mounts
  useEffect(() => {
    if (!orgId || typeof orgId !== "string") return;

    const fetchBusinessUnits = async () => {
      try {
        setLoadingBusinessUnits(true);
        const data = await getBusinessUnits(orgId);
        setBusinessUnits(data);

        // If businessUnitId is in query params, use it; otherwise use first business unit
        if (businessUnitId && typeof businessUnitId === "string") {
          setCurrentBusinessUnitId(businessUnitId);
        } else if (data.length > 0) {
          setCurrentBusinessUnitId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching business units:", err);
        setErrorMessage("Failed to fetch business units. Please try again.");
        setBusinessUnits([]);
      } finally {
        setLoadingBusinessUnits(false);
      }
    };

    fetchBusinessUnits();
  }, [orgId]);

  // Fetch processes when business unit is selected
  useEffect(() => {
    if (
      orgId &&
      typeof orgId === "string" &&
      currentBusinessUnitId &&
      typeof currentBusinessUnitId === "string"
    ) {
      setIsInitialLoad(true);
      fetchOrganizationProcesses(currentBusinessUnitId);
      (async () => {
        try {
          const [processes] = await Promise.all([
            fetchOrganizationProcessesForListing(orgId as string),
          ]);
          setProcessesData(processes.data ?? []);
        } catch (err) {
          console.error("Failed to fetch supporting data:", err);
        }
      })();
    }
  }, [orgId, currentBusinessUnitId]);

  // Fetch processes and metaDatas for the edit modal
  useEffect(() => {
    (async () => {
      try {
        const [meta] = await Promise.all([
          fetchMetaDatas(),
        ]);
        // Match exactly what ProcessContainer does - it uses meta.data
        setMetaDatas(meta.data ?? []);
      } catch (err) {
        console.error("Failed to fetch supporting data:", err);
      }
    })();
  }, []);

  // Handle business unit selection change
  const handleBusinessUnitChange = (event: any) => {
    const selectedBuId = event.target.value;
    setCurrentBusinessUnitId(selectedBuId);
    // Update URL query param
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, businessUnitId: selectedBuId },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleAddProcessesFromModal = async (data: any) => {
    // Handle both old format (array) and new format (object with items and businessUnitId)
    const selectedProcessesArray = Array.isArray(data)
      ? data
      : data.items || [];
    const buId = data.businessUnitId || currentBusinessUnitId;

    if (
      !orgId ||
      typeof orgId !== "string" ||
      !buId ||
      typeof buId !== "string" ||
      selectedProcessesArray.length === 0
    ) {
      if (!buId || typeof buId !== "string") {
        setErrorMessage(
          "Please select a business unit before adding processes."
        );
      }
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Fetch full process data from library using the IDs
      const fullProcessData: any[] = await Promise.all(
        selectedProcessesArray.map(async (process: any) => {
          const fullData = await fetchProcessById(process.id!);
          return fullData;
        })
      );

      // Format the data to match the GET response structure exactly (same format as library GET API)
      const formattedData = fullProcessData.map((data: any) => {
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

        // Transform process_dependency
        const processDependency =
          data.process_dependency?.map((dep: any) => ({
            sourceProcessId: dep.sourceProcessId || dep.source_process_id,
            targetProcessId: dep.targetProcessId || dep.target_process_id,
            relationshipType: dep.relationshipType || dep.relationship_type,
          })) || [];

        // Return data in exact same format as GET response
        return {
          id: data.id,
          autoIncrementId: data.autoIncrementId,
          processCode: data.processCode,
          processName: data.processName,
          processDescription: data.processDescription || "",
          seniorExecutiveOwnerName: data.seniorExecutiveOwnerName || "",
          seniorExecutiveOwnerEmail: data.seniorExecutiveOwnerEmail || null,
          operationsOwnerName: data.operationsOwnerName || "",
          operationsOwnerEmail: data.operationsOwnerEmail || "",
          technologyOwnerName: data.technologyOwnerName || "",
          technologyOwnerEmail: data.technologyOwnerEmail || "",
          organizationalRevenueImpactPercentage:
            data.organizationalRevenueImpactPercentage || null,
          financialMateriality: data.financialMateriality || "",
          thirdPartyInvolvement: data.thirdPartyInvolvement || null,
          usersCustomers: data.usersCustomers || "",
          regulatoryAndCompliance: data.regulatoryAndCompliance || null,
          criticalityOfDataProcessed: data.criticalityOfDataProcessed || "",
          dataProcessed: data.dataProcessed || null,
          status: data.status || "published",
          attributes: attributes,
          process_dependency: processDependency,
          parentObjectId: data.id,
        };
      });

      // Call the POST API to save to organization
      await createOrganizationProcesses(orgId, buId, formattedData);

      // Update current business unit state and URL if different from current
      if (buId !== currentBusinessUnitId) {
        setCurrentBusinessUnitId(buId);
        // Update URL query param
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, businessUnitId: buId },
          },
          undefined,
          { shallow: true }
        );
      }

      // Refresh the list
      await fetchOrganizationProcesses(buId);

      setSuccessMessage("Success! Processes have been added.");
      setShowSuccessMessage(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add processes:", err);
      setErrorMessage(
        err.message || "Failed to add processes. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessToggle = (processId: string | number) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  const handleRemoveSelected = async () => {
    if (
      !orgId ||
      typeof orgId !== "string" ||
      !currentBusinessUnitId ||
      typeof currentBusinessUnitId !== "string"
    ) {
      setErrorMessage("Organization ID and Business Unit ID are required");
      return;
    }

    if (selectedProcesses.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Convert selected process IDs to strings
      const processIds = selectedProcesses.map((id) => String(id));

      await deleteOrganizationProcess(orgId, currentBusinessUnitId, processIds);

      // Refresh the list after successful deletion
      await fetchOrganizationProcesses(currentBusinessUnitId);

      setSuccessMessage(
        `Success! ${selectedProcesses.length} process(es) have been deleted.`
      );
      setShowSuccessMessage(true);
      setSelectedProcesses([]);
    } catch (err: any) {
      console.error("Failed to delete processes:", err);
      setErrorMessage(
        err.message || "Failed to delete processes. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedProcesses([]);
  };

  const handleDeleteSingleProcess = async (processId: string | number) => {
    if (
      !orgId ||
      typeof orgId !== "string" ||
      !currentBusinessUnitId ||
      typeof currentBusinessUnitId !== "string"
    ) {
      setErrorMessage("Organization ID and Business Unit ID are required");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      await deleteOrganizationProcess(
        orgId,
        currentBusinessUnitId,
        String(processId)
      );

      // Refresh the list after successful deletion
      await fetchOrganizationProcesses(currentBusinessUnitId);

      setSuccessMessage("Success! Process has been deleted.");
      setShowSuccessMessage(true);
    } catch (err: any) {
      console.error("Failed to delete process:", err);
      setErrorMessage(
        err.message || "Failed to delete process. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to transform orgProcess to ProcessData format
  const transformToProcessData = useCallback(
    (fullProcess: any): ProcessData => {
      return {
        id: fullProcess.id,
        processCode: fullProcess.processCode,
        processName: fullProcess.processName || "",
        processDescription: fullProcess.processDescription || "",
        seniorExecutiveOwnerName: fullProcess.seniorExecutiveOwnerName || "",
        seniorExecutiveOwnerEmail: fullProcess.seniorExecutiveOwnerEmail || "",
        operationsOwnerName: fullProcess.operationsOwnerName || "",
        operationsOwnerEmail: fullProcess.operationsOwnerEmail || "",
        technologyOwnerName: fullProcess.technologyOwnerName || "",
        technologyOwnerEmail: fullProcess.technologyOwnerEmail || "",
        organizationalRevenueImpactPercentage:
          fullProcess.organizationalRevenueImpactPercentage || null,
        financialMateriality:
          typeof fullProcess.financialMateriality === "boolean"
            ? fullProcess.financialMateriality
            : fullProcess.financialMateriality === "true",
        thirdPartyInvolvement:
          typeof fullProcess.thirdPartyInvolvement === "boolean"
            ? fullProcess.thirdPartyInvolvement
            : fullProcess.thirdPartyInvolvement === "true",
        users: fullProcess.usersCustomers || "",
        requlatoryAndCompliance: fullProcess.regulatoryAndCompliance || [],
        criticalityOfDataProcessed:
          fullProcess.criticalityOfDataProcessed || "",
        dataProcessed: fullProcess.dataProcessed || [],
        status: fullProcess.status || "published",
        attributes:
          fullProcess.attributes?.map((attr: any) => ({
            meta_data_key_id:
              attr.meta_data_key_id || attr.metaDataKeyId || null,
            values: attr.values || [],
          })) || [],
        processDependency:
          fullProcess.processDependency?.map((dep: any) => ({
            sourceProcessId: dep.sourceProcessId || dep.source_process_id,
            targetProcessId: dep.targetProcessId || dep.target_process_id,
            relationshipType: dep.relationshipType || dep.relationship_type,
          })) || [],
      };
    },
    []
  );

  // Memoized handler for editing a process
  const handleEditProcess = useCallback(
    (processId: string | number) => {
      const fullProcess = orgProcesses.find((p: any) => p.id === processId);
      if (fullProcess) {
        const processData = transformToProcessData(fullProcess);
        setSelectedProcess(processData);
        setIsEditOpen(true);
      }
    },
    [orgProcesses, transformToProcessData]
  );

  // Update process
  const handleUpdate = async (status: string) => {
    try {
      if (
        !selectedProcess?.id ||
        !orgId ||
        typeof orgId !== "string" ||
        !currentBusinessUnitId ||
        typeof currentBusinessUnitId !== "string"
      ) {
        throw new Error("Invalid selection");
      }

      // Transform the selectedProcess to match the API format
      const body = { ...selectedProcess, status };

      await updateOrganizationProcess(
        orgId,
        currentBusinessUnitId,
        String(selectedProcess.id),
        body
      );

      setIsEditOpen(false);
      setSelectedProcess(null);

      // Refresh the list
      await fetchOrganizationProcesses(currentBusinessUnitId);

      setSuccessMessage("Success! Process has been updated.");
      setShowSuccessMessage(true);
      setErrorMessage(null);
    } catch (err: any) {
      console.error("Failed to update process:", err);
      setErrorMessage(
        err.message || "Failed to update process. Please try again."
      );
      setShowSuccessMessage(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const toggleDescription = (
    processId: string | number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(processId)) {
        newSet.delete(processId);
      } else {
        newSet.add(processId);
      }
      return newSet;
    });
  };

  // Filter processes based on search term
  const filteredProcesses = processes.filter(
    (process) =>
      process.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (
    loading ||
    (isInitialLoad &&
      isLoading &&
      currentBusinessUnitId &&
      typeof currentBusinessUnitId === "string")
  ) {
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
              Processes
            </Box>
          </Typography>
        </Box>
      </Stack>

      {/* Show message if no business units available */}
      {!loadingBusinessUnits &&
        businessUnits.length === 0 &&
        orgId &&
        typeof orgId === "string" && (
          <Box
            sx={{
              height: "calc(100vh - 95px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F0F2FB",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: 4,
                maxWidth: "600px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: "#484848",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                No business units found for this organization. Please create a
                business unit first to select process.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(`/orgManagement/${orgId}?tab=2`)}
                sx={{
                  backgroundColor: "#04139A",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 500,
                  p: "12px 40px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#030d6b",
                  },
                }}
              >
                Create Business Unit
              </Button>
            </Box>
          </Box>
        )}

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

      {/* Error Toast */}
      {errorMessage && (
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
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

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
        {processes.length === 0 ? (
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
                Looks like there are no processes added yet. <br /> Click on
                &apos;Add Processes&apos; to start adding processes.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleAddProcesses}
                  disabled={
                    !currentBusinessUnitId ||
                    typeof currentBusinessUnitId !== "string" ||
                    businessUnits.length === 0
                  }
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
                    "&:disabled": {
                      backgroundColor: "#E7E7E8",
                      color: "#91939A",
                    },
                  }}
                >
                  Add Processes
                </Button>

                {/* Business Unit Selection */}
                {businessUnits.length > 0 && (
                  <FormControl
                    sx={{
                      minWidth: 250,
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "4px",
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
                  >
                    <InputLabel
                      id="empty-state-business-unit-label"
                      sx={{
                        fontSize: "14px",
                        "&.Mui-focused": {
                          color: "#04139A",
                        },
                      }}
                    >
                      Business Unit
                    </InputLabel>
                    <Select
                      labelId="empty-state-business-unit-label"
                      id="empty-state-business-unit-select"
                      value={currentBusinessUnitId || ""}
                      onChange={handleBusinessUnitChange}
                      label="Business Unit"
                      disabled={loadingBusinessUnits}
                      sx={{
                        fontSize: "14px",
                        color: "#484848",
                        "& .MuiSvgIcon-root": {
                          color: "#04139A",
                        },
                      }}
                    >
                      {businessUnits.map((bu) => (
                        <MenuItem key={bu.id} value={bu.id}>
                          {bu.businessUnitName || bu.buCode || bu.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          // Main content with processes
          <Box
            sx={{
              mx: "auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              pl: "40px",
              pr: "40px",
              mt: "10px",
            }}
          >
            {/* Fixed Header */}
            <Box sx={{ mb: 1, flexShrink: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 500,
                    fontSize: "20px",
                    color: "#484848",
                  }}
                >
                  Processes
                </Typography>

                {/* Business Unit Dropdown */}
                {businessUnits.length > 0 && (
                  <FormControl
                    sx={{
                      minWidth: 250,
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "4px",
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
                  >
                    <InputLabel
                      id="business-unit-label"
                      sx={{
                        fontSize: "14px",
                        "&.Mui-focused": {
                          color: "#04139A",
                        },
                      }}
                    >
                      Business Unit
                    </InputLabel>
                    <Select
                      labelId="business-unit-label"
                      id="business-unit-select"
                      value={currentBusinessUnitId || ""}
                      onChange={handleBusinessUnitChange}
                      label="Business Unit"
                      disabled={loadingBusinessUnits}
                      sx={{
                        fontSize: "14px",
                        color: "#484848",
                        "& .MuiSvgIcon-root": {
                          color: "#04139A",
                        },
                      }}
                    >
                      {businessUnits.map((bu) => (
                        <MenuItem key={bu.id} value={bu.id}>
                          {bu.businessUnitName || bu.buCode || bu.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

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
                  onClick={handleAddProcesses}
                  disabled={
                    !currentBusinessUnitId ||
                    typeof currentBusinessUnitId !== "string"
                  }
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
                    "&:disabled": {
                      backgroundColor: "#E7E7E8",
                      color: "#91939A",
                    },
                  }}
                >
                  Add Processes
                </Button>
              </Box>

              {/* Section Header */}
              {selectedProcesses.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#04139A",
                      mb: selectedProcesses.length > 0 ? 2 : 0,
                    }}
                  >
                    Select Processes
                  </Typography>

                  {/* Selection Controls */}
                  {selectedProcesses.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={`${selectedProcesses.length} selected`}
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

            {/* Scrollable Processes Grid */}
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
                {filteredProcesses.map((process) => {
                  const isExpanded = expandedDescriptions.has(process.id);
                  const descriptionText = `Description: ${process.processDescription}`;
                  const actualDescription = process.processDescription || "";
                  const shouldShowToggle = actualDescription.trim().length > 80;

                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={process.id}>
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
                              checked={selectedProcesses.includes(process.id)}
                              onChange={() => handleProcessToggle(process.id)}
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
                                {process.processName}
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
                                      toggleDescription(process.id, e)
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
                                onAction: () => handleEditProcess(process.id),
                                color: "primary.main",
                                action: "Edit",
                                icon: <EditOutlined fontSize="small" />,
                              },
                              {
                                onAction: () =>
                                  handleDeleteSingleProcess(process.id),
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

      {/* Add Processes Modal */}
      <AddLibraryItemsModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddProcessesFromModal}
        title="Add Processes"
        service={ProcessLibraryService}
        itemType="processes"
        alreadyAddedIds={processes.map((process) => process.id)}
        orgId={orgId}
        initialBusinessUnitId={currentBusinessUnitId}
      />

      {/* Edit Process Modal */}
      {isEditOpen && selectedProcess && (
        <ProcessFormModal
          operation="edit"
          open={isEditOpen}
          processData={selectedProcess}
          setProcessData={(val: any) => {
            if (typeof val === "function") {
              setSelectedProcess((prev) => val(prev as ProcessData));
            } else {
              setSelectedProcess(val);
            }
          }}
          processes={processesData}
          processForListing={processesData}
          metaDatas={metaDatas}
          onSubmit={handleUpdate}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm Dialog for Edit Cancellation */}
      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Process Updation?"
        description="Are you sure you want to cancel the process updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedProcess(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />
    </Box>
  );
}

export default withAuth(ProcessesPage);
