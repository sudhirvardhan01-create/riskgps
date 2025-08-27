import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Button,
  MenuItem,
  IconButton,
  Typography,
  DialogActions,
  Divider,
  Chip,
  Stack,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  Close,
  DeleteOutlineOutlined,
  DoneOutlined,
} from "@mui/icons-material";
import {
  RiskScenarioAttributes,
  RiskScenarioData,
} from "@/types/risk-scenario";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import TextFieldStyled from "@/components/TextFieldStyled";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import SelectStyled from "@/components/SelectStyled";

interface RiskScenarioFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  riskData: RiskScenarioData;
  processes: any[];
  metaDatas: any[];
  setRiskData: React.Dispatch<React.SetStateAction<RiskScenarioData>>;
  onSubmit: (status: string) => void;
}

const RiskScenarioFormModal: React.FC<RiskScenarioFormModalProps> = ({
  operation,
  open,
  onClose,
  riskData,
  setRiskData,
  processes,
  metaDatas,
  onSubmit,
}) => {
  console.log(processes);
  // State for related processes
  const [newRelatedProcess, setNewRelatedProcess] = React.useState<
    number | null
  >();

  const handleChange = (field: keyof RiskScenarioData, value: string) => {
    setRiskData({ ...riskData, [field]: value });
  };

  const handleKeyValueChange = (
    index: number,
    field: keyof RiskScenarioAttributes,
    value: number | string[]
  ) => {
    const updatedKeyValues = [...(riskData.attributes ?? [])];
    if (field == "meta_data_key_id" && typeof value == "number") {
      updatedKeyValues[index].meta_data_key_id = value;
      updatedKeyValues[index].values = [];
    } else if (field === "values" && Array.isArray(value)) {
      updatedKeyValues[index].values = value;
    }
    setRiskData({ ...riskData, attributes: updatedKeyValues });
  };

  const addKeyValue = () => {
    setRiskData({
      ...riskData,
      attributes: [
        ...(riskData.attributes ?? []),
        { meta_data_key_id: null, values: [] as string[] },
      ],
    });
  };

  const removeKeyValue = (index: number) => {
    const updatedKeyValues = riskData.attributes?.filter((_, i) => i !== index);
    setRiskData({ ...riskData, attributes: updatedKeyValues });
  };

  // Related Process handling functions
  const addRelatedProcess = () => {
    if (
      newRelatedProcess &&
      !riskData?.related_processes?.includes(newRelatedProcess)
    ) {
      //   setRelatedProcesses([...relatedProcesses, newRelatedProcess]);

      setRiskData({
        ...riskData,
        related_processes: [
          ...(riskData?.related_processes ?? []),
          newRelatedProcess,
        ],
      });
      setNewRelatedProcess(null);
    }
  };

  const removeRelatedProcess = (processToRemove: number) => {
    setRiskData({
      ...riskData,
      related_processes: riskData?.related_processes?.filter(
        (process) => process !== processToRemove
      ),
    });
  };

  const getStatusComponent = () => {
    if (
      riskData.status === "published" ||
      riskData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={riskData.status === "published"}
            />
          }
          label={riskData.status === "published" ? "Enabled" : "Disabled"}
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
                ? "Add Risk Scenario"
                : `Edit Risk Scenario ${riskData.risk_code}`}
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
          {/* Risk Scenario */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.riskScenario}
              placeholder="Enter Risk Scenario"
              value={riskData.riskScenario}
              required
              isTooltipRequired={true}
              tooltipTitle={tooltips.riskScenario}
              onChange={(e) => handleChange("riskScenario", e.target.value)}
            />
          </Grid>

          {/* Risk Statement */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.riskStatement}
              placeholder="Enter Risk Statement"
              value={riskData.riskStatement}
              isTooltipRequired={true}
              tooltipTitle={tooltips.riskStatement}
              onChange={(e) => handleChange("riskStatement", e.target.value)}
            />
          </Grid>

          {/* Risk Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.riskDescription}
              placeholder="Enter Risk Description"
              value={riskData.riskDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.riskDescription}
              onChange={(e) => handleChange("riskDescription", e.target.value)}
            />
          </Grid>

          {/* Risk Field 1*/}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Risk Field 1"
              placeholder="Enter Risk Field 1"
              value={riskData.riskField1}
              isTooltipRequired={true}
              tooltipTitle="Enter Risk Field 1"
              onChange={(e) => handleChange("riskField1", e.target.value)}
            />
          </Grid> */}

          {/* Risk Field 2*/}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label="Risk Field 2"
              placeholder="Enter Risk Field 2"
              value={riskData.riskField2}
              isTooltipRequired={true}
              tooltipTitle="Enter Risk Field 2"
              onChange={(e) => handleChange("riskField2", e.target.value)}
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
              {riskData?.related_processes &&
                riskData?.related_processes?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {riskData?.related_processes?.map((process, index) => (
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
          {riskData?.attributes?.map((kv, index) => {
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
            borderRadius: 1,
            border: "1px solid #CD0303",
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
            disabled={riskData.riskScenario === ""}
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

export default RiskScenarioFormModal;
