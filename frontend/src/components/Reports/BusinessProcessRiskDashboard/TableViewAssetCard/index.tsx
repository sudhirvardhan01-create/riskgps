import { Box, Grid, Typography } from "@mui/material";

interface TableViewAssetCardProps {
  assetName: string;
  controlStrength: number;
  targetStrength: number;
  riskExposure?: string;
  netExposure?: string;
}

const TableViewAssetCard: React.FC<TableViewAssetCardProps> = ({
  assetName,
  controlStrength,
  targetStrength,
  riskExposure,
  netExposure,
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
            {assetName}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {controlStrength}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {targetStrength}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {riskExposure ? riskExposure : "-"}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {netExposure ? netExposure : "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableViewAssetCard;
