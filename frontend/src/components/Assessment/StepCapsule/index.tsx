import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface StepCapsuleProps {
  label: string;
  active?: boolean;
  completed?: boolean;
  isLast?: boolean;
}

export default function StepCapsule({
  label,
  active,
  completed,
  isLast,
}: StepCapsuleProps) {
  const bgColor = active ? "#04139A" : completed ? "#E7E9FB" : "#FFFFFF";
  const textColor = active ? "#FFFFFF" : completed ? "#04139A" : "#91939A";
  const borderColor = active ? "#04139A" : completed ? "#04139A" : "#E7E7E8";

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      pr={2.5}
      pl={4}
      py={1.5}
      sx={{
        bgcolor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        fontWeight: active ? 600 : 400,
        minWidth: 220,
        minHeight: 66,
        "&::after": !isLast
          ? {
              content: '""',
              position: "absolute",
              right: -20,
              top: -3,
              width: 0,
              height: 66,
              borderTop: "35px solid transparent",
              borderBottom: "35px solid transparent",
              borderLeft: `20px solid ${active ? borderColor : "transparent"}`,
              zIndex: 1,
            }
          : {},
      }}
    >
      {/* Icon logic */}
      {active && (
        <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: textColor }} />
      )}
      {completed && (
        <CheckCircleIcon sx={{ fontSize: 20, mr: 1, color: textColor }} />
      )}

      <Typography variant="body2" sx={{ fontWeight: active ? 600 : 400 }}>
        {label}
      </Typography>
    </Box>
  );
}
