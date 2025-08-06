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
  Chip,
} from "@mui/material";
import { Add, Close, DeleteOutlineOutlined } from "@mui/icons-material";
import { AssetAttributes, AssetForm } from "@/types/asset";

interface AssetFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  assetFormData: AssetForm;
  processes: any[];
  metaDatas: any[];
  setAssetFormData: React.Dispatch<React.SetStateAction<AssetForm>>;
  onSubmit: (status: string) => void;
}

const AssetFormModal: React.FC<AssetFormModalProps> = ({
  operation,
  open,
  onClose,
  assetFormData,
  setAssetFormData,
  processes,
  metaDatas,
  onSubmit,
}) => {

  console.log(assetFormData);

  // State for related processes
  const [newRelatedProcess, setNewRelatedProcess] = React.useState<
    number | null
  >();

  const handleChange = (field: keyof AssetForm, value: string) => {
    setAssetFormData({ ...assetFormData, [field]: value });
  };

  const handleKeyValueChange = (
    index: number,
    field: keyof AssetAttributes,
    value: number | string[]
  ) => {
    const updatedKeyValues = [...(assetFormData.attributes ?? [])];
    if (field == "meta_data_key_id" && typeof value == "number") {
      updatedKeyValues[index].meta_data_key_id = value;
      updatedKeyValues[index].values = [];
    } else if (field === "values" && Array.isArray(value)) {
      updatedKeyValues[index].values = value;
    }
    setAssetFormData({ ...assetFormData, attributes: updatedKeyValues });
  };

  const addKeyValue = () => {
    setAssetFormData({
      ...assetFormData,
      attributes: [
        ...(assetFormData.attributes ?? []),
        { meta_data_key_id: null, values: [] as string[] },
      ],
    });
  };

  const removeKeyValue = (index: number) => {
    const updatedKeyValues = assetFormData.attributes?.filter(
      (_, i) => i !== index
    );
    setAssetFormData({ ...assetFormData, attributes: updatedKeyValues });
  };

  // Related Process handling functions
  const addRelatedProcess = () => {
    if (
      newRelatedProcess &&
      !assetFormData?.related_processes?.includes(newRelatedProcess)
    ) {
      //   setRelatedProcesses([...relatedProcesses, newRelatedProcess]);

      setAssetFormData({
        ...assetFormData,
        related_processes: [
          ...(assetFormData?.related_processes ?? []),
          newRelatedProcess,
        ],
      });
      setNewRelatedProcess(null);
    }
  };

  const removeRelatedProcess = (processToRemove: number) => {
    setAssetFormData({
      ...assetFormData,
      related_processes: assetFormData?.related_processes?.filter(
        (process) => process !== processToRemove
      ),
    });

    // setRelatedProcesses(
    //   relatedProcesses.filter((process) => process !== processToRemove)
    // );
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
          {operation === "create"
            ? "Add Asset"
            : `Edit Asset A-${assetFormData.id}`}
        </Typography>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2} ml={5}>
          {/* Existing form fields */}
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Risk Scenario"
              placeholder="Enter Risk Scenario"
              value={assetFormData.assetName}
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
              onChange={(e) => handleChange("assetName", e.target.value)}
            />
          </Grid>

          {/* Risk Statement field */}
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Risk Statement"
              placeholder="Enter Risk Statement"
              value={assetFormData.assetOwner}
              onChange={(e) => handleChange("assetOwner", e.target.value)}
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

          {/* Risk Description field */}
          <Grid mt={1} size={{ xs: 11 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Risk Description"
              placeholder="Enter Risk Description"
              value={assetFormData.assetName}
              onChange={(e) => handleChange("assetName", e.target.value)}
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

          {/* Risk Field 1 and 2 */}
          <Grid mt={1} size={{ xs: 5.5 }}>
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              label="Risk Field 1"
              placeholder="Enter Risk Field 1"
              value={assetFormData.assetName}
              onChange={(e) => handleChange("assetName", e.target.value)}
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
              label="Risk Field 2"
              placeholder="Enter Field 2"
              value={assetFormData.assetName}
              onChange={(e) => handleChange("assetName", e.target.value)}
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
                <Grid size={{ xs: 10.5 }}>
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
                      Select Related Process
                    </InputLabel>
                    <Select
                      value={newRelatedProcess}
                      label="Select Related Process"
                      displayEmpty
                      onChange={(e) =>
                        setNewRelatedProcess(e.target.value as number)
                      }
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span style={{ color: "#9e9e9e" }}>
                              Select Related Process
                            </span>
                          );
                        }
                        return processes.find((item) => item.id === selected)
                          ?.name;
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
                      {processes.map((process, index) => (
                        <MenuItem key={index} value={process.id}>
                          {process.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={addRelatedProcess}
                    disabled={!newRelatedProcess}
                    // startIcon={<Add />}
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
              {assetFormData?.related_processes &&
                assetFormData?.related_processes?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {assetFormData?.related_processes?.map((process, index) => (
                      <Chip
                        key={index}
                        label={
                          processes.find((item) => item.id === process)?.name
                        }
                        onDelete={() => removeRelatedProcess(process)}
                        sx={{
                          backgroundColor: "#e8f5e8",
                          color: "#2e7d32",
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
          {assetFormData?.attributes?.map((kv, index) => {
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

export default AssetFormModal;
