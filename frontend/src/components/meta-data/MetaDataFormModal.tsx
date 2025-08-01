import React from "react";
import { MetaData } from "@/types/meta-data";
import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

interface MetaDataFormModalProps {
    operation: 'create' | 'edit';
    open: boolean;
    onClose: () => void;
    metaData: MetaData;
    onSubmit: () => void;
}

const MetaDataFormModal: React.FC<MetaDataFormModalProps> = ({
    operation,
    open,
    onClose,
    metaData,
    onSubmit
}) => {

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
                <IconButton onClick={onClose} sx={{paddingRight: "0px !important"}}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    {/* Existing form fields */}
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
                            value={metaData.name}
                            required
                            variant="outlined"
                            //onChange={(e) => handleChange("riskScenario", e.target.value)}
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

                    {/* Risk Statement field */}
                    <Grid mt={1} size={{ xs: 12 }}>
                        <TextField
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                            label="Add a value"
                            placeholder="Enter value and return to add"
                            value={metaData.supported_values}
                            //onChange={(e) => handleChange("riskStatement", e.target.value)}
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
                    </Grid>

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
                                value={metaData.input_type}
                                label="Input Type"
                                displayEmpty
                                // onChange={(e) =>
                                //     handleKeyValueChange(
                                //         index,
                                //         "meta_data_key_id",
                                //         e.target.value as number
                                //     )
                                // }
                                // renderValue={(selected) => {
                                //     if (!selected || selected < 0) {
                                //         return (
                                //             <span style={{ color: "#9e9e9e" }}>Select Key</span>
                                //         );
                                //     } else {
                                //         const label = metaDatas.find((m) => m.id === selected)?.label;
                                //         return (label ?? (
                                //             <span style={{ color: "#9e9e9e" }}>
                                //                 Select Key
                                //             </span>
                                //         )
                                //         );
                                //     }
                                // }}
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
                                    <MenuItem>text</MenuItem>
                                    <MenuItem>select</MenuItem>
                                    <MenuItem>multiselect</MenuItem>
                                    <MenuItem>number</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
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
                                value={metaData.applies_to}
                                label="Applies To"
                                displayEmpty
                                // onChange={(e) =>
                                //     handleKeyValueChange(
                                //         index,
                                //         "values",
                                //         e.target.value as string[]
                                //     )
                                // }
                                renderValue={(selected) => {
                                  if (!selected || selected.length < 0) {
                                        return (
                                            <span style={{ color: "#9e9e9e" }}>
                                                Enter Value
                                            </span>
                                        );
                                    }
                                    return selected;
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
                                {/* {selectedMeta?.supported_values?.map((val: string | number, i: number) => (
                                    <MenuItem key={i} value={val}>
                                        {val}
                                    </MenuItem>
                                ))} */}
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
                        // onClick={() => {
                        //     onSubmit("draft");
                        // }}
                        sx={{ width: 110, height: 40, borderRadius: 1, margin: 1 }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ width: 110, height: 40, borderRadius: 1, margin: 1, marginRight: 0 }}
                        variant="contained"
                    // onClick={() => {
                    //     onSubmit("published");
                    // }}
                    >
                        Add
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default MetaDataFormModal;