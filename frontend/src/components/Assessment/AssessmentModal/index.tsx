"use client";

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Autocomplete,
    Box,
    Grid,
    Radio,
    AutocompleteRenderInputParams,
    Paper,
    Select,
    ListSubheader,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import TextFieldStyled from "../../TextFieldStyled";
import { useAssessment } from "@/context/AssessmentContext";
import { useRouter } from "next/router";

interface Organisation {
    id: string;
    name: string;
}

interface BusinessUnit {
    id: string;
    name: string;
    orgId: string;
}

interface StartAssessmentModalProps {
    open: boolean;
    onClose: () => void;
}

const organisations: Organisation[] = [
    { id: "org1", name: "Blue Ocean" },
    { id: "org2", name: "Deloitte" }
];

const businessUnits: BusinessUnit[] = [
    { id: "bu1", name: "Retail Banking", orgId: "org1" },
    { id: "bu2", name: "Loan Services", orgId: "org1" },
    { id: "bu3", name: "IT", orgId: "org2" },
    { id: "bu4", name: "Marketing", orgId: "org2" },
];

const AssessmentModal: React.FC<StartAssessmentModalProps> = ({
    open,
    onClose,
}) => {
    const {
        assessmentName,
        setAssessmentName,
        assessmentDescription,
        setAssessmentDescription,
        selectedOrg,
        setSelectedOrg,
        selectedBU,
        setSelectedBU,
        submitAssessment
    } = useAssessment();

    const router = useRouter()

    const [orgSearch, setOrgSearch] = useState("");
    const [buSearch, setBuSearch] = useState("");

    const handleSubmit = () => {
        if (selectedOrg && selectedBU) {
            // submitAssessment();
            router.push("/assessment/assessmentProcess")
            onClose();
        }
    };

    const filteredOrgs = organisations.filter((o) =>
        o.name.toLowerCase().includes(orgSearch.toLowerCase())
    );

    const filteredBUs = businessUnits
        .filter((bu) => bu.orgId === selectedOrg)
        .filter((bu) => bu.name.toLowerCase().includes(buSearch.toLowerCase()));


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ p: 4, pb: 5 }}>
                <Typography variant="h5" fontWeight="550" sx={{ mb: 3 }}>
                    Start Assessment
                </Typography>
                <Box sx={{ borderBottom: "1px solid #D9D9D9" }} />
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Typography variant="body1" fontWeight={550} sx={{ mb: 5 }}>
                    Select Organisation and Business Unit
                </Typography>

                <TextFieldStyled
                    label="Assessment Name"
                    required
                    size="small"
                    sx={{ mb: 4 }}
                    value={assessmentName}
                    onChange={(e) => setAssessmentName(e.target.value)}
                />
                <TextFieldStyled
                    label="Assessment Description"
                    size="small"
                    sx={{ mb: 4 }}
                    value={assessmentDescription}
                    onChange={(e) => setAssessmentDescription(e.target.value)}
                />

                <Grid container spacing={4} sx={{ height: "100%", display: "flex", alignItems: "baseline" }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ height: "100%" }}>
                        {/* Organisation Dropdown */}
                        <FormControl fullWidth size="medium">
                            <InputLabel id="org-label"><Typography variant="body1" color="#121212">Organisations</Typography></InputLabel>
                            <Select
                                labelId="org-label"
                                label={<Typography variant="body1" color="#121212">Organisations</Typography>}
                                value={selectedOrg}
                                onChange={(e) => {
                                    setSelectedOrg(e.target.value);
                                    setSelectedBU("");
                                }}
                                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                                renderValue={(val) => {
                                    if (!val) return "Select Organisation";
                                    return organisations.find((o) => o.id === val)?.name || "";
                                }}
                                required
                            >
                                {/* Search bar pinned at top */}
                                <ListSubheader>
                                    <TextField
                                        size="small"
                                        placeholder="Search Organisation"
                                        value={orgSearch}
                                        onChange={(e) => setOrgSearch(e.target.value)}
                                        fullWidth
                                    />
                                </ListSubheader>

                                {filteredOrgs.map((org) => (
                                    <MenuItem key={org.id} value={org.id}>
                                        <Radio checked={selectedOrg === org.id} />
                                        {org.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ height: "100%" }}>
                        {/* Business Unit Dropdown */}
                        <FormControl fullWidth size="medium" disabled={!selectedOrg}>
                            <InputLabel id="bu-label"><Typography variant="body1" color="#121212">Business Unit</Typography></InputLabel>
                            <Select
                                labelId="bu-label"
                                label={<Typography variant="body1" color="#121212">Business Unit</Typography>}
                                value={selectedBU}
                                onChange={(e) => setSelectedBU(e.target.value)}
                                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                                renderValue={(val) => {
                                    if (!val) return "Select Business Unit";
                                    return businessUnits.find((b) => b.id === val)?.name || "";
                                }}
                                required
                            >
                                {/* Search bar pinned at top */}
                                <ListSubheader>
                                    <TextField
                                        size="small"
                                        placeholder="Search Business Unit"
                                        value={buSearch}
                                        onChange={(e) => setBuSearch(e.target.value)}
                                        fullWidth
                                    />
                                </ListSubheader>

                                {filteredBUs.map((bu) => (
                                    <MenuItem key={bu.id} value={bu.id}>
                                        <Radio checked={selectedBU === bu.id} />
                                        {bu.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 1 }}>
                <Button onClick={onClose} variant="outlined" color="error" sx={{ borderRadius: 1 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!selectedOrg || !selectedBU || !assessmentName}
                    sx={{ borderRadius: 1 }}
                >
                    Start Assessment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssessmentModal;
