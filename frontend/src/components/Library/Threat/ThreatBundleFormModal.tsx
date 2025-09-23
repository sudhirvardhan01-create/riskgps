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
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import SelectStyled from "@/components/SelectStyled";
import TooltipComponent from "@/components/TooltipComponent";
import { ThreatBundleForm } from "@/types/threat";

interface ThreatBundleFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  threats: any[];
  threatBundles: string[];
  formData: ThreatBundleForm;
  setFormData: React.Dispatch<React.SetStateAction<ThreatBundleForm>>;
  onSubmit: (status: string) => void;
}

const ThreatBundleFormModal: React.FC<ThreatBundleFormModalProps> = ({
  operation,
  open,
  onClose,
  threats,
  threatBundles,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [selectedMITREThreatTechnique, setSelectedMITREThreatTechnique] =
    useState<string | null>(null);

  //Function to handle the Field change
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const addMITREThreatTechnique = () => {
    if (selectedMITREThreatTechnique) {
      setFormData((prev) => ({
        ...prev,
        mitreThreatTechnique: [
          ...(formData.mitreThreatTechnique ?? []),
          {
            mitreTechniqueId: selectedMITREThreatTechnique.split(", ")[0],
            mitreTechniqueName: selectedMITREThreatTechnique.split(", ")[1],
          },
        ],
      }));
    }
    setSelectedMITREThreatTechnique(null);
  };

  const deleteMITREThreatTechnique = (id: number) => {
    const updatedMITREThreatTechniques = formData.mitreThreatTechnique.filter(
      (_, i) => i !== id
    );
    setFormData((prev) => ({
      ...prev,
      mitreThreatTechnique: updatedMITREThreatTechniques,
    }));
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
          {operation === "create" ? "Add Threat Bundle" : `Edit Threat Bundle`}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={4}>
          {/* Threat Bundle */}
          <Grid mt={1} size={{ xs: 12 }}>
            <SelectStyled
              required
              value={formData.threatBundleName}
              label={labels.threatBundleName}
              isTooltipRequired={true}
              tooltipTitle={tooltips.threatBundleName}
              displayEmpty
              onChange={(e) =>
                handleFieldChange("threatBundleName", e.target.value)
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
                      {`Select ${labels.threatBundleName}`}
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
              {threatBundles.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </SelectStyled>
          </Grid>

          {/* RELATED THREATS SECTION */}
          <Grid mt={1} size={{ xs: 12 }}>
            <Stack display={"flex"} flexDirection={"column"} gap={2}>
              <Typography variant="h6" fontWeight={600}>
                Mapping with MITRE Threat Techniques
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
                    options={threats.map(
                      (threat) =>
                        `${threat.mitreTechniqueId}, ${threat.mitreTechniqueName}`
                    )}
                    value={selectedMITREThreatTechnique}
                    onChange={(event: any, newValue: string | null) => {
                      setSelectedMITREThreatTechnique(newValue);
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
                              {labels.mitreThreatTechnique}
                            </Typography>
                            <Typography
                              color="#FB2020"
                              variant="body1"
                              fontWeight={600}
                            >
                              *
                            </Typography>
                            <TooltipComponent
                              title={tooltips.mitreThreatTechnique}
                            />
                          </Box>
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Button
                    variant="contained"
                    onClick={addMITREThreatTechnique}
                    disabled={
                      !selectedMITREThreatTechnique ||
                      formData.mitreThreatTechnique.find(
                        (item) =>
                          item.mitreTechniqueId ===
                          selectedMITREThreatTechnique.split(", ")[0]
                      )
                        ? true
                        : false
                    }
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
              {formData?.mitreThreatTechnique &&
                formData?.mitreThreatTechnique?.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>MITRE Technique ID</TableCell>
                              <TableCell>MITRE Technique Name</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.mitreThreatTechnique?.map(
                              (item, index) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={index}
                                  >
                                    <TableCell>
                                      {item.mitreTechniqueId}
                                    </TableCell>
                                    <TableCell>
                                      {item.mitreTechniqueName}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        onClick={() =>
                                          deleteMITREThreatTechnique(index)
                                        }
                                      >
                                        <DeleteOutlineOutlined
                                          sx={{ color: "#cd0303" }}
                                        />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
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
              formData.threatBundleName === "" ||
              formData.mitreThreatTechnique?.length === 0
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

export default ThreatBundleFormModal;
