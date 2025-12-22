import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { customStyles } from "@/styles/customStyles";

interface LegendScaleProps {
  height?: number;
  showLabel?: boolean;
}

const severityColors = ["#cae8ff", "#5cb6f9", "#6f80eb", "#233dff", "#12229d"];

const LegendScale: React.FC<LegendScaleProps> = ({
  height = 8,
  showLabel = true,
}) => {
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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
          mt={1}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: customStyles.fontColor,
              marginBottom: "4px",
              whiteSpace: "nowrap",
            }}
          >
            Low
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: customStyles.fontColor,
              marginBottom: "4px",
              whiteSpace: "nowrap",
            }}
          >
            Critical
          </Typography>
        </Stack>
      )}
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
    </Box>
  );
};

export default LegendScale;
