import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BottomActionBarProps {
  onPrev?: () => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onSaveContinue?: () => void;
}

export default function BottomActionBar({
  onPrev,
  onCancel,
  onSaveDraft,
  onSaveContinue,
}: BottomActionBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderTop: "1px solid #E0E0E0",
        bgcolor: "#fff",
        position: "sticky",
        bottom: 0,
      }}
    >
      {/* Left Side - Prev */}
      <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }} onClick={onPrev}>
        <ArrowBackIcon sx={{ color: "#9E9FA5", fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: "#9E9FA5", fontWeight: 500 }}>
          Prev
        </Typography>
      </Box>

      {/* Right Side - Actions */}
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          onClick={onCancel}
          sx={{ color: "#dc004e", textTransform: "none", fontWeight: 500 }}
        >
          Cancel
        </Button>

        <Button
          variant="outlined"
          onClick={onSaveDraft}
          sx={{
            borderColor: "#04139A",
            color: "#04139A",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "4px",
          }}
        >
          Save as Draft
        </Button>

        <Button
          variant="contained"
          onClick={onSaveContinue}
          sx={{
            bgcolor: "#04139A",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "4px",
            "&:hover": { bgcolor: "#02106f" },
          }}
        >
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
}
