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
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { RiskScenarioData } from "@/types/risk-scenario";

interface ViewRiskScenarioModalProps {
  open: boolean;
  processes: any[];
  metaDatas: any[];
  riskScenarioData: RiskScenarioData;
  setIsEditRiskScenarioOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRiskScenario: React.Dispatch<
    React.SetStateAction<RiskScenarioData | null>
  >;
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
    if (
      riskScenarioData.status === "published" ||
      riskScenarioData.status === "not_published"
    ) {
      return (
        <FormControlLabel
          control={
            <ToggleSwitch
              color="success"
              checked={riskScenarioData.status === "published"}
            />
          }
          label={
            riskScenarioData.status === "published" ? "Enabled" : "Disabled"
          }
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
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, paddingTop: 1 },
        },
      }}
    >
      <DialogTitle>
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
            <Typography variant="h5" color="#121212" fontWeight={550}>
              Risk Scenario {riskScenarioData.risk_code}
            </Typography>
            {getStatusComponent()}
          </Stack>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={3}
          >
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                setSelectedRiskScenario(riskScenarioData);
                setIsEditRiskScenarioOpen(true);
              }}
            >
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              <Close sx={{ color: "primary.main" }} />
            </IconButton>
          </Box>
        </Stack>
        <Divider sx={{ mt: 3, mb: 1 }}></Divider>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Risk Scenario */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Risk Scenario
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData.riskScenario}
              </Typography>
            </Box>
          </Grid>

          {/* Risk Statement */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Risk Statement
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData.riskStatement
                  ? riskScenarioData.riskStatement
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Risk Description */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Risk Description
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData.riskDescription
                  ? riskScenarioData.riskDescription
                  : "-"}
              </Typography>
            </Box>
          </Grid>

          {/* Risk Field 1 */}
          {/* <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Risk Field 1
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData.riskField1
                  ? riskScenarioData.riskField1
                  : "-"}
              </Typography>
            </Box>
          </Grid> */}

          {/* Risk Field 2 */}
          {/* <Grid size={{ xs: 6 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Risk Field 2
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData.riskField2
                  ? riskScenarioData.riskField2
                  : "-"}
              </Typography>
            </Box>
          </Grid> */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Process
              </Typography>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                {riskScenarioData?.related_processes &&
                riskScenarioData?.related_processes?.length > 0
                  ? riskScenarioData?.related_processes
                      ?.map((processId) => {
                        return processes?.find(
                          (process) => process.id === processId
                        )?.processName;
                      })
                      .join(", ")
                  : "-"}
              </Typography>
            </Box>
          </Grid>
          {riskScenarioData?.attributes?.map((item, index) => (
            <Grid key={index} size={{ xs: 6 }}>
              <Box>
                <Typography variant="body2" color="#91939A" fontWeight={550}>
                  {
                    metaDatas?.find(
                      (metaData) => metaData.id === item.meta_data_key_id
                    )?.label
                  }
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  fontWeight={500}
                >
                  {item.values.join(", ")}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={3}
          sx={{
            backgroundColor: "#E7E7E84D",
            p: "9px 16px",
            borderRadius: 1,
            mt: 3,
            mb: 0.5,
          }}
        >
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Created By
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                Person Name
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Created On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                2 Jan 2024
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box display={"flex"} flexDirection={"column"} gap={0.5}>
              <Typography variant="body2" color="#91939A" fontWeight={550}>
                Last Updated On
              </Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
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
