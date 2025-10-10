import React, { useCallback, useState } from "react";
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
  FormControlLabel,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tabsClasses,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Close,
  DeleteOutlineOutlined,
  DoneOutlined,
  EditOutlined,
} from "@mui/icons-material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import { MITREControlForm, RelatedThreatForm } from "@/types/control";
import RelatedThreatFormModal from "./RelatedThreatFormModal";

interface ControlFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: MITREControlForm;
  setFormData: React.Dispatch<React.SetStateAction<MITREControlForm>>;
  onSubmit: (status: string) => void;
}

const ControlFormModal: React.FC<ControlFormModalProps> = ({
  operation,
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    formData.controlDetails[0]?.mitreControlName
  );
  const selectedSubControls = formData.controlDetails.find(
    (item) => item.mitreControlName === selectedTab
  )?.subControls;

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const [isEditRelatedThreatModalOpen, setIsEditRelatedThreatModalOpen] =
    useState<boolean>(false);
  const [selectedRelatedThreat, setSelectedRelatedThreat] =
    useState<RelatedThreatForm | null>(null);
  const [selectedRecordID, setSelectedRecordID] = useState<number | null>(null);

  const editRelatedThreat = (id: number) => {
    const updatedControlDetails = formData.controlDetails?.map((control) => {
      if (control.mitreControlName === selectedTab) {
        const updatedRelatedThreats = control?.subControls;
        if (updatedRelatedThreats) {
          updatedRelatedThreats[id].mitreControlDescription =
            selectedRelatedThreat?.mitreControlDescription ?? "";
          updatedRelatedThreats[id].bluOceanControlDescription =
            selectedRelatedThreat?.bluOceanControlDescription ?? "";
        }
        return { ...control, subControls: updatedRelatedThreats };
      }
      return control;
    });
    setFormData((prev) => ({ ...prev, controlDetails: updatedControlDetails }));
  };

  const deleteRelatedThreat = (id: number) => {
    const updatedControlDetails = formData?.controlDetails.map((control) => {
      if (control.mitreControlName === selectedTab) {
        return {
          ...control,
          subControls: control.subControls?.filter((_, i) => i !== id),
        };
      }
      return control;
    });
    setFormData((prev) => ({ ...prev, controlDetails: updatedControlDetails }));
  };

  const handleChange = useCallback(
    (field: keyof MITREControlForm, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData] // only depends on setter from props
  );

  const getStatusComponent = () => {
    if (
      formData.status === "published" ||
      formData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={formData.status === "published"}
            />
          }
          label={formData.status === "published" ? "Enabled" : "Disabled"}
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
    <>
      {/* Edit Related Threat */}
      {selectedRelatedThreat && (
        <RelatedThreatFormModal
          operation="edit"
          open={isEditRelatedThreatModalOpen}
          onClose={() => setIsEditRelatedThreatModalOpen(false)}
          formData={selectedRelatedThreat}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedRelatedThreat((prev) =>
                val(prev as RelatedThreatForm)
              );
            } else {
              setSelectedRelatedThreat(val);
            }
          }}
          onSubmit={() => {
            if (typeof selectedRecordID === "number")
              editRelatedThreat(selectedRecordID);
            setIsEditRelatedThreatModalOpen(false);
            console.log("Submitted");
          }}
        />
      )}
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
                  ? "Add Control"
                  : `Edit Control ${formData.mitreControlId}`}
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
            {/* MITRE Control ID */}
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                disabled
                required
                label={labels.mitreControlId}
                isTooltipRequired={true}
                tooltipTitle={tooltips.mitreControlId}
                placeholder="Enter MITRE Control ID"
                value={formData.mitreControlId}
                onChange={(e) => handleChange("mitreControlId", e.target.value)}
              />
            </Grid>

            {/* MITRE Control Type */}
            <Grid mt={1} size={{ xs: 6 }}>
              <SelectStyled
                disabled
                required
                value={formData.mitreControlType}
                label={labels.mitreControlType}
                isTooltipRequired={true}
                tooltipTitle={tooltips.mitreControlType}
                displayEmpty
                onChange={(e) =>
                  handleChange("mitreControlType", e.target.value)
                }
                renderValue={(selected: any) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#9E9FA5",
                        }}
                      >
                        Select MITRE Control Type
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
                        {selected}
                      </Typography>
                    );
                  }
                }}
              >
                <MenuItem value="MITIGATION">MITIGATION</MenuItem>
                <MenuItem value="DETECTION">DETECTION</MenuItem>
              </SelectStyled>
            </Grid>

            {/* Control Priority */}
            <Grid mt={1} size={{ xs: 6 }}>
              <SelectStyled
                required
                value={formData.controlPriority}
                label={labels.controlPriority}
                isTooltipRequired={true}
                tooltipTitle={tooltips.controlPriority}
                displayEmpty
                onChange={(e) =>
                  handleChange("controlPriority", e.target.value)
                }
                renderValue={(selected: any) => {
                  if (!selected) {
                    return (
                      <Typography variant="body2" sx={{ color: "#9E9FA5" }}>
                        {tooltips.controlPriority}
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
                        {selected}
                      </Typography>
                    );
                  }
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </SelectStyled>
            </Grid>

            {/* MITRE Control Name */}
            {formData.controlDetails.length === 1 && (
              <Grid mt={1} size={{ xs: 6.001 }}>
                <TextFieldStyled
                  disabled
                  required
                  label={labels.mitreControlName}
                  isTooltipRequired={true}
                  tooltipTitle={tooltips.mitreControlName}
                  placeholder="Enter MITRE Control Name"
                  value={formData.controlDetails[0]?.mitreControlName}
                  // onChange={(e) =>
                  //   handleChange("mitreControlName", e.target.value)
                  // }
                />
              </Grid>
            )}

            {formData.controlDetails.length > 1 && (
              <Grid size={{ xs: 12 }} mt={-1}>
                <Tabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                      "&.Mui-disabled": { opacity: 0.3 },
                    },
                  }}
                >
                  {formData.controlDetails.map((item) => (
                    <Tab
                      label={item.mitreControlName}
                      key={item.mitreControlName}
                      value={item.mitreControlName}
                    />
                  ))}
                </Tabs>
              </Grid>
            )}

            {/* RELATED THREATS SECTION */}
            <Grid mt={1} size={{ xs: 12 }}>
              <Stack display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="h6" fontWeight={600}>
                  Related Threats
                </Typography>
                {selectedSubControls && selectedSubControls?.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>MITRE Technique ID</TableCell>
                              <TableCell>Sub Technique ID</TableCell>
                              <TableCell>MITRE Control Description</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedSubControls?.map((control, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  <TableCell>
                                    {control.mitreTechniqueId}
                                  </TableCell>
                                  <TableCell>
                                    {control.subTechniqueId
                                      ? control.subTechniqueId
                                      : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {control.mitreControlDescription}
                                  </TableCell>
                                  <TableCell>
                                    <Stack
                                      display={"flex"}
                                      flexDirection={"row"}
                                    >
                                      <IconButton
                                        onClick={() => {
                                          setSelectedRelatedThreat(control);
                                          setSelectedRecordID(index);
                                          setIsEditRelatedThreatModalOpen(true);
                                        }}
                                      >
                                        <EditOutlined
                                          sx={{ color: "primary.main" }}
                                        />
                                      </IconButton>
                                      <IconButton
                                        onClick={() =>
                                          deleteRelatedThreat(index)
                                        }
                                      >
                                        <DeleteOutlineOutlined
                                          sx={{ color: "#cd0303" }}
                                        />
                                      </IconButton>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}
              </Stack>
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
    </>
  );
};

export default ControlFormModal;
