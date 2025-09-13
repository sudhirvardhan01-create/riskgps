"use client";

import React, { useEffect, useState } from "react";
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
import { getOrganization } from "@/pages/api/organization";
import { saveAssessment } from "@/pages/api/assessment";

interface Organisation {
  organizationId: string;
  name: string;
  desc: string;
  businessUnits: BusinessUnit[];
}

interface BusinessUnit {
  orgBusinessUnitId: string;
  businessUnitName: string;
  businessUnitDesc: string;
}

interface StartAssessmentModalProps {
  open: boolean;
  onClose: () => void;
}

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
    setSelectedBU
  } = useAssessment();

  const router = useRouter();

  const [orgSearch, setOrgSearch] = useState("");
  const [buSearch, setBuSearch] = useState("");

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await getOrganization();
        setOrganisations(res.data.organizations);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  // Update businessUnits whenever selectedOrg changes
  useEffect(() => {
    if (!selectedOrg) {
      setBusinessUnits([]);
      return;
    }

    const org = organisations.find(
      (o) => o.organizationId === selectedOrg
    );
    setBusinessUnits(org?.businessUnits || []);
  }, [selectedOrg, organisations]);

  const handleSubmit = () => {
    if (selectedOrg && selectedBU) {

      const selectedOrganization = organisations.find(item => item.organizationId === selectedOrg)
      const selectedBussinessUnit = selectedOrganization?.businessUnits.find(item => item.orgBusinessUnitId === selectedBU)

      saveAssessment({
        assessmentName: assessmentName,
        assessmentDesc: assessmentDescription,
        orgId: selectedOrganization.organizationId,
        orgName: selectedOrganization.name,
        orgDesc: selectedOrganization.desc,
        businessUnitId: selectedBussinessUnit.orgBusinessUnitId,
        businessUnitName: selectedBussinessUnit.businessUnitName,
        businessUnitDesc: selectedBussinessUnit.businessUnitDesc,
        runId: "1004",
        userId: "2"
      })
      router.push("/assessment/assessmentProcess");
      onClose();
    }
  };

  const filteredOrgs = organisations.filter((o) =>
    o.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const filteredBUs = businessUnits.filter((bu) =>
    bu.businessUnitName.toLowerCase().includes(buSearch.toLowerCase())
  );

  return (
    <>
      {loading && <MenuItem disabled>Loading...</MenuItem>}

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
                <InputLabel id="org-label"><Typography variant="body1" color="#121212">
                  Organisations
                </Typography></InputLabel>
                <Select
                  labelId="org-label"
                  label={
                    <Typography variant="body1" color="#121212">
                      Organisations
                    </Typography>
                  }
                  value={selectedOrg}
                  onChange={(e) => {
                    setSelectedOrg(e.target.value);
                    setSelectedBU("");
                  }}
                  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                  renderValue={(val) => {
                    if (!val) return "Select Organisation";
                    return organisations.find((o) => o.organizationId === val)?.name || "";
                  }}
                  required
                >
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
                    <MenuItem key={org.organizationId} value={org.organizationId}>
                      <Radio checked={selectedOrg === org.organizationId} />
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ height: "100%" }}>
              {/* Business Unit Dropdown */}
              <FormControl fullWidth size="medium" disabled={!selectedOrg}>
                <InputLabel id="bu-label"><Typography variant="body1" color="#121212">
                  Business Unit
                </Typography></InputLabel>
                <Select
                  labelId="bu-label"
                  label={
                    <Typography variant="body1" color="#121212">
                      Business Unit
                    </Typography>
                  }
                  value={selectedBU}
                  onChange={(e) => setSelectedBU(e.target.value)}
                  sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                  renderValue={(val) => {
                    if (!val) return "Select Business Unit";
                    return businessUnits.find((b) => b.orgBusinessUnitId === val)?.businessUnitName || "";
                  }}
                  required
                >
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
                    <MenuItem key={bu.orgBusinessUnitId} value={bu.orgBusinessUnitId}>
                      <Radio checked={selectedBU === bu.orgBusinessUnitId} />
                      {bu.businessUnitName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 1 }}
          >
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
    </>
  );
};

export default AssessmentModal;
