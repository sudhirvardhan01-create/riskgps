import { Card, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface ThreatBundleCardProps {
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  onDelete: () => void;
}

const ThreatBundleCard: React.FC<ThreatBundleCardProps> = ({
  mitreTechniqueId,
  mitreTechniqueName,
  onDelete,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 3,
        py: 2,
        boxShadow: "0px 4px 4px 0px #D9D9D966",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexShrink: 0,
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        border: "1px solid #E4E4E4",
      }}
    >
      {/* Key */}
      <Stack spacing={0.5} flex={1}>
        <Typography variant="body2" color="#91939A" fontWeight={550}>
          MITRE Technique ID
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {mitreTechniqueId}
        </Typography>
      </Stack>

      {/* Values */}
      <Stack spacing={0.5} flex={2}>
        <Typography variant="body2" color="#91939A" fontWeight={550}>
          MITRE Technique Name
        </Typography>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {mitreTechniqueName}
        </Typography>
      </Stack>

      {/* Actions */}
      <IconButton
        onClick={onDelete}
        aria-label="delete"
        sx={{ color: "#CD0303" }}
      >
        <DeleteOutlineOutlinedIcon />
      </IconButton>
    </Card>
  );
};

export default ThreatBundleCard;
