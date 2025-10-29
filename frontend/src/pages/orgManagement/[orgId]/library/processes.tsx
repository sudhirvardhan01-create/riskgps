import { useRouter } from "next/router";
import { useState } from "react";
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
} from "@mui/material";
import { ArrowBack, Search, Delete, Close } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { useOrganization } from "@/hooks/useOrganization";
import Image from "next/image";
import AddLibraryItemsModal from "@/components/OrgManagement/AddLibraryItemsModal";
import { ProcessLibraryService } from "@/services/orgLibraryService/processLibraryService";

interface Process {
  id: string | number;
  processName: string;
  processDescription: string;
}

function ProcessesPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const { organization, loading, error } = useOrganization(orgId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedProcesses, setSelectedProcesses] = useState<(string | number)[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}?tab=1`);
  };

  const handleAddProcesses = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddProcessesFromModal = (selectedProcesses: any[]) => {
    // Convert library items to Process format for display
    const newProcesses: Process[] = selectedProcesses.map(process => ({
      id: process.id!,
      processName: process.name,
      processDescription: process.description
    }));

    setProcesses(prev => [...prev, ...newProcesses]);
    setShowSuccessMessage(true);
    setIsAddModalOpen(false);
  };

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedProcesses([]);
  };

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedProcesses([]);
  };

  const handleProcessToggle = (processId: string | number) => {
    setSelectedProcesses(prev =>
      prev.includes(processId)
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const handleRemoveSelected = () => {
    setProcesses(prev => prev.filter(process => !selectedProcesses.includes(process.id)));
    setSelectedProcesses([]);
    setIsDeleteMode(false);
  };

  const handleClearSelection = () => {
    setSelectedProcesses([]);
    setIsDeleteMode(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Filter processes based on search term
  const filteredProcesses = processes.filter(process =>
    process.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.processDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading organization: {error}</Typography>
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

      {/* Success Toast */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{
            width: '100%',
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
          Success! Processes have been added.
        </Alert>
      </Snackbar>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        px: 3,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // Important for flex children to shrink
      }}>
        {processes.length === 0 ? (
          // Empty state
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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
                Looks like there are no processes added yet. <br /> Click on &apos;Add Processes&apos; to start adding processes.
              </Typography>

              <Button
                variant="contained"
                onClick={handleAddProcesses}
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
                Add Processes
              </Button>
            </Box>
          </Box>
        ) : (
          // Main content with processes
          <Box sx={{ mx: "auto", height: "100%", display: "flex", flexDirection: "column", pl: "40px", pr: "40px", mt: "10px" }}>
            {/* Fixed Header */}
            <Box sx={{ mb: 1, flexShrink: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: "20px",
                  color: "#484848",
                  mb: 3
                }}
              >
                Processes
              </Typography>

              {/* Search Bar and Action Buttons Row */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3, width: "1100px" }}>
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
                  Add Processes
                </Button>
              </Box>

              {/* Section Header */}
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
            </Box>

            {/* Scrollable Processes Grid */}
            <Box sx={{
              flex: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
              mb: 4,
            }}>
              <Grid container spacing={2}>
                {filteredProcesses.map((process) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={process.id}>
                    <Box
                      sx={{
                        border: "1px solid #E7E7E8",
                        borderLeft: "4px solid #04139A",
                        borderRadius: "8px",
                        p: 2,
                        backgroundColor: "#FFFFFF",
                        position: "relative",
                        minHeight: "68px",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#04139A",
                          backgroundColor: "rgba(4, 19, 154, 0.02)",
                        },
                      }}
                    >
                      {isDeleteMode ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedProcesses.includes(process.id)}
                              onChange={() => handleProcessToggle(process.id)}
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
                            <Box sx={{ flex: 1, pr: 4 }}>
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
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#484848",
                                  fontSize: "14px",
                                  lineHeight: "20px",
                                  fontWeight: 400,
                                }}
                              >
                                Description: {process.processDescription}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            alignItems: "flex-start",
                            m: 0,
                            flex: 1,
                            "& .MuiFormControlLabel-label": {
                              flex: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box sx={{ flex: 1, pr: 4 }}>
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
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#484848",
                              fontSize: "14px",
                              lineHeight: "20px",
                              fontWeight: 400,
                            }}
                          >
                            Description: {process.processDescription}
                          </Typography>
                        </Box>
                      )}
                      {!isDeleteMode && (
                        <IconButton
                          onClick={handleEnterDeleteMode}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "#F44336",
                            "&:hover": {
                              backgroundColor: "rgba(244, 67, 54, 0.1)",
                            },
                          }}
                        >
                          <Delete sx={{ fontSize: "20px" }} />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}
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
      />
    </Box>
  );
}

export default withAuth(ProcessesPage);
