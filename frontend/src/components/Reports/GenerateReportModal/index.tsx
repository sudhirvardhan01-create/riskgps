"use client";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Switch,
  IconButton,
  Divider,
  Link,
  SelectChangeEvent,
  ListSubheader,
  TextField,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Assessment, BusinessUnit, Organisation } from "@/types/assessment";

export interface BusinessUnitData {
  id: number;
  bu: string;
  ra: string;
}

export interface GenerateReportModalProps {
  open: boolean;
  organisation: string;
  orgLevel: boolean;
  businessUnit: string;
  onClose: () => void;
  onGenerate: () => void;
  onOrganisationChange: (value: string) => void;
  onOrgLevelChange: (value: boolean) => void;
  onBusinessUnitChange: (value: string) => void;
  organisationsList: Organisation[];
  businessUnitsList: BusinessUnit[];
  assessments: Assessment[];
  assessment: string;
  setAssessment: (value: string) => void;
}

export default function GenerateReportModal({
  open,
  organisation,
  businessUnit,
  onClose,
  onGenerate,
  onOrganisationChange,
  onBusinessUnitChange,
  organisationsList,
  businessUnitsList,
  assessments,
  assessment,
  setAssessment,
}: GenerateReportModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1.5 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          pb: 1,
        }}
      >
        Generate Report
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12}>
            {/* Organisation Dropdown */}
            <FormControl fullWidth size="medium" sx={{ mt: 1, mb: 3 }}>
              <InputLabel id="org-label">
                <Typography variant="body1" color="#121212">
                  Organisations
                </Typography>
              </InputLabel>
              <Select
                labelId="org-label"
                label={
                  <Typography variant="body1" color="#121212">
                    Organisations
                  </Typography>
                }
                value={organisation}
                onChange={(e: SelectChangeEvent) =>
                  onOrganisationChange(e.target.value)
                }
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                renderValue={(val) => {
                  if (!val) return "Select Organisation";
                  return (
                    organisationsList.find((o) => o.organizationId === val)
                      ?.name || ""
                  );
                }}
                required
              >
                {organisationsList.map((org) => (
                  <MenuItem key={org.organizationId} value={org.organizationId}>
                    <Radio checked={organisation === org.organizationId} />
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid size={4} display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              Generate report at ORG level
            </Typography>
            <Switch
              checked={orgLevel}
              onChange={(e) => onOrgLevelChange(e.target.checked)}
              color="primary"
            />
          </Grid> */}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={6}>
            <FormControl fullWidth size="medium">
              <InputLabel id="org-label">
                <Typography variant="body1" color="#121212">
                  Business Units
                </Typography>
              </InputLabel>
              <Select
                labelId="bu-label"
                label={
                  <Typography variant="body1" color="#121212">
                    Business Units
                  </Typography>
                }
                value={businessUnit}
                onChange={(e: SelectChangeEvent) =>
                  onBusinessUnitChange(e.target.value)
                }
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                renderValue={(val) => {
                  if (!val) return "Select Organisation";
                  return (
                    businessUnitsList.find((b) => b.orgBusinessUnitId === val)
                      ?.name || ""
                  );
                }}
                required
              >
                {businessUnitsList.map((bu) => (
                  <MenuItem
                    key={bu.orgBusinessUnitId}
                    value={bu.orgBusinessUnitId}
                  >
                    <Radio checked={businessUnit === bu.orgBusinessUnitId} />
                    {bu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth size="medium">
              <InputLabel id="assess-label">
                <Typography variant="body1" color="#121212">
                  Assessments
                </Typography>
              </InputLabel>
              <Select
                labelId="assess-label"
                label={
                  <Typography variant="body1" color="#121212">
                    Assessments
                  </Typography>
                }
                value={assessment}
                onChange={(e: SelectChangeEvent) =>
                  setAssessment(e.target.value)
                }
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                renderValue={(val) => {
                  if (!val) return "Select Organisation";
                  return (
                    assessments.find((a) => a.assessmentId === val)
                      ?.assessmentName || ""
                  );
                }}
                required
              >
                {assessments.map((assess) => (
                  <MenuItem
                    key={assess.assessmentId}
                    value={assess.assessmentId}
                  >
                    <Radio checked={assessment === assess.assessmentId} />
                    {assess.assessmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", pb: 2, pr: 3 }}>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            ml: 2,
          }}
          onClick={onGenerate}
        >
          Generate Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}
