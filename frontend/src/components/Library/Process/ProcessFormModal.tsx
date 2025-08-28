import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Grid,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
  Typography,
  DialogActions,
  Divider,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Add, Close, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  RiskScenarioAttributes,
  RiskScenarioData,
} from "@/types/risk-scenario";
import { ProcessData } from "@/types/process";

interface ProcessFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  processData: ProcessData;
  processes: ProcessData[];
  metaDatas: any[];
  setProcessData: React.Dispatch<React.SetStateAction<ProcessData>>;
  onSubmit: (status: string) => void;
}

const ProcessFormModal: React.FC<ProcessFormModalProps> = ({
  operation,
  open,
  onClose,
  processData,
  setProcessData,
  processes,
  metaDatas,
  onSubmit,
}) => {
  console.log(metaDatas)
  console.log(processes);


  const [newDependentProcess,setNewDependentProcess] = React.useState<{
    dependendProcessId:number | null,
    relationType: string | null,
  }>();

  const handleChange = (field: keyof ProcessData, value: string) => {
    setProcessData({ ...processData, [field]: value });
  };

  const handleKeyValueChange = (
    index: number,
    field: keyof RiskScenarioAttributes,
    value: number | string[]
  ) => {
    const updatedKeyValues = [...(processData.attributes ?? [])];
    if (field == "meta_data_key_id" && typeof value == "number") {
      updatedKeyValues[index].meta_data_key_id = value;
      updatedKeyValues[index].values = [];
    } else if (field === "values" && Array.isArray(value)) {
      updatedKeyValues[index].values = value;
    }
    setProcessData({ ...processData, attributes: updatedKeyValues });
  };

  const addKeyValue = () => {
    setProcessData({
      ...processData,
      attributes: [
        ...(processData.attributes ?? []),
        { meta_data_key_id: null, values: [] as string[] },
      ],
    });
  };

  const removeKeyValue = (index: number) => {
    const updatedKeyValues = processData.attributes?.filter(
      (_, i) => i !== index
    );
    setProcessData({ ...processData, attributes: updatedKeyValues });
  };

  // Related Process handling functions
  const addRelatedProcess = () => {
    if (newDependentProcess) {
      setProcessData({...processData,
        processDependency: [...processData?.processDependency ?? [] , {targetProcessId: newDependentProcess.dependendProcessId as number, relationshipType: newDependentProcess.relationType as string}]
      })
    }
    setNewDependentProcess({
        dependendProcessId: null,
        relationType: null
    })
  };

  const removeRelatedProcess = (processToRemove: number) => {
    setProcessData({
      ...processData,
      processDependency: processData?.processDependency?.filter((process) => process.targetProcessId !== processToRemove)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {operation === "create" && (
          <Typography variant="h5" fontWeight={550}>
            Add Process
          </Typography>
        )}

        {operation === "edit" && (
          <Typography variant="h5" fontWeight={550}>
            Edit Process BP - {processData.processCode}
          </Typography>
        )}
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2} ml={5}>
          {/* Process Name */}
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Process Name"
              placeholder="Enter Process Name"
              value={processData.processName}
              required
              variant="outlined"
              onChange={(e) => handleChange("processName", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          {/* Process Description field */}
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Process Description"
              placeholder="Enter Process Description"
              value={processData.processDescription}
              onChange={(e) =>
                handleChange("processDescription", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Users"
              placeholder="Users"
              value={processData.users}
              onChange={(e) =>
                handleChange("users", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          {/* senior executire owner and email */}
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Senior Executive Owner Name"
              placeholder="Senior Executive Owner Name"
              value={processData.seniorExecutiveOwnerName}
              onChange={(e) =>
                handleChange("seniorExecutiveOwnerName", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Senior Executive Owner Email"
              placeholder="Senior Executive Owner Email"
              value={processData.seniorExecutiveOwnerEmail}
              onChange={(e) =>
                handleChange("seniorExecutiveOwnerEmail", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Operations Owner Name"
              placeholder="Operations Owner Name"
              value={processData.operationsOwnerName}
              onChange={(e) =>
                handleChange("operationsOwnerName", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Operations Owner Email"
              placeholder="Operations Owner Email"
              value={processData.operationsOwnerEmail}
              onChange={(e) =>
                handleChange("operationsOwnerEmail", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Technology Owner Name"
              placeholder="Technology Owner Name"
              value={processData.technologyOwnerName}
              onChange={(e) =>
                handleChange("technologyOwnerName", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Technology Owner Email"
              placeholder="Technology Owner Email"
              value={processData.technologyOwnerEmail}
              onChange={(e) =>
                handleChange("technologyOwnerEmail", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Organizational Revenue Impact Percentage"
              placeholder="Organizational Revenue Impact Percentage"
              value={processData.organizationalRevenueImpactPercentage}
              onChange={(e) =>
                handleChange(
                  "organizationalRevenueImpactPercentage",
                  e.target.value
                )
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          {/* <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Financial Materiality"
              placeholder="Financial Materiality"
              value={processData.financialMateriality}
              onChange={(e) =>
                handleChange("financialMateriality", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid> */}
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Third Party Involvement"
              placeholder="Third Party Involvement"
              value={processData.thirdPartyInvolvement}
              onChange={(e) =>
                handleChange("thirdPartyInvolvement", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Regulatory and Compliance"
              placeholder="Regulatory and Compliance"
              value={processData.requlatoryAndCompliance}
              onChange={(e) =>
                handleChange("requlatoryAndCompliance", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          {/* Criticality of Data Processed */}
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Criticality of Data Processed"
              placeholder="Criticality of Data Processed"
              value={processData.criticalityOfDataProcessed}
              onChange={(e) =>
                handleChange("criticalityOfDataProcessed", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Data Processed"
              placeholder="Data Processed"
              value={processData.dataProcessed}
              onChange={(e) =>
                handleChange("dataProcessed", e.target.value)
              }
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#000000",
                  "&.Mui-focused": {
                    color: "#000000",
                  },
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
            />
          </Grid>

          {/* RELATED PROCESS SECTION */}
          <Grid mt={3} size={{ xs: 11 }}>
            <Box
              sx={{
                border: "1px dashed #cecfd2",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#f8f9fa",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Related Process
              </Typography>

              {/* Add Related Process input row */}
              <Grid container spacing={2} alignItems="center" mb={2}>
                {/* Process Selection */}
                <Grid size={{ xs: 5 }}>
                  <Autocomplete
                    value={
                      processes.find((item) => item.id === newDependentProcess?.dependendProcessId) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setNewDependentProcess({
                        dependendProcessId:newValue?.id as number,
                        relationType: null
                      })
                    }}
                    options={processes}
                    getOptionLabel={(option) => option.processName}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Process"
                        placeholder="Type to search processes..."
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#000000",
                            "&.Mui-focused": {
                              color: "#000000",
                            },
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#ffffff",
                            fontSize: "14px",
                            "& fieldset": {
                              borderColor: "#cecfd2",
                              borderWidth: "1px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#cecfd2",
                              borderWidth: "1.5px",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#cecfd2",
                              borderWidth: "1.5px",
                            },
                          },
                          "& .MuiInputBase-input": {
                            padding: "14px 16px",
                            fontSize: "14px",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.processName}
                      </li>
                    )}
                    noOptionsText="No processes found"
                    sx={{
                      "& .MuiAutocomplete-popupIndicator": {
                        color: "#666",
                      },
                    }}
                  />
                </Grid>

                {/* Relationship Type Selection */}
                <Grid size={{ xs: 5.5 }}>
                  <FormControl fullWidth>
                    <InputLabel
                      shrink
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#000000",
                        "&.Mui-focused": {
                          color: "#000000",
                        },
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      }}
                    >
                      Relationship Type
                    </InputLabel>
                    <Select
                      value={newDependentProcess?.relationType as string}
                      label="Relationship Type"
                      displayEmpty
                      onChange={(e) => {
                        setNewDependentProcess(prev => {
                            if (!prev || prev.dependendProcessId === null) {
                            alert("Process ID is required before setting relation type.");
                            return prev;
                            }

                            return {
                            ...prev,
                            relationType: e.target.value
                            };
                        });
                        }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>
                              Select Relationship Type
                            </span>
                          );
                        }
                        return selected;
                      }}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "& .MuiSelect-select": {
                          padding: "14px 16px",
                          fontSize: "14px",
                        },
                      }}
                    >
                      <MenuItem value="follows">Follows</MenuItem>
                      <MenuItem value="precedes">Precedes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Add Button */}
                <Grid size={{ xs: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={addRelatedProcess}
                    // disabled={!newRelatedProcess || !relationshipType}
                    sx={{
                      backgroundColor: "main.color",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                      "&:disabled": {
                        backgroundColor: "#9e9e9e",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {/* Display added related processes */}
              {processData?.processDependency && processData?.processDependency?.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {processData?.processDependency?.map((relation, index) => (
                <Chip
                    key={index}
                    label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                        {processData.id ? relation.sourceProcessId === processData.id &&  processes.find(item => item.id === relation.targetProcessId)?.processName : processes.find(item => item.id === relation.targetProcessId)?.processName }
                        {processData.id ? relation.targetProcessId === processData.id &&  processes.find(item => item.id === relation.sourceProcessId)?.processName : processes.find(item => item.id === relation.targetProcessId)?.processName }
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ 
                        color: '#666', 
                        fontSize: '0.75rem',
                        fontStyle: 'italic' 
                        }}>
                        ({relation.relationshipType?.replace('_', ' ')})
                        </Typography>
                    </Box>
                    }
                    onDelete={() => removeRelatedProcess(relation.targetProcessId as number)}
                    sx={{
                    backgroundColor: "#e8f5e8",
                    color: "#2e7d32",
                    height: 'auto',
                    minHeight: '32px',
                    "& .MuiChip-label": {
                        padding: "6px 12px",
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                    },
                    "& .MuiChip-deleteIcon": {
                        color: "#2e7d32",
                        "&:hover": {
                        color: "#cd0303",
                        },
                    },
                    }}
                />
                ))}
            </Box>
                )}
            </Box>
          </Grid>

          {/* Dyanmic Key - Value Tags section */}
          {processData?.attributes?.map((kv, index) => {
            const selectedMeta = metaDatas.find(
              (md) => md.id === kv.meta_data_key_id
            );
            return (
              <Grid
                mt={1}
                sx={{ width: "100%" }}
                container
                spacing={2}
                alignItems="center"
                key={index}
              >
                <Grid size={{ xs: 5.5 }}>
                  <FormControl fullWidth>
                    <InputLabel
                      shrink
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#000000",
                        "&.Mui-focused": {
                          color: "#000000",
                        },
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      }}
                    >
                      Key
                    </InputLabel>
                    <Select
                      value={kv.meta_data_key_id}
                      label="Key"
                      displayEmpty
                      onChange={(e) =>
                        handleKeyValueChange(
                          index,
                          "meta_data_key_id",
                          e.target.value as number
                        )
                      }
                      renderValue={(selected) => {
                        if (!selected || selected < 0) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>Select Key</span>
                          );
                        } else {
                          const label = metaDatas.find(
                            (m) => m.id === selected
                          )?.label;
                          return (
                            label ?? (
                              <span style={{ color: "#9e9e9e" }}>
                                Select Key
                              </span>
                            )
                          );
                        }
                      }}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "& .MuiSelect-select": {
                          padding: "14px 16px",
                          fontSize: "14px",
                        },
                      }}
                    >
                      {metaDatas.map((metaData, index) => (
                        <MenuItem key={index} value={metaData.id}>
                          {metaData.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 5.5 }}>
                  <FormControl fullWidth>
                    <InputLabel
                      shrink
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#000000",
                        "&.Mui-focused": {
                          color: "#000000",
                        },
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      }}
                    >
                      Value
                    </InputLabel>
                    <Select
                      multiple
                      value={kv.values || []}
                      label="Value"
                      displayEmpty
                      onChange={(e) =>
                        handleKeyValueChange(
                          index,
                          "values",
                          e.target.value as string[]
                        )
                      }
                      renderValue={(selected) => {
                        if (!selectedMeta) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>
                              Please Select Key First
                            </span>
                          );
                        } else if (!selected || selected.length < 1) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>
                              Enter Value
                            </span>
                          );
                        }
                        return selected.join(", ");
                      }}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        fontSize: "14px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cecfd2",
                          borderWidth: "1.5px",
                        },
                        "& .MuiSelect-select": {
                          padding: "14px 16px",
                          fontSize: "14px",
                        },
                      }}
                    >
                      {selectedMeta?.supported_values?.map(
                        (val: string | number, i: number) => (
                          <MenuItem key={i} value={val}>
                            {val}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => removeKeyValue(index)}>
                    <DeleteOutlineOutlined sx={{ color: "#cd0303" }} />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}

          <Grid size={{ xs: 12 }}>
            <Button startIcon={<Add />} onClick={addKeyValue}>
              Add New Key
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Divider sx={{ width: "90%" }} />
      </Box>
      <DialogActions
        sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Button
          sx={{ width: 160, height: 40, borderRadius: 1 }}
          variant="outlined"
          color="error"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Box>
          <Button
            onClick={() => {
              onSubmit("draft");
            }}
            sx={{ width: 160, height: 40, borderRadius: 1, margin: 1 }}
            variant="outlined"
          >
            Save as Draft
          </Button>
          <Button
            sx={{ width: 160, height: 40, borderRadius: 1, margin: 1 }}
            variant="contained"
            onClick={() => {
              onSubmit("published");
            }}
          >
            Publish
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessFormModal;
