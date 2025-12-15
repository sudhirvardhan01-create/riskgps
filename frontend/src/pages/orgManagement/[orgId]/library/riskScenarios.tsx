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
import { RiskScenarioData, RiskScenarioAttributes } from "@/types/risk-scenario";
import AddLibraryItemsModal from "@/components/OrgManagement/AddLibraryItemsModal";
import { RiskScenarioLibraryService } from "@/services/orgLibraryService/riskScenarioLibraryService";
import {
  createOrganizationRiskScenario,
  createOrganizationRiskScenarios,
  getOrganizationRisks,
  updateOrganizationRiskScenario,
  deleteOrganizationRiskScenario,
} from "@/pages/api/organization";
import { fetchRiskScenarioById } from "@/pages/api/risk-scenario";
import RiskScenarioFormModal from "@/components/Library/RiskScenario/RiskScenarioFormModal";
import MenuItemComponent from "@/components/MenuItemComponent";
import { fetchMetaDatas } from "@/pages/api/meta-data";
import {
  fetchOrganizationProcessesForListing,
  fetchProcessesForListing,
} from "@/pages/api/process";
import ConfirmDialog from "@/components/ConfirmDialog";

interface RiskScenario {
  id: string | number;
  riskScenario: string;
  riskStatement: string;
}

const initialRiskData: RiskScenarioData = {
  riskScenario: "",
  riskStatement: "",
  riskDescription: "",
  ciaMapping: [],
  riskField1: "",
  riskField2: "",
  attributes: [] as RiskScenarioAttributes[],
};

function RiskScenariosPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const { organization, loading, error } = useOrganization(orgId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);
  const [orgRiskScenarios, setOrgRiskScenarios] = useState<any[]>([]); // Full org risk scenarios for matching
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedScenarios, setSelectedScenarios] = useState<
    (string | number)[]
  >([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Set<string | number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRiskScenario, setSelectedRiskScenario] =
    useState<RiskScenarioData | null>(null);
  const [processesData, setProcessesData] = useState<any[]>([]);
  const [metaDatas, setMetaDatas] = useState<any[]>([]);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<RiskScenarioData>(initialRiskData);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}?tab=1`);
  };

  const handleAddRiskScenarios = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const fetchOrganizationRiskScenarios = async () => {
    if (!orgId || typeof orgId !== "string") return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await getOrganizationRisks(orgId);

      // Backend returns { message: "...", data: [scenarios array] }
      if (response?.data && Array.isArray(response.data)) {
        // Store full org risk scenarios for matching with library items
        setOrgRiskScenarios(response.data);

        // Map to display format
        const scenarios: RiskScenario[] = response.data.map(
          (scenario: any) => ({
            id: scenario.id,
            riskScenario: scenario.riskScenario || "",
            riskStatement: scenario.riskStatement || "",
          })
        );
        setRiskScenarios(scenarios);
      } else {
        // If data is empty or not in expected format, set empty array
        setOrgRiskScenarios([]);
        setRiskScenarios([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch organization risk scenarios:", err);
      setErrorMessage(
        err.message || "Failed to fetch risk scenarios. Please try again."
      );
      setOrgRiskScenarios([]);
      setRiskScenarios([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (orgId && typeof orgId === "string" && isInitialLoad) {
      fetchOrganizationRiskScenarios();
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
  }, [orgId, isInitialLoad]);

  // Fetch processes and metaDatas for the edit modal
  useEffect(() => {
    (async () => {
      try {
        const [meta] = await Promise.all([fetchMetaDatas()]);
        // Match exactly what RiskScenarioContainer does - it uses meta.data
        setMetaDatas(meta.data ?? []);
      } catch (err) {
        console.error("Failed to fetch supporting data:", err);
      }
    })();
  }, []);

  const handleAddScenarios = async (selectedScenarios: any[]) => {
    if (!orgId || typeof orgId !== "string" || selectedScenarios.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Fetch full risk scenario data from library using the IDs
      const fullRiskScenarioData: any[] = await Promise.all(
        selectedScenarios.map(async (scenario) => {
          const fullData = await fetchRiskScenarioById(scenario.id!);
          return fullData;
        })
      );

      // Format the data to match the GET response structure (same format as library GET API)
      const formattedData = fullRiskScenarioData.map((data: any) => {
        // Transform attributes to match the expected format (as returned by library GET API)
        const attributes =
          data.attributes?.map((attr: any) => {
            // Handle different possible attribute structures from backend
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
        // Note: getRiskScenarioById doesn't include processes, so related_processes might be missing
        // We'll default to empty array if not present
        let relatedProcesses: string[] = [];
        if (data.related_processes && Array.isArray(data.related_processes)) {
          relatedProcesses = data.related_processes.map((processId: any) => {
            if (typeof processId === "object" && processId?.id) {
              return processId.id;
            }
            return String(processId);
          });
        } else if (data.processes && Array.isArray(data.processes)) {
          // When processes association is included (from getAllRiskScenarios)
          relatedProcesses = data.processes.map((p: any) => String(p.id));
        }

        return {
          id: data.id,
          autoIncrementId: data.autoIncrementId,
          riskCode: data.riskCode,
          riskScenario: data.riskScenario,
          riskDescription: data.riskDescription || "",
          riskStatement: data.riskStatement || "",
          ciaMapping: data.ciaMapping || [],
          status: data.status || "published",
          riskField1: data.riskField1 || "",
          riskField2: data.riskField2 || "",
          attributes: attributes,
          related_processes: relatedProcesses,
          parentObjectId: data.id,
        };
      });

      // Call the POST API to save to organization
      await createOrganizationRiskScenarios(orgId, formattedData);

      // Refresh the list
      await fetchOrganizationRiskScenarios();

      setSuccessMessage("Success! Risk scenarios have been added.");
      setShowSuccessMessage(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add risk scenarios:", err);
      setErrorMessage(
        err.message || "Failed to add risk scenarios. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioToggle = (scenarioId: string | number) => {
    setSelectedScenarios((prev) =>
      prev.includes(scenarioId)
        ? prev.filter((id) => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const handleRemoveSelected = async () => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    if (selectedScenarios.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Convert selected scenario IDs to strings
      const scenarioIds = selectedScenarios.map((id) => String(id));

      await deleteOrganizationRiskScenario(orgId, scenarioIds);

      // Refresh the list after successful deletion
      await fetchOrganizationRiskScenarios();

      setSuccessMessage(
        `Success! ${selectedScenarios.length} risk scenario(s) have been deleted.`
      );
      setShowSuccessMessage(true);
      setSelectedScenarios([]);
    } catch (err: any) {
      console.error("Failed to delete risk scenarios:", err);
      setErrorMessage(
        err.message || "Failed to delete risk scenarios. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedScenarios([]);
  };

  const handleDeleteSingleScenario = async (scenarioId: string | number) => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      await deleteOrganizationRiskScenario(orgId, String(scenarioId));

      // Refresh the list after successful deletion
      await fetchOrganizationRiskScenarios();

      setSuccessMessage("Success! Risk scenario has been deleted.");
      setShowSuccessMessage(true);
    } catch (err: any) {
      console.error("Failed to delete risk scenario:", err);
      setErrorMessage(
        err.message || "Failed to delete risk scenario. Please try again."
      );
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to transform orgRiskScenario to RiskScenarioData format
  const transformToRiskScenarioData = useCallback(
    (fullScenario: any): RiskScenarioData => {
      return {
        id: fullScenario.id,
        riskCode: fullScenario.riskCode,
        riskScenario: fullScenario.riskScenario || "",
        riskStatement: fullScenario.riskStatement || "",
        riskDescription: fullScenario.riskDescription || "",
        ciaMapping: fullScenario.ciaMapping || [],
        riskField1: fullScenario.riskField1 || "",
        riskField2: fullScenario.riskField2 || "",
        attributes:
          fullScenario.attributes?.map((attr: any) => ({
            meta_data_key_id:
              attr.meta_data_key_id || attr.metaDataKeyId || null,
            values: attr.values || [],
          })) || [],
        related_processes: fullScenario.processes?.map((p: any) => {
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
        status: fullScenario.status || "published",
      };
    },
    []
  );

  // Memoized handler for editing a risk scenario
  const handleEditScenario = useCallback(
    (scenarioId: string | number) => {
      const fullScenario = orgRiskScenarios.find(
        (rs: any) => rs.id === scenarioId
      );
      if (fullScenario) {
        const riskScenarioData = transformToRiskScenarioData(fullScenario);
        console.log(riskScenarioData)
        setSelectedRiskScenario(riskScenarioData);
        setIsEditOpen(true);
      }
    },
    [orgRiskScenarios, transformToRiskScenarioData]
  );

  // Update risk scenario
  const handleUpdate = async (status: string) => {
    try {
      if (!selectedRiskScenario?.id || !orgId || typeof orgId !== "string") {
        throw new Error("Invalid selection");
      }

      // Transform the selectedRiskScenario to match the API format
      const body = { ...selectedRiskScenario, status };

      await updateOrganizationRiskScenario(
        orgId,
        String(selectedRiskScenario.id),
        body
      );

      setIsEditOpen(false);
      setSelectedRiskScenario(null);

      // Refresh the list
      await fetchOrganizationRiskScenarios();

      setSuccessMessage("Success! Risk scenario has been updated.");
      setShowSuccessMessage(true);
      setErrorMessage(null);
    } catch (err: any) {
      console.error("Failed to update risk scenario:", err);
      setErrorMessage(
        err.message || "Failed to update risk scenario. Please try again."
      );
      setShowSuccessMessage(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const toggleDescription = (
    scenarioId: string | number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId);
      } else {
        newSet.add(scenarioId);
      }
      return newSet;
    });
  };

  // Filter scenarios based on search term
  const filteredScenarios = riskScenarios.filter(
    (scenario) =>
      scenario.riskScenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.riskStatement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateRiskScenarios = () => {
    setFormData(initialRiskData);
    setIsAddOpen(true);
  };

  // Create risk scenario
  const handleCreate = async (status: string) => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Transform formData to match the API format (single object, not array)
      const formattedData = {
        riskScenario: formData.riskScenario,
        riskDescription: formData.riskDescription || "",
        riskStatement: formData.riskStatement || "",
        ciaMapping: formData.ciaMapping || [],
        status: status,
        riskField1: formData.riskField1 || "",
        riskField2: formData.riskField2 || "",
        related_processes: formData.related_processes?.map((p: any) => String(p)) || [],
        attributes: formData.attributes?.map((attr: any) => ({
          meta_data_key_id: attr.meta_data_key_id || attr.metaDataKeyId || null,
          values: attr.values || [],
        })) || [],
      };

      await createOrganizationRiskScenario(orgId, formattedData);

      // Reset form and close modal
      setFormData(initialRiskData);
      setIsAddOpen(false);

      // Refresh the list
      await fetchOrganizationRiskScenarios();

      setSuccessMessage(`Success! Risk scenario ${status === "published" ? "published" : "saved as draft"}`);
      setShowSuccessMessage(true);
    } catch (err: any) {
      console.error("Failed to create risk scenario:", err);
      setErrorMessage(err.message || "Failed to create risk scenario. Please try again.");
      setShowSuccessMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation before create
  const handleFormValidation = async (status: string) => {
    if (!orgId || typeof orgId !== "string") {
      setErrorMessage("Organization ID is required");
      return;
    }

    try {
      // Check if risk scenario with same name already exists in organization
      const existingScenarios = orgRiskScenarios.filter(
        (rs: any) => rs.riskScenario?.trim().toLowerCase() === formData.riskScenario.trim().toLowerCase()
      );

      if (existingScenarios.length > 0) {
        setErrorMessage("Risk Scenario already exists in this organization");
        setShowSuccessMessage(false);
      } else {
        handleCreate(status);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to validate risk scenario");
      setShowSuccessMessage(false);
    }
  };

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
              Risk Scenarios
            </Box>
          </Typography>
        </Box>
      </Stack>

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
          {successMessage || "Success! Risk scenarios have been added."}
        </Alert>
      </Snackbar>

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
        {riskScenarios.length === 0 ? (
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
                Looks like there are no risk scenarios added yet. <br /> Click
                on &apos;Add Risk Scenarios&apos; to start adding risk
                scenarios.
              </Typography>

              {/*<Button
                variant="contained"
                onClick={handleAddRiskScenarios}
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
                Add Risk Scenarios
              </Button>*/}
              <Button
                variant="contained"
                onClick={handleOpenCreateRiskScenarios}
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
                Create Risk Scenarios
              </Button>
            </Box>
          </Box>
        ) : (
          // Main content with scenarios
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
                Risk Scenarios
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
                {/* <Button
                  variant="contained"
                  onClick={handleAddRiskScenarios}
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
                  Add Risk Scenarios
                </Button> */}
                <Button
                  variant="contained"
                  onClick={handleOpenCreateRiskScenarios}
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
                  Create Risk Scenarios
                </Button>
              </Box>

              {/* Section Header */}
              {selectedScenarios.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#04139A",
                      mb: selectedScenarios.length > 0 ? 2 : 0,
                    }}
                  >
                    Select Risk Scenarios
                  </Typography>

                  {/* Selection Controls */}
                  {selectedScenarios.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={`${selectedScenarios.length} selected`}
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

            {/* Scrollable Risk Scenarios Grid */}
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
                {filteredScenarios.map((scenario) => {
                  const isExpanded = expandedDescriptions.has(scenario.id);
                  const descriptionText = `Description: ${scenario.riskStatement}`;
                  const actualDescription = scenario.riskStatement || "";
                  const shouldShowToggle = actualDescription.trim().length > 80;
                  // Find the full risk scenario data to check for parentObjectId
                  const fullScenario = orgRiskScenarios.find((rs: any) => rs.id === scenario.id);
                  const hasParentObjectId = fullScenario?.parentObjectId != null;

                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={scenario.id}>
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
                              checked={selectedScenarios.includes(scenario.id)}
                              onChange={() => handleScenarioToggle(scenario.id)}
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
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#484848",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {scenario.riskScenario}
                                </Typography>
                                {hasParentObjectId && (
                                  <Chip
                                    label="Imported"
                                    size="small"
                                    sx={{
                                      backgroundColor: "#04139A",
                                      color: "#FFFFFF",
                                      fontSize: "11px",
                                      height: "20px",
                                      fontWeight: 500,
                                      "& .MuiChip-label": {
                                        px: 1,
                                      },
                                    }}
                                  />
                                )}
                              </Box>
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
                                      toggleDescription(scenario.id, e)
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
                                onAction: () => handleEditScenario(scenario.id),
                                color: "primary.main",
                                action: "Edit",
                                icon: <EditOutlined fontSize="small" />,
                              },
                              {
                                onAction: () =>
                                  handleDeleteSingleScenario(scenario.id),
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

      {/* Add Risk Scenarios Modal */}
      <AddLibraryItemsModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddScenarios}
        title="Add Risk Scenarios"
        service={RiskScenarioLibraryService}
        itemType="risk-scenarios"
        orgItems={orgRiskScenarios}
      />

      {/* Add Risk Scenario Modal */}
      {isAddOpen && (
        <RiskScenarioFormModal
          operation="create"
          open={isAddOpen}
          riskData={formData}
          setRiskData={setFormData}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleFormValidation}
          onClose={() => setIsAddConfirmOpen(true)}
        />
      )}

      {/* Edit Risk Scenario Modal */}
      {isEditOpen && selectedRiskScenario && (
        <RiskScenarioFormModal
          operation="edit"
          open={isEditOpen}
          riskData={selectedRiskScenario}
          setRiskData={(val: any) => {
            if (typeof val === "function") {
              setSelectedRiskScenario((prev) => val(prev as RiskScenarioData));
            } else {
              setSelectedRiskScenario(val);
            }
          }}
          processes={processesData}
          metaDatas={metaDatas}
          onSubmit={handleUpdate}
          onClose={() => setIsEditConfirmOpen(true)}
        />
      )}

      {/* Confirm Dialog for Add Cancellation */}
      <ConfirmDialog
        open={isAddConfirmOpen}
        onClose={() => setIsAddConfirmOpen(false)}
        title="Cancel Risk Scenario Creation?"
        description="Are you sure you want to cancel the risk scenario creation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsAddConfirmOpen(false);
          setFormData(initialRiskData);
          setIsAddOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />

      {/* Confirm Dialog for Edit Cancellation */}
      <ConfirmDialog
        open={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        title="Cancel Risk Scenario Updation?"
        description="Are you sure you want to cancel the risk scenario updation? Any unsaved changes will be lost."
        onConfirm={() => {
          setIsEditConfirmOpen(false);
          setSelectedRiskScenario(null);
          setIsEditOpen(false);
        }}
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
      />
    </Box>
  );
}

export default withAuth(RiskScenariosPage);
