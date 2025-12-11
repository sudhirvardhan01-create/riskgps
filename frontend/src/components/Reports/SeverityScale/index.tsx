import React from "react";
import { Box, Typography } from "@mui/material";

type SeverityLevel = "very low" | "low" | "moderate" | "high" | "critical";

interface SeverityScaleProps {
  severity: SeverityLevel;
  height?: number;
  showLabel?: boolean;
}

interface SeverityConfig {
  value: number;
  label: string;
  color: string;
}

const severityMap: Record<SeverityLevel, SeverityConfig> = {
  "very low": {
    value: 1,
    label: "Very Low",
    color: "#cae8ff",
  },
  low: {
    value: 2,
    label: "Low",
    color: "#5cb6f9",
  },
  moderate: {
    value: 3,
    label: "Moderate",
    color: "#6f80eb",
  },
  high: {
    value: 4,
    label: "High",
    color: "#233dff",
  },
  critical: {
    value: 5,
    label: "Critical",
    color: "#12229d",
  },
};

const severityColors = ["#cae8ff", "#5cb6f9", "#6f80eb", "#233dff", "#12229d"];

const SeverityScale: React.FC<SeverityScaleProps> = ({
  severity,
  height = 8,
  showLabel = true,
}) => {
  const config = severityMap[severity];

  if (!config) {
    return null;
  }

  const dotSize = height * 2;
  const segmentWidth = 20; // Width percentage for each segment

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minWidth: "100px",
        maxWidth: "200px",
      }}
    >
      {/* Label above the dot */}
      {showLabel && (
        <Typography
          variant="caption"
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            // color: config.color,
            color: "text.primary",
            marginBottom: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {config.label}
        </Typography>
      )}

      {/* Container for progress bar and dot */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: `${dotSize}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Progress bar with 5 segments */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: `${height}px`,
            borderRadius: `${height / 2}px`,
            overflow: "hidden",
          }}
        >
          {severityColors.map((color, index) => (
            <Box
              key={index}
              sx={{
                width: `${segmentWidth}%`,
                backgroundColor: color,
                borderRight: index < 4 ? "1px solid #fff" : "none",
              }}
            />
          ))}
        </Box>

        {/* Dot indicator */}
        <Box
          sx={{
            position: "absolute",
            left: `${(config.value - 1) * 20 + 10}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            backgroundColor: config.color,
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default SeverityScale;
