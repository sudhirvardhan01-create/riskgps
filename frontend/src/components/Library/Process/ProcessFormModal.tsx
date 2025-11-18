import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Grid,
  Button,
  MenuItem,
  IconButton,
  FormControl,
  Typography,
  DialogActions,
  Divider,
  Autocomplete,
  Chip,
  Stack,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import {
  Add,
  Close,
  DeleteOutlineOutlined,
  DoneOutlined,
} from "@mui/icons-material";

import { ProcessAttributes, ProcessData } from "@/types/process";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import TextFieldStyled from "@/components/TextFieldStyled";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import SelectStyled from "@/components/SelectStyled";
import TooltipComponent from "@/components/TooltipComponent";

interface ProcessFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  processData: ProcessData;
  processes: ProcessData[];
  processForListing: ProcessData[];
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
  processForListing,
  metaDatas,
  onSubmit,
}) => {
  console.log(processForListing);

  const [newDependentProcess, setNewDependentProcess] = React.useState<{
    sourceProcessId: number | null;
    targetProcessId: number | null;
    relationType: string | null;
  }>();

  const handleChange = (field: keyof ProcessData, value: string) => {
    setProcessData({ ...processData, [field]: value });
  };

  const handleKeyValueChange = (
    index: number,
    field: keyof ProcessAttributes,
    value: number | string[]
  ) => {
    const updatedKeyValues = [...(processData.attributes ?? [])];
    if (field == "meta_data_key_id" && typeof value == "string") {
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
      setProcessData({
        ...processData,
        processDependency: [
          ...(processData?.processDependency ?? []),
          {
            sourceProcessId: newDependentProcess.sourceProcessId as number,
            targetProcessId: newDependentProcess.targetProcessId as number,
            relationshipType: newDependentProcess.relationType as string,
          },
        ],
      });
    }
    setNewDependentProcess({
      sourceProcessId: null,
      targetProcessId: null,
      relationType: null,
    });
  };

  const removeRelatedProcess = (
    sourceProcessToRemove: number | null,
    targetProcessToRemove: number
  ) => {
    setProcessData({
      ...processData,
      processDependency: processData?.processDependency?.filter(
        (process) =>
          !(
            process.sourceProcessId === sourceProcessToRemove &&
            process.targetProcessId === targetProcessToRemove
          )
      ),
    });
  };

  const getStatusComponent = () => {
    if (
      processData.status === "published" ||
      processData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={processData.status === "published"}
            />
          }
          label={processData.status === "published" ? "Enabled" : "Disabled"}
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
                ? "Add Process"
                : `Edit Process ${processData.processCode}`}
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
          {/* Process Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              required
              label={labels.processName}
              placeholder="Enter Process Name"
              value={processData.processName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.processName}
              onChange={(e) => handleChange("processName", e.target.value)}
            />
          </Grid>

          {/* Process Description field */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled /// text
              multiline
              minRows={1}
              label={labels.processDescription}
              placeholder="Enter Process Description"
              value={processData.processDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.processDescription}
              onChange={(e) =>
                handleChange("processDescription", e.target.value)
              }
            />
          </Grid>

          {/* senior executire owner and email */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.seniorExecutiveName}
              placeholder="Senior Executive Owner Name"
              value={processData.seniorExecutiveOwnerName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.seniorExecutiveName}
              onChange={(e) =>
                handleChange("seniorExecutiveOwnerName", e.target.value)
              }
            />
          </Grid>
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.seniorExecutiveEmail}
              placeholder="Senior Executive Owner Email"
              value={processData.seniorExecutiveOwnerEmail}
              isTooltipRequired={true}
              tooltipTitle={tooltips.seniorExecutiveEmail}
              onChange={(e) =>
                handleChange("seniorExecutiveOwnerEmail", e.target.value)
              }
            />
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.operationsOwnerName}
              placeholder="Operations Owner Name"
              value={processData.operationsOwnerName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.operationsOwnerName}
              onChange={(e) =>
                handleChange("operationsOwnerName", e.target.value)
              }
            />
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.operationsOwnerEmail}
              placeholder="Operations Owner Email"
              value={processData.operationsOwnerEmail}
              isTooltipRequired={true}
              tooltipTitle={tooltips.operationsOwnerEmail}
              onChange={(e) =>
                handleChange("operationsOwnerEmail", e.target.value)
              }
            />
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.technologyOwnerName}
              placeholder="Technology Owner Name"
              value={processData.technologyOwnerName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.technologyOwnerName}
              onChange={(e) =>
                handleChange("technologyOwnerName", e.target.value)
              }
            />
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.technologyOwnerEmail}
              placeholder="Technology Owner Email"
              value={processData.technologyOwnerEmail}
              isTooltipRequired={true}
              tooltipTitle={tooltips.technologyOwnerEmail}
              onChange={(e) =>
                handleChange("technologyOwnerEmail", e.target.value)
              }
            />
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled /// text
              label={labels.organizationalRevenueImpactPercentage}
              placeholder="Organizational Revenue Impact Percentage"
              value={processData.organizationalRevenueImpactPercentage}
              isTooltipRequired={true}
              tooltipTitle={tooltips.organizationalRevenueImpactPercentage}
              onChange={(e) =>
                handleChange(
                  "organizationalRevenueImpactPercentage",
                  e.target.value
                )
              }
            />
          </Grid>

          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="is-thirdPartyInvolvement-radio-buttons-group"
              >
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.thirdPartyInvolvement}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.thirdPartyInvolvement}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-thirdPartyInvolvement-radio-buttons-group"
                name={labels.thirdPartyInvolvement}
                row
                value={processData.thirdPartyInvolvement}
                onChange={(e) => {
                  handleChange("thirdPartyInvolvement", e.target.value);
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

          <Grid pl={1.5} size={{ xs: 6 }}>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel
                component="legend"
                id="is-redundancy-radio-buttons-group"
              >
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="body2" color="#121212">
                    {labels.financialMateriality}
                  </Typography>
                  <TooltipComponent
                    title={tooltips.financialMateriality}
                    width={"12px"}
                    height={"12px"}
                  />
                </Box>
              </FormLabel>
              <RadioGroup
                aria-labelledby="is-redundancy-radio-buttons-group"
                name="isRedundancy"
                row
                value={processData.financialMateriality}
                onChange={(e) => {
                  handleChange("financialMateriality", e.target.value);
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
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              multiple
              value={processData.requlatoryAndCompliance || []}
              label={labels.regulatoryAndCompliance}
              isTooltipRequired={true}
              tooltipTitle={tooltips.regulatoryAndCompliance}
              displayEmpty
              onChange={(e) =>
                handleChange(
                  "requlatoryAndCompliance",
                  e.target.value as string
                )
              }
              renderValue={(selected: any) => {
                if (!selected || selected.length === 0) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Regulation And Compliance
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
              <MenuItem value="HIPAA">HIPAA</MenuItem>
              <MenuItem value="NIST CSF">NIST CSF</MenuItem>
              <MenuItem value="NIST 800">NIST 800</MenuItem>
            </SelectStyled>
          </Grid>
          {/* Criticality of Data Processed */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={processData.criticalityOfDataProcessed}
              label={labels.criticalityOfDataProcessed}
              isTooltipRequired={true}
              tooltipTitle={tooltips.criticalityOfDataProcessed}
              displayEmpty
              onChange={(e) =>
                handleChange(
                  "criticalityOfDataProcessed",
                  e.target.value as string
                )
              }
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
                      Select Criticality
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
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Third Party Users">Low</MenuItem>
            </SelectStyled>
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              multiple
              value={processData.dataProcessed || []}
              label={labels.dataProcessed}
              isTooltipRequired={true}
              tooltipTitle={tooltips.dataProcessed}
              displayEmpty
              onChange={(e) =>
                handleChange("dataProcessed", e.target.value as string)
              }
              renderValue={(selected: any) => {
                if (!selected || selected.length === 0) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Data Processed
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
              <MenuItem value="PHI">PHI</MenuItem>
              <MenuItem value="PII">PII</MenuItem>
              <MenuItem value="PCI">PCI</MenuItem>
            </SelectStyled>
          </Grid>

          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              value={processData.users || []}
              label={labels.users}
              isTooltipRequired={true}
              tooltipTitle={tooltips.users}
              multiple
              displayEmpty
              onChange={(e) => handleChange("users", e.target.value as string)}
              renderValue={(selected: any) => {
                if (!selected || selected?.length === 0) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                        textTransform: "capitalize",
                      }}
                    >
                      Select Users
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
              <MenuItem value="Internal Users">Internal Users</MenuItem>
              <MenuItem value="Public Users">Public Users</MenuItem>
              <MenuItem value="Third Party Users">Third Party Users</MenuItem>
            </SelectStyled>
          </Grid>

          {/* RELATED PROCESS SECTION */}
          <Grid mt={3} size={{ xs: 12 }}>
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
                      processForListing.find(
                        (item) =>
                          item.id === newDependentProcess?.targetProcessId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setNewDependentProcess({
                        sourceProcessId: processData.id ?? null,
                        targetProcessId: newValue?.id as number,
                        relationType: null,
                      });
                    }}
                    options={processForListing.filter(
                      (p) => p.id !== processData.id
                    )}
                    getOptionLabel={(option) => option.processName}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body1"
                              color="#121212"
                              fontWeight={500}
                            >
                              {labels.selectProcess}
                            </Typography>
                            <TooltipComponent title={tooltips.selectProcess} />
                          </Box>
                        }
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
                  <SelectStyled
                    isTooltipRequired={true}
                    tooltipTitle={tooltips.processRelationshipType}
                    value={newDependentProcess?.relationType ?? ""}
                    label={labels.processRelationshipType}
                    onChange={(e) => {
                      setNewDependentProcess((prev: any) => {
                        if (!prev || prev.targetProcessId === null) {
                          alert(
                            "Process ID is required before setting relation type."
                          );
                          return prev;
                        }

                        return {
                          ...prev,
                          relationType: e.target.value,
                        };
                      });
                    }}
                    renderValue={(selected: any) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#9e9e9e" }}>
                            Select Relationship Type
                          </span>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="follows">Follows</MenuItem>
                    <MenuItem value="precedes">Precedes</MenuItem>
                  </SelectStyled>
                </Grid>

                {/* Add Button */}
                <Grid size={{ xs: 1.5 }}>
                  <Button
                    variant="contained"
                    onClick={addRelatedProcess}
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
              {processData?.processDependency &&
                processData?.processDependency?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {processData?.processDependency?.map((relation, index) => {
                      let process = null;
                      let relationType = null;
                      let key = null;
                      if (relation.targetProcessId === processData.id) {
                        key = relation.sourceProcessId;
                        process = processForListing?.find(
                          (p) => p.id === relation.sourceProcessId
                        );
                        relationType =
                          relation.relationshipType === "follows"
                            ? "precedes"
                            : "follows";
                      } else {
                        console.log(processData.id, relation);
                        key = relation.targetProcessId;
                        process = processForListing?.find(
                          (p) => p.id === relation.targetProcessId
                        );
                        console.log(process);
                        relationType = relation.relationshipType;
                      }
                      return (
                        <Chip
                          key={key}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ fontWeight: 500 }}
                              >
                                {process?.processName}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  color: "#666",
                                  fontSize: "0.75rem",
                                  fontStyle: "italic",
                                }}
                              >
                                ({relationType?.replace("_", " ")})
                              </Typography>
                            </Box>
                          }
                          onDelete={() =>
                            removeRelatedProcess(
                              relation.sourceProcessId ?? null,
                              relation.targetProcessId as number
                            )
                          }
                          sx={{
                            backgroundColor: "#e8f5e8",
                            color: "#2e7d32",
                            height: "auto",
                            minHeight: "32px",
                            "& .MuiChip-label": {
                              padding: "6px 12px",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            },
                            "& .MuiChip-deleteIcon": {
                              color: "#2e7d32",
                              "&:hover": {
                                color: "#cd0303",
                              },
                            },
                          }}
                        />
                      );
                    })}
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
                          <span style={{ color: "#9e9e9e" }}>Select Key</span>
                        );
                      } else {
                        const label = metaDatas.find(
                          (m) => m.id === selected
                        )?.label;
                        return (
                          label ?? (
                            <span style={{ color: "#9e9e9e" }}>Select Key</span>
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
                          <span style={{ color: "#9e9e9e" }}>
                            Please Select Key First
                          </span>
                        );
                      } else if (!selected || selected.length < 1) {
                        return (
                          <span style={{ color: "#9e9e9e" }}>Enter Value</span>
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
            <Button startIcon={<Add />} onClick={addKeyValue}>
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
          sx={{ width: 160, height: 40, borderRadius: 1 }}
          variant="outlined"
          color="error"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Box display={"flex"} gap={3}>
          <Button
            onClick={() => {
              onSubmit("draft");
            }}
            sx={{ width: 161, height: 40, borderRadius: 1 }}
            variant="outlined"
          >
            Save as Draft
          </Button>
          <Button
            sx={{ width: 132, height: 40, borderRadius: 1 }}
            variant="contained"
            disabled={
              processData.processName === "" ||
              processData.processDescription === ""
            }
            disableRipple
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
