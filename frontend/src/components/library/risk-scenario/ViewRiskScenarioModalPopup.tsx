import { EditNotificationsSharp } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ToggleSwitch from "../toggle-switch/ToggleSwitch";
import { RiskScenarioData } from "@/types/risk-scenario";

interface ViewRiskScenarioModalProps {
  open: boolean;
  riskScenarioData: RiskScenarioData;
  onClose: () => void;
}
const ViewRiskScenarioModal: React.FC<ViewRiskScenarioModalProps> = ({
  open,
  riskScenarioData,
  onClose,
}: ViewRiskScenarioModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Typography variant="h6">Risk Scenario ID#12123456789</Typography>
            <ToggleSwitch />
            <Typography
              sx={{ color: "#147A50", fontWeight: 600 }}
              variant="body2"
            >
              Enabled
            </Typography>
          </Box>

          <Box>
            <IconButton>
              <EditNotificationsSharp />
            </IconButton>
            <IconButton>
              <EditNotificationsSharp />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      {/* <Divider sx={{mx: 2?., m  .}}/> */}
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Risk Scenario
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskScenario}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Risk Statement
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskStatement}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Risk Description
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskDescription}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Risk Field 1
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskField1? riskScenarioData.riskField1 : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Risk Field 2
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskField2? riskScenarioData.riskField2 : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Domain
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                NIST, GDPR
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                Process 1, Process 2, Process 3
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }}></Divider>
        <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "rgba(231, 231, 232, 0.4)", padding: 1 }}
        >
          <Grid size={{xs: 3 }} ml={3}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Created By
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                Person Name
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Created On
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                2 Jan 2024
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">
                Last Updated On
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                8 Jan 2024
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRiskScenarioModal;
