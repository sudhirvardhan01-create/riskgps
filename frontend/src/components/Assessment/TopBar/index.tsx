import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TopBarProps {
  title: string | undefined;
  runId: string | undefined;
  org: string;
  bu: string;
  onBack?: () => void;
}

export default function TopBar({ title, runId, org, bu, onBack }: TopBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {/* First Row: Back Button + Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon sx={{ color: "text.primary" }} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          {title}
        </Typography>
      </Box>

      {/* Second Row: Metadata */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 0.5,
          paddingLeft: "42px",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <strong style={{ color: "#91939A" }}>Run ID:</strong> {runId}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          •
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <strong style={{ color: "#91939A" }}>Org:</strong> {org}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          •
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <strong style={{ color: "#91939A" }}>BU:</strong> {bu}
        </Typography>
      </Box>
    </Box>
  );
}
