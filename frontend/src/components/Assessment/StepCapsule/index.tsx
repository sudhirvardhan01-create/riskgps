import React from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface StepCapsuleProps {
  label: string;
  active?: boolean;
  completed?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function StepCapsule({
  label,
  active = false,
  completed = false,
  isFirst = false,
  isLast = false,
}: StepCapsuleProps) {
  const height = 66;
  const arrowWidth = Math.max(24, Math.round(height * 0.28));
  const border = 1;

  // Color logic
  const bgColor = active ? "#04139A" : completed ? "#E7E9FB" : "#FFFFFF";
  const textColor = active ? "#FFFFFF" : completed ? "#04139A" : "#91939A";
  const borderColor = active || completed ? "#04139A" : "#E7E7E8";

  return (
    <ButtonBase
      disableRipple
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: `${height}px`,
        minWidth: 220,
        px: 3,
        pl: 6,
        py: 1.5,
        bgcolor: bgColor,
        color: textColor,
        borderTop: `${border}px solid ${borderColor}`,
        borderBottom: `${border}px solid ${borderColor}`,
        borderLeft: isFirst ? `${border}px solid ${borderColor}` : "none",
        borderRight: isLast ? `${border}px solid ${borderColor}` : "none",
        fontWeight: active ? 600 : 400,
        textTransform: "none",
        overflow: "visible",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Right Chevron (except last) */}
      <>
        <Box
          sx={{
            position: "absolute",
            top: -2,
            right: -25,
            width: 0,
            height: 0,
            borderTop: `${height / 2 + border}px solid transparent`,
            borderBottom: `${height / 2 + border}px solid transparent`,
            borderLeft: `${arrowWidth}px solid ${borderColor}`,
            zIndex: 2,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: -2,
            right: -23,
            width: 0,
            height: 0,
            borderTop: `${height / 2 + border}px solid transparent`,
            borderBottom: `${height / 2 + border}px solid transparent`,
            borderLeft: `${arrowWidth - border}px solid ${bgColor}`,
            zIndex: 3,
          }}
        />
      </>

      {/* Step Icon */}
      {active && (
        <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: textColor }} />
      )}
      {completed && (
        <CheckCircleIcon sx={{ fontSize: 20, mr: 1, color: textColor }} />
      )}

      {/* Label */}
      <Typography variant="body2" fontWeight={active ? 600 : 400}>
        {label}
      </Typography>
    </ButtonBase>
  );
}
