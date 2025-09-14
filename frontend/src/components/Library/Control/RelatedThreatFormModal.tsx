import React from "react";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import { RelatedThreatForm } from "@/types/control";

interface RelatedThreatFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: RelatedThreatForm;
  setFormData: React.Dispatch<React.SetStateAction<RelatedThreatForm>>;
  onSubmit: () => void;
}

const RelatedThreatFormModal: React.FC<RelatedThreatFormModalProps> = ({
  operation,
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  //Function to handle the Field change
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            paddingTop: "16px",
            paddingLeft: "12px",
            paddingRight: "10px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={550} color="#121212">
          {operation === "create"
            ? "Add Threat Details"
            : `Edit Threat Details`}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={4}>
          {/* MITRE Technique ID */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.mitreTechniqueId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreTechniqueId}
              placeholder="Enter MITRE Technique ID"
              value={formData.mitreTechniqueId}
              required
              onChange={(e) =>
                handleFieldChange("mitreTechniqueId", e.target.value)
              }
            />
          </Grid>

          {/* MITRE Technique Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.mitreTechniqueName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreTechniqueName}
              placeholder="Enter MITRE Technique Name"
              value={formData.mitreTechniqueName}
              required
              onChange={(e) =>
                handleFieldChange("mitreTechniqueName", e.target.value)
              }
            />
          </Grid>

          {/* Sub Technique ID */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.subTechniqueId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.subTechniqueId}
              placeholder="Enter Sub Technique ID"
              value={formData.subTechniqueId}
              onChange={(e) =>
                handleFieldChange("subTechniqueId", e.target.value)
              }
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
                handleFieldChange("subTechniqueName", e.target.value)
              }
            />
          </Grid>

          {/* MITRE Control Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              multiline
              minRows={1}
              label={labels.mitreControlDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlDescription}
              placeholder="Enter MITRE Control Description"
              value={formData.mitreControlDescription}
              onChange={(e) =>
                handleFieldChange("mitreControlDescription", e.target.value)
              }
            />
          </Grid>

          {/* BluOcean Control Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              multiline
              minRows={1}
              label={labels.bluoceanControlDescription}
              isTooltipRequired={true}
              tooltipTitle={tooltips.bluoceanControlDescription}
              placeholder="Enter BluOcean Control Description"
              value={formData.bluOceanControlDescription}
              onChange={(e) =>
                handleFieldChange("bluOceanControlDescription", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2.5, mx: 3 }}>
        <Divider sx={{ width: "100%" }} />
      </Box>
      <DialogActions
        sx={{
          px: 3,
          pt: 1.5,
          pb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box display={"flex"} gap={3}>
          <Button
            onClick={onClose}
            sx={{
              width: 113,
              height: 40,
              borderRadius: 1,
              border: "1px solid #04139A",
            }}
            variant="outlined"
          >
            <Typography variant="body1" color="primary.main">
              Cancel
            </Typography>
          </Button>
          <Button
            sx={{
              width: 110,
              height: 40,
              borderRadius: 1,
            }}
            variant="contained"
            onClick={onSubmit}
            disabled={
              formData.mitreTechniqueId === "" ||
              formData.mitreTechniqueName === ""
            }
            disableRipple
          >
            <Typography variant="body1" color="#F4F4F4" fontWeight={600}>
              {operation === "create" ? "Add" : "Save"}
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RelatedThreatFormModal;
