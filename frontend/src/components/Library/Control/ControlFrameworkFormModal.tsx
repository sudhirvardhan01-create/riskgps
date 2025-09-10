import React from "react";
import { Add, Close } from "@mui/icons-material";
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
  Stack,
  Typography,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import { ControlFrameworkForm } from "@/types/control";
import SelectStyled from "@/components/SelectStyled";

interface ControlFrameworkFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: ControlFrameworkForm;
  setFormData: React.Dispatch<React.SetStateAction<ControlFrameworkForm>>;
  onSubmit: () => void;
}

const ControlFrameworkFormModal: React.FC<ControlFrameworkFormModalProps> = ({
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
            ? "Add Control Mapping"
            : `Edit Control Mapping`}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={4}>
          {/* Framework Name */}
          <Grid mt={1} size={{ xs: 12 }}>
            <SelectStyled
              required
              value={formData.framework}
              label={labels.framework}
              isTooltipRequired={true}
              tooltipTitle={tooltips.framework}
              displayEmpty
              onChange={(e) => handleFieldChange("framework", e.target.value)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#9E9FA5",
                      }}
                    >
                      Select Control Framework
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
              <MenuItem value="NIST">NIST</MenuItem>
              <MenuItem value="ATLAS">ATLAS</MenuItem>
              <MenuItem value="CRI">CRI</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Framework Control Category ID */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.frameworkControlCategoryId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.frameworkControlCategoryId}
              placeholder="Enter Control Category ID"
              value={formData.frameWorkControlCategoryId}
              onChange={(e) =>
                handleFieldChange("frameWorkControlCategoryId", e.target.value)
              }
            />
          </Grid>

          {/* Framework Control Category */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.frameworkControlCategory}
              isTooltipRequired={true}
              tooltipTitle={tooltips.frameworkControlCategory}
              placeholder="Enter Control Category"
              value={formData.frameWorkControlCategory}
              onChange={(e) =>
                handleFieldChange("frameWorkControlCategory", e.target.value)
              }
            />
          </Grid>

          {/* Framework Control Sub-category ID */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.frameworkControlSubcategoryId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.frameworkControlSubcategoryId}
              placeholder="Enter Control Sub-category ID"
              value={formData.frameWorkControlSubCategoryId}
              onChange={(e) =>
                handleFieldChange(
                  "frameWorkControlSubCategoryId",
                  e.target.value
                )
              }
            />
          </Grid>

          {/* Framework Control Sub-category */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.frameworkControlSubcategory}
              isTooltipRequired={true}
              tooltipTitle={tooltips.frameworkControlSubcategory}
              placeholder="Enter Control Sub-category"
              value={formData.frameWorkControlSubCategory}
              onChange={(e) =>
                handleFieldChange("frameWorkControlSubCategory", e.target.value)
              }
            />
          </Grid>

          {/* RELATED CONTROLS SECTION */}
          <Grid mt={1} size={{ xs: 12 }}>
            <Stack display={"flex"} flexDirection={"column"} gap={2}>
              <Typography variant="h6" fontWeight={600}>
                Related MITRE Controls
              </Typography>
              <Grid size={{ xs: 12 }}>
                <Button
                  startIcon={<Add />}
                  onClick={() => {
                    // setIsAddRelatedControlOpen(true);
                    // setRelatedControlFormData(initialRelatedControlFormData);
                  }}
                  sx={{ paddingY: 0 }}
                >
                  Add New Control
                </Button>
              </Grid>
            </Stack>
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
              formData.framework === "" ||
              formData.frameWorkControlCategoryId === "" ||
              formData.frameWorkControlCategory === ""
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

export default ControlFrameworkFormModal;
