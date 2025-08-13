import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Button,
  MenuItem,
  IconButton,
  FormControl,
  Typography,
  DialogActions,
  Divider,
  Chip,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
} from "@mui/material";
import {
  Add,
  Close,
  DeleteOutlineOutlined,
  DoneOutlined,
} from "@mui/icons-material";
import { AssetAttributes, AssetForm } from "@/types/asset";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
// import TooltipComponent from "@/components/TooltipComponent";

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

  const [isAssetThirdPartyManaged, setIsAssetThirdPartyManaged] =
    useState<boolean>(false);

  // State for related processes
  const [newRelatedProcess, setNewRelatedProcess] = React.useState<
    number | null
  >();

  const handleChange = (field: keyof AssetForm, value: any) => {
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

  const getStatusComponent = () => {
    if (
      assetFormData.status === "published" ||
      assetFormData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={assetFormData.status === "published"}
            />
          }
          label={assetFormData.status === "published" ? "Enabled" : "Disabled"}
          sx={{ width: 30, height: 18, marginLeft: "0 !important", gap: 1 }}
        />
      );
    }
    return (
      <Chip
        icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{
          fontWeight: 550,
          borderRadius: 1,
          color: "primary.main",
          width: "96px",
          "& .MuiChip-icon": {
            marginRight: "1px",
          },
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: 2, padding: 5 } } }}
    >
      <DialogTitle
        sx={{
          paddingY: 0,
          paddingX: 0,
          marginBottom: 5,
        }}
      >
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            display={"flex"}
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Typography variant="h5" fontWeight={550} color="#121212">
              {operation === "create"
                ? "Add Asset"
                : `Edit Asset A-${assetFormData.id}`}
            </Typography>
            {operation === "edit" ? getStatusComponent() : null}
          </Stack>

          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <Close sx={{ color: "primary.main" }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Grid container spacing={4}>
          {/* Asset Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Asset Name"
              placeholder="Enter Asset Name"
              value={assetFormData.assetName}
              required
              onChange={(e) => handleChange("assetName", e.target.value)}
            />
          </Grid>

          {/* Asset Category */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
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
                Asset Category
              </InputLabel>
              <Select
                value={assetFormData.assetCategory}
                label="Asset Category"
                displayEmpty
                onChange={(e) => handleChange("assetCategory", e.target.value)}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#9e9e9e",
                          textTransform: "capitalize",
                        }}
                      >
                        Select Asset Category
                      </Typography>
                    );
                  } else {
                    return (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          textTransform: "capitalize",
                        }}
                      >
                        {selected}
                      </Typography>
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
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="multiselect">Multiselect</MenuItem>
                <MenuItem value="number">Number</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}

          {/* Asset Category */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.assetCategory}
              label="Asset Category"
              displayEmpty
              onChange={(e) => handleChange("assetCategory", e.target.value)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Asset Category
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="multiselect">Multiselect</MenuItem>
              <MenuItem value="number">Number</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Asset Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label="Asset Description"
              placeholder="Enter Asset Description"
              value={assetFormData.assetDescription}
              multiline
              minRows={1}
              onChange={(e) => handleChange("assetDescription", e.target.value)}
            />
          </Grid>

          {/* Asset Owner */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Asset Owner"
              placeholder="Enter Asset Owner Name"
              value={assetFormData.assetOwner}
              onChange={(e) => handleChange("assetOwner", e.target.value)}
            />
          </Grid>

          {/* Asset IT Owner */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Asset IT Owner"
              placeholder="Enter Asset IT Owner Name"
              value={assetFormData.assetITOwner}
              onChange={(e) => handleChange("assetITOwner", e.target.value)}
            />
          </Grid>

          {/* Third Party Management */}
          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="third-party-management-radio-buttons-group"
              >
                <Typography variant="body2" color="#121212">
                  Third Party Management
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="third-party-management-radio-buttons-group"
                name="isThirdPartyManagement"
                row
                value={
                  assetFormData.isThirdPartyManagement
                    ? assetFormData.isThirdPartyManagement
                    : null
                }
                onChange={(e) => {
                  handleChange("isThirdPartyManagement", e.target.value);
                  setIsAssetThirdPartyManaged(e.target.value === "true");
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Yes
                    </Typography>
                  }
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Third Party Name */}
          {isAssetThirdPartyManaged && (
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                label="Third Party Name"
                placeholder="Enter Third Party Name"
                value={assetFormData.thirdPartyName}
                onChange={(e) => handleChange("thirdPartyName", e.target.value)}
              />
            </Grid>
          )}

          {/* Third Party Location */}
          {isAssetThirdPartyManaged && (
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                label="Third Party Location"
                placeholder="Enter Third Party Location"
                value={assetFormData.thirdPartyLocation}
                onChange={(e) =>
                  handleChange("thirdPartyLocation", e.target.value)
                }
              />
            </Grid>
          )}

          {/* Hosting */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.hosting}
              label="Hosting"
              displayEmpty
              onChange={(e) => handleChange("hosting", e.target.value)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Hosting
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="saas">SaaS</MenuItem>
              <MenuItem value="paas">PaaS</MenuItem>
              <MenuItem value="iaas">IaaS</MenuItem>
              <MenuItem value="on-prem">On-Prem</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Hosting Facility */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.hostingFacility}
              label="Hosting Facility"
              displayEmpty
              onChange={(e) => handleChange("hostingFacility", e.target.value)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Hosting Facility
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="public cloud">Public Cloud</MenuItem>
              <MenuItem value="private cloud">Private Cloud</MenuItem>
              <MenuItem value="n/a">N/A</MenuItem>
            </SelectStyled>
          </Grid>

          {/*Cloud Service Provider */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.cloudServiceProvider}
              multiple
              label="Cloud Service Provider"
              displayEmpty
              onChange={(e) =>
                handleChange("cloudServiceProvider", e.target.value as string[])
              }
              renderValue={(selected: any) => {
                if (selected?.length === 0) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Cloud Service Provider
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {selected.join(", ")}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="AWS">AWS</MenuItem>
              <MenuItem value="Azure">Azure</MenuItem>
              <MenuItem value="GCP">GCP</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Geographic Location */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Geographic Location"
              placeholder="Enter Geographic Location"
              value={assetFormData.geographicLocation}
              onChange={(e) =>
                handleChange("geographicLocation", e.target.value)
              }
            />
          </Grid>

          {/* Redundancy */}
          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="is-redundancy-radio-buttons-group"
              >
                <Typography variant="body2" color="#121212">
                  Redundancy
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-redundancy-radio-buttons-group"
                name="isRedundancy"
                row
                value={assetFormData.isRedundancy}
                onChange={(e) => {
                  handleChange("isRedundancy", e.target.value);
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Yes
                    </Typography>
                  }
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Databases */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Databases"
              placeholder="Enter Databases"
              value={assetFormData.databases}
              onChange={(e) => handleChange("databases", e.target.value)}
            />
          </Grid>

          {/* Network Segmentation */}
          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="is-network-segmentation-radio-buttons-group"
              >
                <Typography variant="body2" color="#121212">
                  Network Segmentation
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-network-segmentation-radio-buttons-group"
                name="isNetworkSegmentation"
                row
                value={assetFormData.isNetworkSegmentation}
                onChange={(e) => {
                  handleChange("isNetworkSegmentation", e.target.value);
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      Yes
                    </Typography>
                  }
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" color="text.primary">
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Network Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Network Name"
              placeholder="Enter Network Name"
              value={assetFormData.networkName}
              onChange={(e) => handleChange("networkName", e.target.value)}
            />
          </Grid>

          {/* <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="#121212" fontWeight={400}>Risk Scenario</Typography>
            <TextField
              fullWidth
              // label="Risk Scenario"
              placeholder="Enter Risk Scenario"
              value={assetFormData.assetDescription}
              required
              variant="outlined"
              onChange={(e) => handleChange("assetDescription", e.target.value)}
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
              }}
            />
          </Grid> */}

          {/* RELATED PROCESS SECTION */}
          <Grid mt={1} size={{ xs: 12 }}>
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
                  <SelectStyled
                    value={newRelatedProcess}
                    label="Select Related Process"
                    displayEmpty
                    onChange={(e) =>
                      setNewRelatedProcess(e.target.value as number)
                    }
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#9E9FA5",
                            }}
                          >
                            Select Related Process
                          </Typography>
                        );
                      }
                      return processes.find((item) => item.id === selected)
                        ?.name;
                    }}
                  >
                    {processes.map((process, index) => (
                      <MenuItem key={index} value={process.id}>
                        {process.name}
                      </MenuItem>
                    ))}
                  </SelectStyled>
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
                  <SelectStyled
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
                    renderValue={(selected: any) => {
                      if (!selected || selected < 0) {
                        return (
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#9E9FA5",
                            }}
                          >
                            Select Key
                          </Typography>
                        );
                      } else {
                        const label = metaDatas.find(
                          (m) => m.id === selected
                        )?.label;
                        return (
                          label ?? (
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#9E9FA5",
                              }}
                            >
                              Select Key
                            </Typography>
                          )
                        );
                      }
                    }}
                  >
                    {metaDatas.map((metaData, index) => (
                      <MenuItem key={index} value={metaData.id}>
                        {metaData.label}
                      </MenuItem>
                    ))}
                  </SelectStyled>
                </Grid>

                <Grid size={{ xs: 5.5 }}>
                  <SelectStyled
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
                    renderValue={(selected: any) => {
                      if (!selectedMeta) {
                        return (
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#9E9FA5",
                            }}
                          >
                            Please Select Key First
                          </Typography>
                        );
                      } else if (!selected || selected.length < 1) {
                        return (
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#9E9FA5",
                            }}
                          >
                            Enter Value
                          </Typography>
                        );
                      }
                      return selected.join(", ");
                    }}
                  >
                    {selectedMeta?.supported_values?.map(
                      (val: string | number, i: number) => (
                        <MenuItem key={i} value={val}>
                          {val}
                        </MenuItem>
                      )
                    )}
                  </SelectStyled>
                </Grid>

                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => removeKeyValue(index)}>
                    <DeleteOutlineOutlined sx={{ color: "#cd0303" }} />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}

          <Grid mt={-2} size={{ xs: 12 }}>
            <Button
              startIcon={<Add />}
              onClick={addKeyValue}
              sx={{ paddingY: 0 }}
            >
              Add New Key
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Divider sx={{ width: "100%" }} />
      </Box>
      <DialogActions
        sx={{
          pt: 4,
          display: "flex",
          justifyContent: "space-between",
          pb: 0,
          px: 0,
        }}
      >
        <Button
          sx={{
            width: 113,
            height: 40,
            border: "1px solid #CD0303",
            borderRadius: 1,
          }}
          variant="outlined"
          onClick={onClose}
        >
          <Typography variant="body1" color="#CD0303" fontWeight={500}>
            Cancel
          </Typography>
        </Button>
        <Box display={"flex"} gap={3}>
          <Button
            onClick={() => {
              onSubmit("draft");
            }}
            sx={{ width: 161, height: 40, borderRadius: 1 }}
            variant="outlined"
          >
            <Typography variant="body1" color="#04139A" fontWeight={500}>
              Save as Draft
            </Typography>
          </Button>
          <Button
            sx={{ width: 132, height: 40, borderRadius: 1 }}
            variant="contained"
            onClick={() => {
              onSubmit("published");
            }}
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              Publish
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AssetFormModal;
