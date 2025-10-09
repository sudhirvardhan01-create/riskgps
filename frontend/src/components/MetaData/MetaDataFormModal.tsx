import React, { useState } from "react";
import { MetaData } from "@/types/meta-data";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
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
import TextFieldStyled from "../TextFieldStyled";
import { labels } from "@/utils/labels";
import { tooltips } from "@/utils/tooltips";
import SelectStyled from "../SelectStyled";

export const appliesToOptions = [
  { value: "all", label: "All" },
  { value: "process", label: "Process" },
  { value: "risk_scenario", label: "Risk Scenario" },
  { value: "asset", label: "Asset" },
  { value: "threat", label: "Threat" },
  { value: "control", label: "Control" },
];

interface MetaDataFormModalProps {
  operation: "create" | "edit";
  open: boolean;
  onClose: () => void;
  formData: MetaData;
  setFormData: React.Dispatch<React.SetStateAction<MetaData>>;
  onSubmit: () => void;
}

const MetaDataFormModal: React.FC<MetaDataFormModalProps> = ({
  operation,
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState("");

  //Function to handle the Field change
  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      if (field === "name") {
        return {
          ...prev,
          name: value,
          label: value, // always sync label with name
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  //Function to handle the addition of chip
  const handleAddChip = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!formData.supported_values.includes(inputValue.trim())) {
        setFormData((prev) => ({
          ...prev,
          supported_values: [...prev.supported_values, inputValue.trim()],
        }));
        setInputValue("");
      }
    }
  };

  //Function to handle the deletion of chip
  const handleRemoveChip = (chipToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      supported_values: prev.supported_values.filter(
        (val) => val !== chipToDelete
      ),
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
          {operation === "create" ? "Add Configuration" : "Edit Configuration"}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "0px !important" }}>
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ marginTop: 2 }}>
        <Grid container spacing={5}>
          {/* Key */}
          <Grid mt={1} size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.key}
              isTooltipRequired={true}
              tooltipTitle={tooltips.key}
              placeholder="Enter key name"
              value={formData.name}
              required
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </Grid>

          {/* Value field */}
          <Grid size={{ xs: 12 }}>
            <TextFieldStyled
              label={labels.metadataValue}
              isTooltipRequired={true}
              tooltipTitle={tooltips.metadataValue}
              placeholder="Enter value and return to add"
              value={inputValue}
              required
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddChip}
            />
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              sx={{ marginTop: formData.supported_values?.length > 0 ? 2 : 0 }}
            >
              {formData.supported_values.map((val, idx) => (
                <Chip
                  key={idx}
                  label={val}
                  onDelete={() => handleRemoveChip(val)}
                  deleteIcon={
                    <Close
                      fontSize="small"
                      sx={{ height: "16px", width: "16px" }}
                    />
                  }
                  sx={{
                    borderRadius: "2px",
                    border: "0.5px solid #04139A",
                    color: "tet.primary",
                    fontSize: "14px",
                    backgroundColor: "#EDF3FCA3",
                    "& .MuiChip-deleteIcon": {
                      color: "#04139A",
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* Input Type */}
          <Grid size={{ xs: 6 }}>
            <SelectStyled
              value={formData.input_type}
              label={labels.inputType}
              isTooltipRequired={true}
              tooltipTitle={tooltips.inputType}
              displayEmpty
              onChange={(e) => handleFieldChange("input_type", e.target.value)}
              renderValue={(selected: any) => {
                if (!selected) {
                  return (
                    <Typography variant="body1" sx={{ color: "#9E9FA5" }}>
                      Select Input Type
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="multiselect">Multiselect</MenuItem>
              <MenuItem value="number">Number</MenuItem>
            </SelectStyled>
          </Grid>

          {/* Applies To */}
          <Grid size={{ xs: 6 }}>
            <SelectStyled
              sx={{ height: "52px" }}
              value={formData.applies_to}
              label={labels.appliesTo}
              isTooltipRequired={true}
              tooltipTitle={tooltips.appliesTo}
              multiple
              displayEmpty
              onChange={(e) => {
                const selectedValues = e.target.value as string[];

                let newValue: string[];

                if (
                  selectedValues.includes("all") ||
                  (!selectedValues.includes("all") &&
                    selectedValues.length === appliesToOptions.length - 1)
                ) {
                  newValue = ["all"];
                }
                // If anything else is selected (excluding all)
                else {
                  newValue = selectedValues.filter((v) => v !== "all");
                }
                handleFieldChange("applies_to", newValue);
              }}
              renderValue={(selected) => (
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  {(selected as string[])
                    .map(
                      (val) =>
                        appliesToOptions.find((option) => option.value === val)
                          ?.label || val
                    )
                    .join(", ")}
                </Typography>
              )}
            >
              {appliesToOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={
                    option.value !== "all" &&
                    formData.applies_to?.includes("all")
                  }
                >
                  {option.label}
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
            disabled = {formData.name === "" || formData.supported_values?.length === 0}
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

export default MetaDataFormModal;
