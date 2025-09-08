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
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Add, Close, DeleteOutlineOutlined, DoneOutlined, EditOutlined } from "@mui/icons-material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import { ControlForm, NISTControls } from "@/types/control";

interface ControlFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: ControlForm;
  setFormData: React.Dispatch<React.SetStateAction<ControlForm>>;
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
  const handleChange = useCallback(
    (field: keyof ControlForm, value: any) => {
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
              required
              label={labels.mitreControlId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlId}
              placeholder="Enter MITRE Control ID"
              value={formData.mitreControlId}
              onChange={(e) => handleChange("mitreControlId", e.target.value)}
            />
          </Grid>

          {/* MITRE Control Name */}
          <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              required
              label={labels.mitreControlName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.mitreControlName}
              placeholder="Enter MITRE Control Name"
              value={formData.mitreControlName}
              onChange={(e) => handleChange("mitreControlName", e.target.value)}
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
              onChange={(e) => handleChange("mitreControlType", e.target.value)}
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

          {/* NIST 2.0 Control Category ID */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.nistControlCategoryId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.nistControlCategoryId}
              placeholder="Enter NIST 2.0 Control Category ID"
              value={nistFormData.frameWorkControlCategoryId}
              onChange={(e) =>
                handleNISTChange("frameWorkControlCategoryId", e.target.value)
              }
            />
          </Grid> */}

          {/* NIST 2.0 Control Category */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.nistControlCategory}
              isTooltipRequired={true}
              tooltipTitle={tooltips.nistControlCategory}
              placeholder="Enter NIST 2.0 Control Category"
              value={nistFormData.frameWorkControlCategory}
              onChange={(e) => handleNISTChange("frameWorkControlCategory", e.target.value)}
            />
          </Grid> */}

          {/* NIST 2.0 Control Sub-category ID */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.nistControlSubcategoryId}
              isTooltipRequired={true}
              tooltipTitle={tooltips.nistControlSubcategoryId}
              placeholder="Enter NIST 2.0 Control Sub-category ID"
              value={nistFormData.frameWorkControlSubCategoryId}
              onChange={(e) => handleNISTChange("frameWorkControlSubCategoryId", e.target.value)}
            />
          </Grid> */}

          {/* NIST 2.0 Control Sub-category */}
          {/* <Grid mt={1} size={{ xs: 6 }}>
            <TextFieldStyled
              label={labels.nistControlSubcategory}
              isTooltipRequired={true}
              tooltipTitle={tooltips.nistControlSubcategory}
              placeholder="Enter NIST 2.0 Control Sub-category"
              value={nistFormData.frameWorkControlSubCategory}
              onChange={(e) => handleNISTChange("frameWorkControlSubCategory", e.target.value)}
            />
          </Grid> */}

          {/* NIST CONTROLS SECTION */}
          <Grid mt={1} size={{ xs: 12 }}>
            <Stack display={"flex"} flexDirection={"column"} gap={2}>
              <Typography variant="h6" fontWeight={600}>
                NIST Controls
              </Typography>
              <Grid size={{ xs: 12 }}>
                <Button
                  startIcon={<Add />}
                  // onClick={() => {
                  //   setIsAddRelatedControlOpen(true);
                  //   setRelatedControlFormData(initialRelatedControlFormData);
                  // }}
                  sx={{ paddingY: 0 }}
                >
                  Add NIST Control
                </Button>
              </Grid>
              {formData?.nistControls && formData?.nistControls?.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>NIST 2.0 Control Category ID</TableCell>
                            <TableCell>NIST 2.0 Control Category</TableCell>
                            <TableCell>NIST 2.0 Control Sub-category ID</TableCell>
                            <TableCell>NIST 2.0 Control Sub-category</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.nistControls?.map((control, index) => {
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell>{control.frameWorkControlCategoryId}</TableCell>
                                <TableCell>
                                  {control.frameWorkControlCategory}
                                </TableCell>
                                <TableCell>
                                  {control.frameWorkControlSubCategoryId}
                                </TableCell>
                                <TableCell>
                                  {control.frameWorkControlSubCategory}
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    // onClick={() => {
                                    //   setSelectedRelatedControl(control);
                                    //   setSelectedControlID(index);
                                    //   setIsEditRelatedControlOpen(true);
                                    // }}
                                  >
                                    <EditOutlined
                                      sx={{ color: "primary.main" }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    // onClick={() => deleteRelatedControl(index)}
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

export default ControlFormModal;
