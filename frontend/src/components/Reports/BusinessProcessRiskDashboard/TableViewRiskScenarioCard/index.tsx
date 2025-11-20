import { Box, Grid, Typography } from "@mui/material";

interface TableViewRiskScenarioCardProps {
  riskScenario: string;
  ciaMapping: string;
  riskExposure: string;
  riskExposureLevel?: string;
  netExposure: string;
  netExposureLevel?: string;
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
      <Grid container spacing={2}>
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
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {riskExposure}
          </Typography>
        </Grid>
        <Grid size={1.5}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {riskExposureLevel ? riskExposureLevel : "-"}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {netExposure}
          </Typography>
        </Grid>
        <Grid size={1.5}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {netExposureLevel ? netExposureLevel : "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableViewRiskScenarioCard;
