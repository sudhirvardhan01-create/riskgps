import { Box, Grid, Typography } from "@mui/material";
import SeverityScale from "../../SeverityScale";

interface TableViewRiskScenarioCardProps {
  riskScenario: string;
  ciaMapping: string;
  riskExposure: string;
  riskExposureLevel?: "very low" | "low" | "moderate" | "high" | "critical";
  netExposure: string;
  netExposureLevel?: "very low" | "low" | "moderate" | "high" | "critical";
}

const TableViewRiskScenarioCard: React.FC<TableViewRiskScenarioCardProps> = ({
  riskScenario,
  ciaMapping,
  riskExposure,
  riskExposureLevel,
  netExposure,
  netExposureLevel,
}) => {
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: "1px solid #E7E7E8ff",
        p: 1.5,
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid size={4}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {riskScenario}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {ciaMapping}
          </Typography>
        </Grid>
        <Grid size={1.5}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {riskExposure}
          </Typography>
        </Grid>
        <Grid size={1.5}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {netExposure}
          </Typography>
        </Grid>
        <Grid size={2}>
          {riskExposureLevel ? (
            <SeverityScale severity={riskExposureLevel} height={8} />
          ) : (
            "-"
          )}
        </Grid>
        <Grid size={2}>
          {netExposureLevel ? (
            <SeverityScale severity={netExposureLevel} height={8} />
          ) : (
            "-"
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableViewRiskScenarioCard;
