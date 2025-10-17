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
  Autocomplete,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Close,
  DeleteOutlineOutlined,
  DoneOutlined,
} from "@mui/icons-material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { tooltips } from "@/utils/tooltips";
import { labels } from "@/utils/labels";
import TooltipComponent from "@/components/TooltipComponent";
import { QuestionnaireData } from "@/types/questionnaire";

interface QuestionnaireFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  assetCategories: string[];
  controls: any[];
  formData: QuestionnaireData;
  setFormData: React.Dispatch<React.SetStateAction<QuestionnaireData>>;
  onSubmit: (status: string) => void;
}

const QuestionnaireFormModal: React.FC<QuestionnaireFormModalProps> = ({
  operation,
  open,
  onClose,
  assetCategories,
  controls,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [selectedMITREControlID, setSelectedMITREControlID] = useState<
    string | null
  >(null);

  const handleChange = useCallback(
    (field: keyof QuestionnaireData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData] // only depends on setter from props
  );

  const addMITREControlID = () => {
    if (selectedMITREControlID) {
      setFormData((prev) => ({
        ...prev,
        mitreControlId: [
          ...(formData.mitreControlId ?? []),
          selectedMITREControlID,
        ],
      }));
    }
    setSelectedMITREControlID(null);
  };

  const deleteMITREControlID = (id: number) => {
    const updatedMITREControls = formData.mitreControlId.filter(
      (_, i) => i !== id
    );
    setFormData((prev) => ({ ...prev, mitreControlId: updatedMITREControls }));
  };

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
                ? "Add Question"
                : `Edit Question ${formData.questionCode}`}
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
          {/* Asset Category */}
          <Grid mt={1} size={{ xs: 12 }}>
            <SelectStyled /// this is select
              required
              multiple
              isTooltipRequired={true}
              tooltipTitle={tooltips.questionnaireAssetCategory}
              value={formData.assetCategories}
              label={labels.questionnaireAssetCategory}
              displayEmpty
              onChange={(e) =>
                handleChange("assetCategories", e.target.value as string[])
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
                      {tooltips.questionnaireAssetCategory}
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
              {assetCategories.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </SelectStyled>
          </Grid>

          {/* Question */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.questionText}
              isTooltipRequired={true}
              tooltipTitle={tooltips.questionText}
              placeholder="Enter Question"
              value={formData.question}
              multiline
              minRows={1}
              onChange={(e) => handleChange("question", e.target.value)}
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
                    options={controls}
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
                            <Typography
                              color="#FB2020"
                              variant="body1"
                              fontWeight={600}
                            >
                              *
                            </Typography>
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
                    disabled={
                      !selectedMITREControlID ||
                      formData.mitreControlId.find(
                        (item) => item === selectedMITREControlID
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
              {formData?.mitreControlId &&
                formData?.mitreControlId?.length > 0 && (
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
                            {formData.mitreControlId?.map((control, index) => {
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
              formData.assetCategory?.length === 0 ||
              formData.question === "" ||
              formData.mitreControlId?.length === 0
            }
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

export default QuestionnaireFormModal;
