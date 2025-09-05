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
} from "@mui/material";
import {
  Add,
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
import { RelatedControlForm, ThreatForm } from "@/types/threat";
import RelatedControlFormModal from "./RelatedControlFormModal";

interface ThreatFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: ThreatForm;
  setFormData: React.Dispatch<React.SetStateAction<ThreatForm>>;
  metaDatas: any[];
  onSubmit: (status: string) => void;
}

const ThreatFormModal: React.FC<ThreatFormModalProps> = ({
  operation,
  open,
  onClose,
  formData,
  setFormData,
  metaDatas,
  onSubmit,
}) => {
  const initialRelatedControlFormData: RelatedControlForm = {
    mitreControlId: "",
    mitreControlName: "",
    mitreControlType: "",
    mitreControlDescription: "",
    bluOceanControlDescription: "",
  };

  const [isAddRelatedControlOpen, setIsAddRelatedControlOpen] =
    useState<boolean>(false);

  const [isEditRelatedControlOpen, setIsEditRelatedControlOpen] =
    useState<boolean>(false);

  const [relatedControlFormData, setRelatedControlFormData] =
    useState<RelatedControlForm>(initialRelatedControlFormData);

  const [selectedRelatedControl, setSelectedRelatedControl] =
    useState<RelatedControlForm | null>(null);

  const [selectedControlID, setSelectedControlID] = useState<number | null>(
    null
  );

  const addRelatedControl = () => {
    setFormData((prev) => ({
      ...prev,
      controls: [...(formData?.controls ?? []), { ...relatedControlFormData }],
    }));
  };

  const editRelatedControl = (index: number) => {
    const updatedRelatedControls = [...(formData?.controls ?? [])];
    updatedRelatedControls[index].mitreControlId =
      selectedRelatedControl?.mitreControlId ?? "";
    updatedRelatedControls[index].mitreControlName =
      selectedRelatedControl?.mitreControlName ?? "";
    updatedRelatedControls[index].mitreControlType =
      selectedRelatedControl?.mitreControlType ?? "";
    updatedRelatedControls[index].mitreControlDescription =
      selectedRelatedControl?.mitreControlDescription ?? "";
    updatedRelatedControls[index].bluOceanControlDescription =
      selectedRelatedControl?.bluOceanControlDescription ?? "";
    setFormData((prev) => ({ ...prev, controls: updatedRelatedControls }));
  };

  const deleteRelatedControl = (index: number) => {
    const updatedRelatedControls = formData?.controls?.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, controls: updatedRelatedControls }));
  };

  const mitrePlatforms = [
    "Windows",
    "macOS",
    "Linux",
    "Office 365",
    "Azure AD",
    "Google Workspace",
    "SaaS",
    "IaaS",
    "Network Devices",
    "Containers",
    "Android",
    "iOS",
  ];

  const ciaMappingItems = ["Confidentiality", "Integrity", "Availability"];

  const handleChange = useCallback(
    (field: keyof ThreatForm, value: any) => {
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
      {/* Add Related Control */}
      <RelatedControlFormModal
        operation="create"
        open={isAddRelatedControlOpen}
        onClose={() => {
          setIsAddRelatedControlOpen(false);
          setRelatedControlFormData(initialRelatedControlFormData);
        }}
        formData={relatedControlFormData}
        setFormData={setRelatedControlFormData}
        onSubmit={() => {
          addRelatedControl();
          setIsAddRelatedControlOpen(false);
        }}
      />

      {/* Edit Related Control */}
      {selectedRelatedControl && (
        <RelatedControlFormModal
          operation="edit"
          open={isEditRelatedControlOpen}
          onClose={() => {
            setIsEditRelatedControlOpen(false);
            setSelectedControlID(null);
            setSelectedRelatedControl(null);
          }}
          formData={selectedRelatedControl}
          setFormData={(val: any) => {
            if (typeof val === "function") {
              setSelectedRelatedControl((prev) =>
                val(prev as RelatedControlForm)
              );
            } else {
              setSelectedRelatedControl(val);
            }
          }}
          onSubmit={() => {
            if (typeof selectedControlID === "number") {
              editRelatedControl(selectedControlID);
            }
            setIsEditRelatedControlOpen(false);
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
                  ? "Add Threat"
                  : `Edit Threat ${formData.mitreTechniqueId}`}
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
            {/* MITRE Platforms */}
            <Grid mt={1} size={{ xs: 6 }}>
              <SelectStyled
                required
                multiple
                isTooltipRequired={true}
                tooltipTitle={tooltips.mitrePlatforms}
                value={formData.platforms}
                label={labels.mitrePlatforms}
                displayEmpty
                onChange={(e) =>
                  handleChange("platforms", e.target.value as string[])
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
                        Select MITRE Platforms
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
                {metaDatas?.find((item) => item.name === "Asset Category")
                  ?.supported_values &&
                metaDatas?.find((item) => item.name === "Asset Category")
                  ?.supported_values?.length > 0
                  ? metaDatas
                      ?.find((item) => item.name === "Asset Category")
                      ?.supported_values?.map((item: string) => {
                        return (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        );
                      })
                  : mitrePlatforms.map((item) => {
                      return (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
              </SelectStyled>
            </Grid>

            {/* MITRE Technique ID */}
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                required
                label={labels.mitreTechniqueId}
                isTooltipRequired={true}
                tooltipTitle={tooltips.mitreTechniqueId}
                placeholder="Enter MITRE Technique ID"
                value={formData.mitreTechniqueId}
                onChange={(e) =>
                  handleChange("mitreTechniqueId", e.target.value)
                }
              />
            </Grid>

            {/* MITRE Technique Name */}
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                required
                label={labels.mitreTechniqueName}
                isTooltipRequired={true}
                tooltipTitle={tooltips.mitreTechniqueName}
                placeholder="Enter MITRE Technique Name"
                value={formData.mitreTechniqueName}
                onChange={(e) =>
                  handleChange("mitreTechniqueName", e.target.value)
                }
              />
            </Grid>

            {/* CIA Mapping */}
            <Grid mt={1} size={{ xs: 6 }}>
              <SelectStyled
                required
                multiple
                value={formData.ciaMapping}
                label={labels.ciaMapping}
                isTooltipRequired={true}
                tooltipTitle={tooltips.ciaMapping}
                displayEmpty
                onChange={(e) => handleChange("ciaMapping", e.target.value)}
                renderValue={(selected: any) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#9E9FA5",
                        }}
                      >
                        Select CIA Mapping
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
                {metaDatas?.find((item) => item.name === "CIA Mapping")
                  ?.supported_values &&
                metaDatas?.find((item) => item.name === "CIA Mapping")
                  ?.supported_values?.length > 0
                  ? metaDatas
                      ?.find((item) => item.name === "CIA Mapping")
                      ?.supported_values?.map(
                        (metaData: string, index: number) => (
                          <MenuItem value={metaData[0]} key={index}>
                            {metaData}
                          </MenuItem>
                        )
                      )
                  : ciaMappingItems.map((item) => {
                      return (
                        <MenuItem value={item[0]} key={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
              </SelectStyled>
            </Grid>

            {/* Sub Technique ID */}
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                label={labels.subTechniqueId}
                isTooltipRequired={true}
                tooltipTitle={tooltips.subTechniqueId}
                placeholder="Enter Sub Technique ID"
                value={formData.subTechniqueId}
                onChange={(e) => handleChange("subTechniqueId", e.target.value)}
              />
            </Grid>

            {/* Sub Technique Name */}
            <Grid mt={1} size={{ xs: 6 }}>
              <TextFieldStyled
                label={labels.subTechniqueName}
                isTooltipRequired={true}
                tooltipTitle={tooltips.subTechniqueName}
                placeholder="Enter Sub Technique Name"
                value={formData.subTechniqueName}
                onChange={(e) =>
                  handleChange("subTechniqueName", e.target.value)
                }
              />
            </Grid>

            {/* RELATED CONTROLS SECTION */}
            <Grid mt={1} size={{ xs: 12 }}>
              <Stack display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="h6" fontWeight={600}>
                  Related Controls
                </Typography>
                <Grid size={{ xs: 12 }}>
                  <Button
                    startIcon={<Add />}
                    onClick={() => {
                      setIsAddRelatedControlOpen(true);
                      setRelatedControlFormData(initialRelatedControlFormData);
                    }}
                    sx={{ paddingY: 0 }}
                  >
                    Add New Control
                  </Button>
                </Grid>
                {formData?.controls && formData?.controls?.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>MITRE Control ID</TableCell>
                              <TableCell>MITRE Control Name</TableCell>
                              <TableCell>MITRE Control Type</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.controls?.map((control, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  <TableCell>
                                    {control.mitreControlId}
                                  </TableCell>
                                  <TableCell>
                                    {control.mitreControlName}
                                  </TableCell>
                                  <TableCell>
                                    {control.mitreControlType}
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => {
                                        setSelectedRelatedControl(control);
                                        setSelectedControlID(index);
                                        setIsEditRelatedControlOpen(true);
                                      }}
                                    >
                                      <EditOutlined
                                        sx={{ color: "primary.main" }}
                                      />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        deleteRelatedControl(index)
                                      }
                                    >
                                      <DeleteOutlineOutlined
                                        sx={{ color: "#cd0303" }}
                                      />
                                    </IconButton>
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
              disabled={
                formData.platforms?.length === 0 ||
                formData.mitreTechniqueId === "" ||
                formData.mitreTechniqueName === "" ||
                formData.ciaMapping?.length === 0
              }
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

export default ThreatFormModal;
