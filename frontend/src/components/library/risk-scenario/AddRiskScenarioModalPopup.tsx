"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Close, DeleteOutlineOutlined } from "@mui/icons-material";

interface KeyValue {
  key: string;
  value: string;
}

interface AddRiskScenarioModalProps {
  open: boolean;
  onClose: () => void;
}

const AddRiskScenarioModal: React.FC<AddRiskScenarioModalProps> = ({
  open,
  onClose,
}) => {
  const [riskData, setRiskData] = useState({
    riskScenario: "",
    riskStatement: "",
    riskDescription: "",
    riskField1: "",
    riskField2: "",
    keyValues: [{ key: "", value: "" }] as KeyValue[],
  });

  const handleChange = (field: string, value: string) => {
    setRiskData({ ...riskData, [field]: value });
  };

  const handleKeyValueChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedKeyValues = [...riskData.keyValues];
    updatedKeyValues[index][field] = value;
    setRiskData({ ...riskData, keyValues: updatedKeyValues });
  };

  const addKeyValue = () => {
    setRiskData({
      ...riskData,
      keyValues: [...riskData.keyValues, { key: "", value: "" }],
    });
  };

  const removeKeyValue = (index: number) => {
    const updatedKeyValues = riskData.keyValues.filter((_, i) => i !== index);
    setRiskData({ ...riskData, keyValues: updatedKeyValues });
  };

  const handleSubmit = () => {
    console.log("Submitted:", riskData);
    onClose();
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
        <Typography variant="h5" fontWeight={550}>
          Add Risk Scenario
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2} ml={5}>
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true, // Replaces InputLabelProps={{ shrink: true }}
                },
              }}
              fullWidth
              label="Risk Scenario"
              placeholder="Enter Risk Scenario"
              value={riskData.riskStatement}
              required
              variant="outlined"
              onChange={(e) => handleChange("riskScenario", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px", // Normal state - thin border
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Hover state - slightly thicker
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Focus state - slightly thicker but not too heavy
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
                    transform: "translate(14px, -9px) scale(0.75)", // Fixed position
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true, // Replaces InputLabelProps={{ shrink: true }}
                },
              }}
              fullWidth
              label="Risk Statement"
              placeholder="Enter Risk Statement"
              onChange={(e) => handleChange("riskStatement", e.target.value)}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px", // Normal state - thin border
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Hover state - slightly thicker
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Focus state - slightly thicker but not too heavy
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
                    transform: "translate(14px, -9px) scale(0.75)", // Fixed position
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true, // Replaces InputLabelProps={{ shrink: true }}
                },
              }}
              fullWidth
              label="Risk Description"
              placeholder="Enter Risk Description"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px", // Normal state - thin border
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Hover state - slightly thicker
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Focus state - slightly thicker but not too heavy
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
                    transform: "translate(14px, -9px) scale(0.75)", // Fixed position
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true, // Replaces InputLabelProps={{ shrink: true }}
                },
              }}
              fullWidth
              label="Risk Field 1"
              placeholder="Enter Risk Field 1"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px", // Normal state - thin border
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Hover state - slightly thicker
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Focus state - slightly thicker but not too heavy
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
                    transform: "translate(14px, -9px) scale(0.75)", // Fixed position
                  },
                },
              }}
            />
          </Grid>
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true, // Replaces InputLabelProps={{ shrink: true }}
                },
              }}
              fullWidth
              label="Risk Field 2"
              placeholder="Enter Field  2"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1px", // Normal state - thin border
                  },
                  "&:hover fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Hover state - slightly thicker
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#cecfd2",
                    borderWidth: "1.5px", // Focus state - slightly thicker but not too heavy
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
                    transform: "translate(14px, -9px) scale(0.75)", // Fixed position
                  },
                },
              }}
            />
          </Grid>

          {riskData.keyValues.map((kv, index) => (
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
                    value={kv.key}
                    label="Key"
                    displayEmpty
                    onChange={(e) =>
                      handleKeyValueChange(index, "key", e.target.value)
                    }
                    renderValue={(selected) => {
                      if (!selected || selected === "") {
                        return (
                          <span style={{ color: "#9e9e9e" }}>Select Key</span>
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
                    <MenuItem value="Impact">Impact</MenuItem>
                    <MenuItem value="Likelihood">Likelihood</MenuItem>
                    <MenuItem value="Control">Control</MenuItem>
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
                    value={kv.key}
                    label="Value"
                    displayEmpty
                    onChange={(e) =>
                      handleKeyValueChange(index, "key", e.target.value)
                    }
                    renderValue={(selected) => {
                      if (!selected || selected === "") {
                        return (
                          <span style={{ color: "#9e9e9e" }}>Enter Value</span>
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
                    <MenuItem value="Impact">Impact</MenuItem>
                    <MenuItem value="Likelihood">Likelihood</MenuItem>
                    <MenuItem value="Control">Control</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 1 }}>
                <IconButton onClick={() => removeKeyValue(index)}>
                  <DeleteOutlineOutlined sx={{ color: "#cd0303" }} />
                </IconButton>
              </Grid>
            </Grid>
          ))}

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
            sx={{ width: 160, height: 40, borderRadius: 1, margin: 1 }}
            variant="outlined"
          >
            Save as Draft
          </Button>
          <Button
            sx={{ width: 160, height: 40, borderRadius: 1, margin: 1 }}
            variant="contained"
            onClick={handleSubmit}
          >
            Publish
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddRiskScenarioModal;
