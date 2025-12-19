import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/router";
import DisableConfirmationModal from "./DisableConfirmationModal";
import AssessmentTable from "../../Assessment/AssessmentTable";
import { Assessment } from "@/types/assessment";
import { BusinessUnitData } from "@/types/business-unit";
import { ProcessData } from "@/types/process";
import { getAssessmentsByBusinessUnit } from "@/services/businessUnitService";
import { fetchOrganizationProcessesForListing } from "@/pages/api/process";
import { getOrganizationProcess, deleteOrganizationProcess, assignProcessesToBusinessUnit } from "@/pages/api/organization";
import ToastComponent from "@/components/ToastComponent";

// Extended interface for modal-specific data
interface BusinessUnitDataWithAssessment extends BusinessUnitData {
  assessmentData?: Assessment[];
}

interface BusinessUnitDetailsModalProps {
  open: boolean;
  onClose: () => void;
  businessUnit: BusinessUnitDataWithAssessment | null;
  onEdit: (businessUnit: BusinessUnitDataWithAssessment) => void;
  onStatusChange: (id: string, status: "active" | "disable") => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bu-details-tabpanel-${index}`}
      aria-labelledby={`bu-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
}

const BusinessUnitDetailsModal: React.FC<BusinessUnitDetailsModalProps> = ({
  open,
  onClose,
  businessUnit,
  onEdit,
  onStatusChange,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedProcesses, setAssignedProcesses] = useState<ProcessData[]>([]);
  const [processLoading, setProcessLoading] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [allProcesses, setAllProcesses] = useState<ProcessData[]>([]);
  const [allProcessesLoading, setAllProcessesLoading] = useState(false);
  const [selectedProcessIds, setSelectedProcessIds] = useState<Set<number>>(new Set());
  const [assigningProcesses, setAssigningProcesses] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "warning" | "info" | "success",
  });

  // Fetch assessment data when modal opens or business unit changes
  useEffect(() => {
    if (open && businessUnit?.id && activeTab === 2) {
      fetchAssessmentData();
    }
  }, [open, businessUnit?.id, activeTab]);

  // Fetch assigned processes when Processes tab is active
  // This will only show processes linked to the current business unit
  // If there are multiple business units in the org, each BU will only see its own processes
  useEffect(() => {
    if (open && businessUnit?.orgId && businessUnit?.id && activeTab === 1) {
      fetchAssignedProcesses();
    }
  }, [open, businessUnit?.orgId, businessUnit?.id, activeTab]);

  const fetchAssessmentData = async () => {
    if (!businessUnit?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getAssessmentsByBusinessUnit(
        businessUnit.orgId,
        businessUnit.id
      );
      // const formattedData = response.data.map(formatAssessmentData);
      setAssessmentData(response.data);

      // Show success toast
      setToast({
        open: true,
        message: "Assessment data loaded successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error fetching assessment data:", err);
      setError("Failed to load assessment data");
      setAssessmentData([]);

      // Show error toast
      setToast({
        open: true,
        message: "Failed to load assessment data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedProcesses = async () => {
    if (!businessUnit?.orgId || !businessUnit?.id) return;

    setProcessLoading(true);
    setProcessError(null);

    try {
      // This API call filters processes by the specific business unit ID
      // Only processes linked to this business unit will be returned
      // If there are multiple BUs in the org, each BU will only see its own processes
      const response = await getOrganizationProcess(
        businessUnit.orgId,
        businessUnit.id,
        0,
        -1 // Get all processes
      );
      const processes = response.data?.data || response.data || [];
      setAssignedProcesses(Array.isArray(processes) ? processes : []);
    } catch (err: any) {
      console.error("Error fetching assigned processes:", err);
      // If it's a 404 or "no processes found", treat as empty state
      if (err.message?.toLowerCase().includes("no processes found")) {
        setAssignedProcesses([]);
      } else {
        setProcessError("Failed to load assigned processes");
        setAssignedProcesses([]);
      }
    } finally {
      setProcessLoading(false);
    }
  };

  const fetchAllProcesses = async () => {
    if (!businessUnit?.orgId || !businessUnit?.id) return;

    setAllProcessesLoading(true);

    try {
      const response = await fetchOrganizationProcessesForListing(
        businessUnit.orgId
      );
      const processes = response.data || [];
      
      // Filter processes:
      // 1. Show processes not assigned to any BU (orgBusinessUnitId is null/undefined)
      // 2. Show processes assigned to current BU (to show as checked and disabled)
      // 3. Hide processes assigned to other BUs
      const filteredProcesses = processes.filter((process: ProcessData) => {
        const processBuId = process.orgBusinessUnitId;
        // Show if not assigned to any BU or assigned to current BU
        return !processBuId || processBuId === businessUnit.id;
      });
      
      setAllProcesses(filteredProcesses);
      
      // Pre-check processes that are already assigned to current business unit
      const alreadyAssignedProcessIds = new Set<number>();
      filteredProcesses.forEach((process: ProcessData) => {
        if (process.orgBusinessUnitId === businessUnit.id && process.id) {
          alreadyAssignedProcessIds.add(process.id);
        }
      });
      setSelectedProcessIds(alreadyAssignedProcessIds);
    } catch (err) {
      console.error("Error fetching all processes:", err);
      setAllProcesses([]);
    } finally {
      setAllProcessesLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0); // Reset to Basic Details tab
    onClose();
  };

  const handleEdit = () => {
    if (businessUnit) {
      // Don't close the modal here - let the parent handle it after setting edit state
      // This prevents race conditions with state updates
      onEdit(businessUnit);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!businessUnit) return;

    const newStatus = event.target.checked ? "active" : "disable";

    // If trying to disable, show confirmation modal
    if (newStatus === "disable") {
      setShowDisableModal(true);
    } else {
      // If enabling, proceed directly
      onStatusChange(businessUnit.id, newStatus);
    }
  };

  const handleDisableConfirm = () => {
    if (businessUnit) {
      onStatusChange(businessUnit.id, "disable");
      setShowDisableModal(false);
    }
  };

  const handleDisableCancel = () => {
    setShowDisableModal(false);
  };

  const handleCreateAssessment = () => {
    // Navigate to assessment route
    router.push("/assessment");
  };

  const handleCreateProcess = () => {
    // Navigate to processes page with orgId and businessUnitId
    if (businessUnit?.orgId && businessUnit?.id) {
      router.push(
        `/orgManagement/${businessUnit.orgId}/library/processes?businessUnitId=${businessUnit.id}`
      );
    }
  };

  const handleProcessCheckboxChange = (processId: number) => {
    // Find the process to check if it's already assigned
    const process = allProcesses.find((p) => p.id === processId);
    const processBuId = process?.orgBusinessUnitId;
    const isAlreadyAssigned = processBuId === businessUnit?.id;
    
    // Prevent unchecking already assigned processes
    if (isAlreadyAssigned) {
      return;
    }
    
    setSelectedProcessIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(processId)) {
        newSet.delete(processId);
      } else {
        newSet.add(processId);
      }
      return newSet;
    });
  };

  const handleOpenAssignModal = () => {
    setShowAssignModal(true);
    setSelectedProcessIds(new Set());
    fetchAllProcesses();
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedProcessIds(new Set());
  };

  const handleAssignProcesses = async () => {
    if (!businessUnit?.orgId || !businessUnit?.id || selectedProcessIds.size === 0) {
      return;
    }

    setAssigningProcesses(true);
    try {
      // Get selected processes from allProcesses array based on selected IDs
      const selectedProcessIdsArray = Array.from(selectedProcessIds);
      
      // Filter out processes that are already assigned to current business unit
      const selectedProcesses = allProcesses.filter((process) => {
        const processId = process.id;
        const processBuId = process.orgBusinessUnitId;
        const isAlreadyAssigned = processBuId === businessUnit.id;
        
        // Only include if selected and not already assigned
        return (
          processId !== undefined &&
          selectedProcessIdsArray.includes(processId) &&
          !isAlreadyAssigned
        );
      });

      if (selectedProcesses.length === 0) {
        setToast({
          open: true,
          message: "No new processes to assign",
          severity: "warning",
        });
        setAssigningProcesses(false);
        return;
      }

      // Extract process IDs and convert to strings (UUIDs)
      const processIds = selectedProcesses
        .map((process) => process.id)
        .filter((id) => id !== undefined)
        .map((id) => String(id));

      // Call PUT API to assign processes
      await assignProcessesToBusinessUnit(
        businessUnit.orgId,
        businessUnit.id,
        processIds
      );

      // Show success toast
      setToast({
        open: true,
        message: `Successfully assigned ${selectedProcesses.length} process(es) to business unit`,
        severity: "success",
      });

      // Close modal and refresh assigned processes
      handleCloseAssignModal();
      fetchAssignedProcesses();
    } catch (err) {
      console.error("Error assigning processes:", err);
      setToast({
        open: true,
        message: "Failed to assign processes to business unit",
        severity: "error",
      });
    } finally {
      setAssigningProcesses(false);
    }
  };

  const handleDeleteProcess = async (processId: number | undefined) => {
    if (!businessUnit?.orgId || !businessUnit?.id || !processId) return;

    try {
      await deleteOrganizationProcess(
        businessUnit.orgId,
        [String(processId)],
        businessUnit.id
      );

      // Show success toast
      setToast({
        open: true,
        message: "Process removed successfully",
        severity: "success",
      });

      // Refresh assigned processes
      fetchAssignedProcesses();
    } catch (err) {
      console.error("Error deleting process:", err);
      setToast({
        open: true,
        message: "Failed to remove process",
        severity: "error",
      });
    }
  };

  // Early return after all hooks
  if (!businessUnit) return null;

  // Calculate count of new processes (not already assigned) for button disabled state
  const newProcessCount = Array.from(selectedProcessIds).filter((processId) => {
    const process = allProcesses.find((p) => p.id === processId);
    const processBuId = process?.orgBusinessUnitId;
    return processBuId !== businessUnit.id;
  }).length;

  const contactRoles = [
    {
      role: "BU Head",
      name: businessUnit.buHead?.name || "-",
      email: businessUnit.buHead?.email || "-",
    },
    {
      role: "BU POC/BISO",
      name: businessUnit.buPocBiso?.name || "-",
      email: businessUnit.buPocBiso?.email || "-",
    },
    {
      role: "BU IT POC",
      name: businessUnit.buItPoc?.name || "-",
      email: businessUnit.buItPoc?.email || "-",
    },
    {
      role: "BU Finance Lead",
      name: businessUnit.buFinanceLead?.name || "-",
      email: businessUnit.buFinanceLead?.email || "-",
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            maxHeight: "90vh",
            width: "1034px",
            padding: "5px 24px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 3,
            pl: 0,
            pr: 0,
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, color: "#121212" }}>
              {businessUnit.businessUnitName}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={businessUnit.status === "active"}
                  onChange={handleStatusChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#147A50",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#147A50",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      businessUnit.status === "active" ? "#147A50" : "#9E9E9E",
                    fontWeight: 400,
                  }}
                >
                  {businessUnit.status === "active" ? "Active" : "Disable"}
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {activeTab !== 2 && (
              <IconButton
                onClick={handleEdit}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Image
                  src={"/edit-icon.png"}
                  alt="edit-icon"
                  width={20}
                  height={20}
                />
              </IconButton>
            )}
            <IconButton
              onClick={handleClose}
              sx={{
                width: 24,
                height: 24,
                color: "#484848",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <CloseIcon sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="business unit details tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minHeight: "32px",
                height: "32px",
                border: "1px solid #E7E7E8",
                borderRadius: "2px",
                backgroundColor: "#FFFFFF",
                color: "#91939A",
                padding: "7px 12px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  color: "#484848",
                },
                "&.Mui-selected": {
                  backgroundColor: "#EDF3FCA3",
                  color: "#484848",
                  border: "1px solid #04139A",
                  fontWeight: 500,
                },
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab label="Basic Details" />
            <Tab label="Assign Processes" />
            <Tab label="Assessments" />
          </Tabs>

          {activeTab === 1 && assignedProcesses.length > 0 && (
            <Button
              variant="contained"
              onClick={handleOpenAssignModal}
              disabled={businessUnit.status === "disable"}
              sx={{
                minHeight: "32px",
                height: "32px",
                backgroundColor:
                  businessUnit.status === "disable" ? "#E7E7E8" : "#04139A",
                color:
                  businessUnit.status === "disable" ? "#91939A" : "#FFFFFF",
                textTransform: "none",
                fontWeight: 500,
                padding: "7px 12px",
                borderRadius: "2px",
                "&:hover": {
                  backgroundColor:
                    businessUnit.status === "disable" ? "#E7E7E8" : "#04139A",
                  opacity: businessUnit.status === "disable" ? 1 : 0.9,
                },
                "&.Mui-disabled": {
                  backgroundColor: "#E7E7E8",
                  color: "#91939A",
                },
              }}
            >
              Assign Process
            </Button>
          )}
          {activeTab === 2 && (
            <Button
              variant="contained"
              onClick={handleCreateAssessment}
              disabled={businessUnit.status === "disable"}
              sx={{
                minHeight: "32px",
                height: "32px",
                backgroundColor:
                  businessUnit.status === "disable" ? "#E7E7E8" : "#04139A",
                color:
                  businessUnit.status === "disable" ? "#91939A" : "#FFFFFF",
                textTransform: "none",
                fontWeight: 500,
                padding: "7px 12px",
                borderRadius: "2px",
                "&:hover": {
                  backgroundColor:
                    businessUnit.status === "disable" ? "#E7E7E8" : "#04139A",
                  opacity: businessUnit.status === "disable" ? 1 : 0.9,
                },
                "&.Mui-disabled": {
                  backgroundColor: "#E7E7E8",
                  color: "#91939A",
                },
              }}
            >
              Create Assessment
            </Button>
          )}

        </Box>

        <DialogContent
          sx={{
            p: "0 !important",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          <TabPanel value={activeTab} index={0} sx={{ p: 0, m: 0 }}>
            <Box sx={{ p: 0 }}>
              {/* Contact Roles Section */}
              <Box>
                <Stack spacing={2}>
                  {contactRoles.map((contact, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: "#E7E7E84D",
                        border: "1px solid #E7E7E8",
                        borderRadius: "8px",
                        padding: "12px",
                        boxShadow: "0px 1px 3px #E7E7E84D",
                        height: "86px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#121212",
                          mb: 0.5,
                        }}
                      >
                        {contact.role}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#91939A",
                            }}
                          >
                            Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontWeight: 400,
                            }}
                          >
                            {contact.name}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#91939A",
                            }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontWeight: 400,
                            }}
                          >
                            {contact.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Tags Section */}
              {/* {businessUnit.tags && businessUnit.tags.length > 0 && (
                <Box
                  sx={{
                    backgroundColor: "#E7E7E84D",
                    border: "1px solid #E7E7E8",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0px 1px 3px #E7E7E84D",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#121212",
                      mb: 1,
                    }}
                  >
                    Tags
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 2,
                    }}
                  >
                    {businessUnit.tags.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          backgroundColor: "#FFFFFF",
                          p: 1,
                          borderRadius: "4px",
                          border: "1px solid #E7E7E8",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#91939A",
                              mb: 1,
                            }}
                          >
                            Key
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontWeight: 400,
                            }}
                          >
                            {tag.key}
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "#91939A",
                              mb: 1,
                            }}
                          >
                            Value
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontWeight: 400,
                            }}
                          >
                            {tag.value}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )} */}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1} sx={{ p: 0, m: 0 }}>
            <Box sx={{ p: 0 }}>
              {processLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : processError ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  {processError}
                </Alert>
              ) : assignedProcesses.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                    minHeight: "400px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      maxWidth: "500px",
                    }}
                  >
                    {/* Empty state icon */}
                    <Box
                      sx={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "8px",
                        margin: "0 auto 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#F5F5F5",
                      }}
                    >
                      <Image
                        src={"/create.png"}
                        alt="empty-processes"
                        width={120}
                        height={120}
                      />
                    </Box>

                    {/* Empty state text */}
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: "#484848",
                        fontWeight: 400,
                      }}
                    >
                      Looks like there are no process assigned yet to BU.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: "#484848",
                        fontWeight: 400,
                      }}
                    >
                      Click on &apos;Assign Process&apos; to start assigning process to BU.
                    </Typography>

                    {/* Assign button */}
                    <Button
                      variant="contained"
                      onClick={handleOpenAssignModal}
                      disabled={businessUnit.status === "disable"}
                      sx={{
                        backgroundColor:
                          businessUnit.status === "disable" ? "#E7E7E8" : "#04139A",
                        color:
                          businessUnit.status === "disable" ? "#91939A" : "#FFFFFF",
                        textTransform: "none",
                        fontWeight: 500,
                        padding: "12px 40px",
                        borderRadius: "4px",
                        minWidth: "200px",
                        height: "40px",
                        "&:hover": {
                          backgroundColor:
                            businessUnit.status === "disable" ? "#E7E7E8" : "#030d6b",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#E7E7E8",
                          color: "#91939A",
                        },
                      }}
                    >
                      Assign Process
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {assignedProcesses.map((process) => {
                    return (
                      <Box
                        key={process.id ?? process.processCode}
                        sx={{
                          backgroundColor: "#E7E7E84D",
                          border: "1px solid #E7E7E8",
                          borderRadius: "8px",
                          padding: "12px",
                          boxShadow: "0px 1px 3px #E7E7E84D",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#121212",
                              mb: 0.5,
                            }}
                          >
                            {process.processName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontWeight: 400,
                            }}
                          >
                            {process.processDescription || "No description available"}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => handleDeleteProcess(process.id)}
                          disabled={businessUnit.status === "disable"}
                          sx={{
                            color: "#91939A",
                            "&:hover": {
                              color: "#d32f2f",
                              backgroundColor: "#ffebee",
                            },
                            "&.Mui-disabled": {
                              color: "#E7E7E8",
                            },
                            padding: "4px",
                          }}
                          size="small"
                        >
                          <DeleteIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2} sx={{ p: 0, m: 0 }}>
            <Box sx={{ p: 0 }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ m: 2 }}>
                  {error}
                </Alert>
              ) : (
                <AssessmentTable
                  data={assessmentData}
                  onMenuClick={(
                    event: React.MouseEvent<HTMLElement>,
                    runId: string
                  ) => {
                    console.log("Menu clicked for runId:", runId);
                    // Handle menu click - you can add your logic here
                  }}
                  onCardClick={(runId: string) => {
                    console.log("Card clicked for runId:", runId);
                    // Handle card click - you can add your logic here
                  }}
                  variant="businessUnit"
                  businessUnitName={businessUnit.businessUnitName}
                />
              )}
            </Box>
          </TabPanel>
        </DialogContent>
      </Dialog>

      <DisableConfirmationModal
        open={showDisableModal}
        onClose={handleDisableCancel}
        onConfirm={handleDisableConfirm}
        businessUnitName={businessUnit.businessUnitName}
      />

      {/* Assign Processes Modal */}
      <Dialog
        open={showAssignModal}
        onClose={handleCloseAssignModal}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 3,
            pb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#121212" }}>
            Assign Processes
          </Typography>
          <IconButton
            onClick={handleCloseAssignModal}
            sx={{
              width: 24,
              height: 24,
              color: "#484848",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <CloseIcon sx={{ width: 24, height: 24 }} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            p: 3,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {allProcessesLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : allProcesses.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <Typography variant="body2" sx={{ color: "#91939A" }}>
                No processes available
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {allProcesses.map((process) => {
                const processId = process.id;
                const isSelected =
                  processId !== undefined && selectedProcessIds.has(processId);
                // Check if process is already assigned to current business unit
                const processBuId = process.orgBusinessUnitId;
                const isAlreadyAssigned = processBuId === businessUnit.id;
                const isDisabled = businessUnit.status === "disable" || isAlreadyAssigned;

                return (
                  <Box
                    key={process.id ?? process.processCode}
                    sx={{
                      backgroundColor: "#E7E7E84D",
                      border: "1px solid #E7E7E8",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "0px 1px 3px #E7E7E84D",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      opacity: isAlreadyAssigned ? 0.7 : 1,
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() =>
                        processId !== undefined &&
                        handleProcessCheckboxChange(processId)
                      }
                      disabled={isDisabled}
                      sx={{
                        color: "#04139A",
                        "&.Mui-checked": {
                          color: "#04139A",
                        },
                        "&.Mui-disabled": {
                          color: "#E7E7E8",
                        },
                        padding: "4px",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#121212",
                          mb: 0.5,
                        }}
                      >
                        {process.processName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#484848",
                          fontWeight: 400,
                        }}
                      >
                        {process.processDescription || "No description available"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </DialogContent>

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 3,
            pt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseAssignModal}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "2px",
              borderColor: "#E7E7E8",
              color: "#484848",
              "&:hover": {
                borderColor: "#E7E7E8",
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignProcesses}
            disabled={
              businessUnit.status === "disable" ||
              assigningProcesses ||
              newProcessCount === 0
            }
            sx={{
              backgroundColor:
                businessUnit.status === "disable" ||
                selectedProcessIds.size === 0
                  ? "#E7E7E8"
                  : "#04139A",
              color:
                businessUnit.status === "disable" ||
                selectedProcessIds.size === 0
                  ? "#91939A"
                  : "#FFFFFF",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "2px",
              "&:hover": {
                backgroundColor:
                  businessUnit.status === "disable" ||
                  selectedProcessIds.size === 0
                    ? "#E7E7E8"
                    : "#030d6b",
              },
              "&.Mui-disabled": {
                backgroundColor: "#E7E7E8",
                color: "#91939A",
              },
            }}
          >
            {assigningProcesses ? "Assigning..." : "Assign"}
          </Button>
        </Box>
      </Dialog>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        toastSeverity={toast.severity}
        toastBorder={
          toast.severity === "success" ? "1px solid #147A50" : undefined
        }
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={
          toast.severity === "success" ? "#DDF5EB" : undefined
        }
      />
    </>
  );
};

export default BusinessUnitDetailsModal;
