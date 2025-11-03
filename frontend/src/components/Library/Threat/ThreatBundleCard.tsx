import { Box, Card, IconButton, Typography } from "@mui/material";
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
        boxShadow: "0px 4px 4px 0px #D9D9D966",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        border: "1px solid #E4E4E4",
      }}
    >
      <Box
        sx={{ backgroundColor: "#F3F8FF", width: "100%", py: 1, px: 3 }}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {mitreTechniqueId}
        </Typography>
        <IconButton
          onClick={onDelete}
          aria-label="delete"
          sx={{ color: "#CD0303" }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Box>
      <Typography
        variant="body1"
        fontWeight={550}
        color="text.primary"
        py={2}
        px={3}
      >
        {mitreTechniqueName}
      </Typography>
    </Card>
  );
};

export default ThreatBundleCard;
