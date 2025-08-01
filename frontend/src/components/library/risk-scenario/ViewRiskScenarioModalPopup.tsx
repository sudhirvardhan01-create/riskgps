import { Close, DoneOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ToggleSwitch from "../toggle-switch/ToggleSwitch";
import { RiskScenarioData } from "@/types/risk-scenario";

interface ViewRiskScenarioModalProps {
  open: boolean;
  processes: any[];
  metaDatas: any[];
  riskScenarioData: RiskScenarioData;
  setIsEditRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedRiskScenario: React.Dispatch<React.SetStateAction<RiskScenarioData | null>>;
  onClose: () => void;
}
const ViewRiskScenarioModal: React.FC<ViewRiskScenarioModalProps> = ({
  open,
  processes,
  metaDatas,
  riskScenarioData,
  setIsEditRiskScenarioOpen,
  setSelectedRiskScenario,
  onClose,
}: ViewRiskScenarioModalProps) => {

  const getStatusComponent = () => {
    if (riskScenarioData.status === 'published' || riskScenarioData.status === 'not_published') {
      return <FormControlLabel control={<ToggleSwitch color="success" checked={riskScenarioData.status === 'published'} />} label={riskScenarioData.status === "published" ? "Enabled" : "Disabled"} sx={{ width: 30, height: 18, marginLeft: '0 !important', gap: 1 }} />;
    }
    return (
      <Chip
        icon={<DoneOutlined />}
        label="Draft"
        variant="outlined"
        size="small"
        color="primary"
        sx={{ fontWeight: 500, borderRadius: 1 }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{
      paper: {
        sx: { borderRadius: 2 }
      }
    }}>
      <DialogTitle>
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack display={"flex"} direction="row" justifyContent={"center"} alignItems={"center"} gap={2}>
            <Typography variant="h6" fontWeight={550}>Risk Scenario {riskScenarioData.risk_code}</Typography>
            {getStatusComponent()}
          </Stack>

          <Box display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}>
            <IconButton onClick={() => {
              setSelectedRiskScenario(riskScenarioData);
              setIsEditRiskScenarioOpen(true)
            }}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close sx={{ color: "primary.main" }} />
            </IconButton>
          </Box>
        </Stack>
        <Divider sx={{ mt: 2, mb: 0.5 }}></Divider>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Scenario
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskScenario}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Statement
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskStatement}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Description
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskDescription}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Field 1
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskField1 ? riskScenarioData.riskField1 : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Field 2
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData.riskField2 ? riskScenarioData.riskField2 : "-"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Process
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {riskScenarioData?.related_processes && riskScenarioData?.related_processes?.length > 0 ? riskScenarioData?.related_processes?.map((processId) => {
                  return processes?.find(process => process.id === processId)?.name
                }).join(", ") : "-"}
              </Typography>
            </Box>
          </Grid>
          {riskScenarioData?.attributes?.map((item, index) => (
            <Grid key={index} size={{ xs: 6 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {metaDatas?.find(metaData => metaData.id === item.meta_data_key_id)?.label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {item.values.join(", ")}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "rgba(231, 231, 232, 0.4)", p: '10px 16px', borderRadius: 1, mt: 2 }}
        >
          <Grid size={{ xs: 4 }}>
            <Box>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Created By
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                Person Name
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box mb={2}>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Created On
              </Typography>
              <Typography variant="body2" fontWeight={400}>
                2 Jan 2024
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box mb={2}>
              <Typography variant="caption" color="#9BA1D7" fontWeight={550} fontSize={14}>
                Last Updated On
              </Typography>
              <Typography variant="body2" fontWeight={400}>
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
