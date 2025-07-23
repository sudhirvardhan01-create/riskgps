import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#DDF5EB",
        border: "1px solid #147A50",
        borderRadius: 2,
        px: 4,
        py: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: {xs: "80%", sm: "575px"},
        boxShadow: '0px 4px 16px 0px #E4E4E7',
      }}
    >
      <CheckCircleOutlineIcon sx={{ color: "#147A50", fontSize: 24 }} />

      <Typography variant="body1" sx={{ fontWeight: 500, color: "#147A50", flexGrow: 1 }}>
        {message}
      </Typography>

      {/* <Divider orientation="vertical" flexItem sx={{ borderColor: 'black'}} />

      <Typography
        onClick={onUndo}
        sx={{
          cursor: "pointer",
          fontWeight: 600,
          color: "primary.main",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Undo
      </Typography> */}
    </Box>
  );
};

export default SuccessToast;
