import React, { useCallback, useEffect, useState } from "react";
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
import { tooltips } from "@/utils/tooltips";
import TooltipComponent from "@/components/TooltipComponent";
import { labels } from "@/utils/labels";

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

  const [isAssetThirdPartyManaged, setIsAssetThirdPartyManaged] =
    useState<boolean>(false);

  // State for related processes
  const [newRelatedProcess, setNewRelatedProcess] = React.useState<
    number | null
  >();

  const handleChange = useCallback(
    (field: keyof AssetForm, value: any) => {
      setAssetFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setAssetFormData] // only depends on setter from props
  );

  useEffect(() => {
    if (isAssetThirdPartyManaged === false) {
      handleChange("thirdPartyName", "");
      handleChange("thirdPartyLocation", "");
    }
  }, [isAssetThirdPartyManaged, handleChange]);

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
      !assetFormData?.relatedProcesses?.includes(newRelatedProcess)
    ) {
      setAssetFormData({
        ...assetFormData,
        relatedProcesses: [
          ...(assetFormData?.relatedProcesses ?? []),
          newRelatedProcess,
        ],
      });
      setNewRelatedProcess(null);
    }
  };

  const removeRelatedProcess = (processToRemove: number) => {
    setAssetFormData({
      ...assetFormData,
      relatedProcesses: assetFormData?.relatedProcesses?.filter(
        (process) => process !== processToRemove
      ),
    });
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
                : `Edit Asset ${assetFormData.assetCode}`}
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
              label={labels.assetName}
              placeholder="Enter Asset Name"
              value={assetFormData.applicationName}
              required
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetName}
              onChange={(e) => handleChange("applicationName", e.target.value)}
            />
          </Grid>

          {/* Asset Category */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              required
              multiple
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetCategory}
              value={assetFormData.assetCategory}
              label={labels.assetCategory}
              displayEmpty
              onChange={(e) => handleChange("assetCategory", e.target.value as string[])}
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
                      }}
                    >
                      {selected.join(", ")}
                    </Typography>
                  );
                }
              }}
            >
              {metaDatas?.find((item) => item.name === "Asset Category")?.supported_values?.map((item : string) => {
                return (<MenuItem key={item} value={item}>{item}</MenuItem>)
              })}
            </SelectStyled>
          </Grid>

          {/* Asset Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.assetDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetDescription}
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
              label={labels.assetOwner}
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetOwner}
              placeholder="Enter Asset Owner Name"
              value={assetFormData.applicationOwner}
              onChange={(e) => handleChange("applicationOwner", e.target.value)}
            />
          </Grid>

          {/* Asset IT Owner */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.assetITOwner}
              isTooltipRequired={true}
              tooltipTitle={tooltips.assetITOwner}
              placeholder="Enter Asset IT Owner Name"
              value={assetFormData.applicationITOwner}
              onChange={(e) =>
                handleChange("applicationITOwner", e.target.value)
              }
            />
          </Grid>

          {/* Third Party Management */}
          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="third-party-management-radio-buttons-group"
              >
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.thirdPartyManagement}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.thirdPartyManagement}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="third-party-management-radio-buttons-group"
                name="isThirdPartyManagement"
                row
                value={assetFormData.isThirdPartyManagement}
                onChange={(e) => {
                  handleChange("isThirdPartyManagement", e.target.value);
                  setIsAssetThirdPartyManaged(
                    e.target.value === "true" ? true : false
                  );
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
                label={labels.thirdPartyName}
                isTooltipRequired={true}
                tooltipTitle={tooltips.thirdPartyName}
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
                label={labels.thirdPartyLocation}
                isTooltipRequired={true}
                tooltipTitle={tooltips.thirdPartyLocation}
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
              label={labels.hosting}
              isTooltipRequired={true}
              tooltipTitle={tooltips.hosting}
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
              <MenuItem value="SaaS">SaaS</MenuItem>
              <MenuItem value="PaaS">PaaS</MenuItem>
              <MenuItem value="IaaS">IaaS</MenuItem>
              <MenuItem value="On-Premise">On-Prem</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Hosting Facility */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.hostingFacility}
              label={labels.hostingFacility}
              isTooltipRequired={true}
              tooltipTitle={tooltips.hostingFacility}
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
              <MenuItem value="Public Cloud">Public Cloud</MenuItem>
              <MenuItem value="Private Cloud">Private Cloud</MenuItem>
              <MenuItem value="N/A">N/A</MenuItem>
            </SelectStyled>
          </Grid>

          {/*Cloud Service Provider */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={assetFormData.cloudServiceProvider}
              multiple
              label={labels.cloudServiceProvider}
              isTooltipRequired={true}
              tooltipTitle={tooltips.cloudServiceProvider}
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
              <MenuItem value="Google Cloud Platform">GCP</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Geographic Location */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.geographicLocation}
              isTooltipRequired={true}
              tooltipTitle={tooltips.geographicLocation}
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
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.redundancy}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.redundancy}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-redundancy-radio-buttons-group"
                name="isRedundancy"
                row
                value={assetFormData.hasRedundancy}
                onChange={(e) => {
                  handleChange("hasRedundancy", e.target.value);
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
              label={labels.databases}
              isTooltipRequired={true}
              tooltipTitle={tooltips.databases}
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
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.networkSegmentation}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.networkSegmentation}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-network-segmentation-radio-buttons-group"
                name="isNetworkSegmentation"
                row
                value={assetFormData.hasNetworkSegmentation}
                onChange={(e) => {
                  handleChange("hasNetworkSegmentation", e.target.value);
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
              label={labels.networkName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.networkName}
              placeholder="Enter Network Name"
              value={assetFormData.networkName}
              onChange={(e) => handleChange("networkName", e.target.value)}
            />
          </Grid>

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
                    label={labels.relatedProcesses}
                    isTooltipRequired={true}
                    tooltipTitle={tooltips.relatedProcesses}
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
                        ?.processName;
                    }}
                  >
                    {processes.map((process, index) => (
                      <MenuItem key={index} value={process.id}>
                        {process.processName}
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
              {assetFormData?.relatedProcesses &&
                assetFormData?.relatedProcesses?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {assetFormData?.relatedProcesses?.map((process, index) => (
                      <Chip
                        key={index}
                        label={
                          processes.find((item) => item.id === process)
                            ?.processName
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
                    label={labels.key}
                    isTooltipRequired={true}
                    tooltipTitle={tooltips.key}
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
                    label={labels.value}
                    isTooltipRequired={true}
                    tooltipTitle={tooltips.value}
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
            disabled={assetFormData.applicationName === "" || assetFormData.assetCategory?.length === 0}
            disableRipple
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
