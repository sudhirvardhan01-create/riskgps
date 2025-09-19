import React, { useState } from "react";
import { Close, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  Autocomplete,
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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import { ControlForm, ControlFrameworkForm } from "@/types/control";
import SelectStyled from "@/components/SelectStyled";
import TooltipComponent from "@/components/TooltipComponent";

interface ControlFrameworkFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  controls: ControlForm[];
  formData: ControlFrameworkForm;
  setFormData: React.Dispatch<React.SetStateAction<ControlFrameworkForm>>;
  onSubmit: (status: string) => void;
}

const ControlFrameworkFormModal: React.FC<ControlFrameworkFormModalProps> = ({
  operation,
  open,
  onClose,
  controls,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [selectedMITREControlID, setSelectedMITREControlID] = useState<
    string | null
  >(null);
  const distictMITREControlIDs = [
    ...new Set(controls.map((item) => item.mitreControlId)),
  ];
  //Function to handle the Field change
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const addMITREControlID = () => {
    if (selectedMITREControlID) {
      setFormData((prev) => ({
        ...prev,
        mitreControls: [
          ...(formData.mitreControls ?? []),
          selectedMITREControlID,
        ],
      }));
    }
    setSelectedMITREControlID(null);
  };

  const deleteMITREControlID = (id: number) => {
    const updatedMITREControls = formData.mitreControls.filter(
      (_, i) => i !== id
    );
    setFormData((prev) => ({ ...prev, mitreControls: updatedMITREControls }));
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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
              value={formData.frameWorkName}
              label={labels.framework}
              isTooltipRequired={true}
              tooltipTitle={tooltips.framework}
              displayEmpty
              onChange={(e) =>
                handleFieldChange("frameWorkName", e.target.value)
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
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.frameworkControlSubcategory}
              isTooltipRequired={true}
              tooltipTitle={tooltips.frameworkControlSubcategory}
              placeholder="Enter Control Sub-category"
              multiline
              minRows={1}
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
                Mapping with MITRE Controls
              </Typography>
              <Stack
                display={"flex"}
                flexDirection={"row"}
                gap={2}
                alignItems={"center"}
              >
                <Grid size={{ xs: 10 }}>
                  <Autocomplete
                    disablePortal
                    options={distictMITREControlIDs}
                    value={selectedMITREControlID}
                    onChange={(event: any, newValue: string | null) => {
                      setSelectedMITREControlID(newValue);
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "52px",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
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
                        "& input": {
                          padding: "14px 16px",
                          fontSize: "16px",
                          color: "#484848",
                          "&::placeholder": {
                            color: "#9E9FA5",
                            opacity: 1,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#121212",
                        "&.Mui-focused": {
                          color: "#121212",
                        },
                        "&.MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{
                          shrink: true,
                        }}
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
                              {labels.mitreControlId}
                            </Typography>
                            <Typography color="#FB2020" variant="body1" fontWeight={600}>*</Typography>
                            <TooltipComponent title={tooltips.mitreControlId} />
                          </Box>
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Button
                    variant="contained"
                    onClick={addMITREControlID}
                    disabled={!selectedMITREControlID}
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
              </Stack>
              {formData?.mitreControls &&
                formData?.mitreControls?.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>MITRE Control ID</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.mitreControls?.map((control, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  <TableCell>{control}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() =>
                                        deleteMITREControlID(index)
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
      <Box sx={{ display: "flex", justifyContent: "center", my: 2.5, mx: 3 }}>
        <Divider sx={{ width: "100%" }} />
      </Box>
      <DialogActions
        sx={{
          pt: 1.5,
          display: "flex",
          justifyContent: "space-between",
          pb: 4,
          px: 3,
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
              formData.frameWorkName === "" ||
              formData.frameWorkControlCategoryId === "" ||
              formData.frameWorkControlCategory === "" ||
              !formData.mitreControls ||
              formData.mitreControls.length === 0
            }
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

export default ControlFrameworkFormModal;