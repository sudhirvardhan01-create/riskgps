import React, { useState } from "react";
import { MetaData } from "@/types/meta-data";
import { Close } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

interface MetaDataFormModalProps {
    operation: 'create' | 'edit';
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
    onSubmit
}) => {

    const [inputValue, setInputValue] = useState("");
    const appliesToOptions = [
        { value: "all", label: "All" },
        { value: "process", label: "Process" },
        { value: "risk_scenario", label: "Risk Scenario" },
        { value: "asset", label: "Asset" },
        { value: "threat", label: "Threat" },
        { value: "control", label: "Control" },
    ];


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
            supported_values: prev.supported_values.filter((val) => val !== chipToDelete),
        }));
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{
            paper: {
                sx: { borderRadius: 2, paddingTop: "16px", paddingX: "12px" }
            }
        }}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5" fontWeight={550}>
                    {operation === "create" ? "Add Configuration" : "Edit Configuration"}
                </Typography>
                <IconButton onClick={onClose} sx={{ padding: "0px !important", }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    {/* Key */}
                    <Grid mt={1} size={{ xs: 12 }}>
                        <TextField
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                            label="Key"
                            placeholder="Enter key name"
                            value={formData.name}
                            required
                            variant="outlined"
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
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
                                        fontSize: "14px",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#000000",
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    },
                                    "&.MuiInputLabel-shrink": {
                                        transform: "translate(14px, -9px) scale(0.75)",
                                    },
                                },
                            }}
                        />
                    </Grid>

                    {/* Value field */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                            label="Add a value"
                            placeholder="Enter value and return to add"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleAddChip}
                            required
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
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
                                        fontSize: "14px",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#000000",
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    },
                                    "&.MuiInputLabel-shrink": {
                                        transform: "translate(14px, -9px) scale(0.75)",
                                    },
                                },
                            }}
                        />
                        <Box display="flex" flexWrap="wrap" gap={1} sx={{ marginTop: formData.supported_values?.length > 0 ? 1 : 0 }}>
                            {formData.supported_values.map((val, idx) => (
                                <Chip
                                    key={idx}
                                    label={val}
                                    onDelete={() => handleRemoveChip(val)}
                                    deleteIcon={<Close fontSize="small" />}
                                    sx={{
                                        borderRadius: "2px",
                                        border: "0.5px solid #04139A",
                                        color: "tet.primary",
                                        fontSize: '14px',
                                        backgroundColor: '#EDF3FCA3',
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
                        <FormControl fullWidth>
                            <InputLabel
                                shrink
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#000000",
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    },
                                    "&.MuiInputLabel-shrink": {
                                        transform: "translate(14px, -9px) scale(0.75)",
                                    },
                                }}
                            >
                                Input Type
                            </InputLabel>
                            <Select
                                value={formData.input_type}
                                label="Input Type"
                                displayEmpty
                                onChange={(e) =>
                                    handleFieldChange(
                                        "input_type",
                                        e.target.value
                                    )
                                }
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return (
                                            <span style={{ color: "#9e9e9e" }}>Select Input Type</span>
                                        );
                                    } else {
                                        return (
                                            <Typography variant="body2" sx={{ color: "text.primary", textTransform: "capitalize", fontSize: "14px" }}>
                                                {selected}
                                            </Typography>
                                        )
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    fontSize: "14px",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1px",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1.5px",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1.5px",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "14px 16px",
                                        fontSize: "14px",
                                    },
                                }}
                            >
                                <MenuItem value="text">Text</MenuItem>
                                <MenuItem value="select">Select</MenuItem>
                                <MenuItem value="multiselect">Multiselect</MenuItem>
                                <MenuItem value="number">Number</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Applies To */}
                    <Grid size={{ xs: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel
                                shrink
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#000000",
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    },
                                    "&.MuiInputLabel-shrink": {
                                        transform: "translate(14px, -9px) scale(0.75)",
                                    },
                                }}
                            >
                                Applies To
                            </InputLabel>
                            <Select
                                value={formData.applies_to}
                                label="Applies To"
                                multiple
                                displayEmpty
                                onChange={(e) => {
                                    const selectedValues = e.target.value as string[];

                                    let newValue: string[];

                                    // If "all" is selected alone
                                    if (selectedValues.includes("all") && selectedValues.length === 1) {
                                        newValue = ["all"];
                                    }
                                    // If "all" is selected among others, only keep "all"
                                    else if (selectedValues.includes("all")) {
                                        newValue = ["all"];
                                    }
                                    // If anything else is selected (excluding all)
                                    else {
                                        newValue = selectedValues.filter((v) => v !== "all");
                                    }

                                    handleFieldChange("applies_to", newValue);
                                }}
                                renderValue={(selected) =>
                                    (selected as string[])
                                        .map(
                                            (val) =>
                                                appliesToOptions.find((option) => option.value === val)?.label || val
                                        )
                                        .join(", ")
                                }
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    fontSize: "14px",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1px",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1.5px",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#cecfd2",
                                        borderWidth: "1.5px",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "14px 16px",
                                        fontSize: "14px",
                                    },
                                }}
                            >
                                {appliesToOptions.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={
                                            option.value !== "all" && formData.applies_to?.includes("all")
                                        }
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Divider sx={{ width: "90%" }} />
            </Box>
            <DialogActions
                sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end" }}
            >
                <Box>
                    <Button
                        onClick={onClose}
                        sx={{ width: 110, height: 40, borderRadius: 1, margin: 1 }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ width: 110, height: 40, borderRadius: 1, margin: 1, marginRight: 0 }}
                        variant="contained"
                        onClick={onSubmit}
                    >
                        {operation === "create" ? "Add" : "Save"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default MetaDataFormModal;