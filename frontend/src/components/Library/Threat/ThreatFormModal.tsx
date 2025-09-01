import React, { useCallback } from "react";
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
} from "@mui/material";
import { Close, DoneOutlined } from "@mui/icons-material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import { ThreatForm } from "@/types/threat";

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

  const ciaMappingItems = [
    { value: "C", label: "Confidentiality" },
    { value: "I", label: "Integrity" },
    { value: "A", label: "Availability" },
  ];

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
              onChange={(e) => handleChange("mitreTechniqueId", e.target.value)}
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
                      {selected.join(",")}
                    </Typography>
                  );
                }
              }}
            >
              {ciaMappingItems.map((item) => {
                return (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
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
              onChange={(e) => handleChange("subTechniqueName", e.target.value)}
            />
          </Grid>

          {/* MITRE Control ID */}
          {/* <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.mitreControlId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlId}
              placeholder="Enter MITRE Control ID"
              value={formData.mitreControlId}
              onChange={(e) => handleChange("mitreControlId", e.target.value)}
            />
          </Grid> */}

          {/* MITRE Control Name */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.mitreControlName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlName}
              placeholder="Enter MITRE Control Name"
              value={formData.mitreControlName}
              onChange={(e) =>
                handleChange("mitreControlName", e.target.value)
              }
            />
          </Grid> */}
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

export default ThreatFormModal;
