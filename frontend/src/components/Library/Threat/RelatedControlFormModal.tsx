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
  MenuItem,
  Typography,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import SelectStyled from "@/components/SelectStyled";
import { RelatedControlForm } from "@/types/threat";

interface RelatedControlFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: RelatedControlForm;
  setFormData: React.Dispatch<React.SetStateAction<RelatedControlForm>>;
  onSubmit: () => void;
}

const RelatedControlFormModal: React.FC<RelatedControlFormModalProps> = ({
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
          {operation === "create" ? "Add Control" : `Edit Control`}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={4}>
          {/* MITRE Control ID */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.mitreControlId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlId}
              placeholder="Enter MITRE Control ID"
              value={formData.mitreControlId}
              required
              onChange={(e) =>
                handleFieldChange("mitreControlId", e.target.value)
              }
            />
          </Grid>

          {/* MITRE Control Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.mitreControlName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlName}
              placeholder="Enter MITRE Control Name"
              value={formData.mitreControlName}
              required
              onChange={(e) =>
                handleFieldChange("mitreControlName", e.target.value)
              }
            />
          </Grid>

          {/* MITRE Control Type */}
          <Grid mt={1} size={{ xs: 6 }}>
            <SelectStyled
              required
              value={formData.mitreControlType}
              label={labels.mitreControlType}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlType}
              displayEmpty
              onChange={(e) =>
                handleFieldChange("mitreControlType", e.target.value)
              }
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography variant="body1" sx={{ color: "#9E9FA5" }}>
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

          {/* MITRE Control Description */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
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

          {/* Control Priority */}
          <Grid mt={1} size={{ xs: 12 }}>
            <SelectStyled
              required
              value={formData.controlPriority}
              label={labels.controlPriority}
              isTooltipRequired={true}
              tooltipTitle={tooltips.controlPriority}
              displayEmpty
              onChange={(e) =>
                handleFieldChange("controlPriority", e.target.value)
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
              formData.mitreControlId === "" ||
              formData.mitreControlName === "" ||
              formData.mitreControlType === ""
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

export default RelatedControlFormModal;
