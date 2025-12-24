import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { customStyles } from "@/styles/customStyles";

interface LegendScaleProps {
  width?: number | string;
  height?: number | string;
  barHeightWidth?: number;
  showLabel?: boolean;
  orientation?: "horizontal" | "vertical";
}

const severityColors = ["#cae8ff", "#5cb6f9", "#6f80eb", "#233dff", "#12229d"];

const LegendScale: React.FC<LegendScaleProps> = ({
  barHeightWidth = 8,
  showLabel = true,
  orientation = "horizontal",
}) => {
  const segmentHeightWidth = 20;
  const isHorizontal = orientation === "horizontal";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isHorizontal ? "column" : "row",
        width: isHorizontal ? "50%" : "100%",
        height: "50%",
      }}
    >
      {showLabel && (
        <Stack
          direction={isHorizontal ? "row" : "column"}
          justifyContent={"space-between"}
          height={"100%"}
          mr={isHorizontal ? 0 : 1}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: customStyles.fontColor,
              whiteSpace: "nowrap",
            }}
          >
            {isHorizontal ? "Low" : "Critical"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: customStyles.fontColor,
              whiteSpace: "nowrap",
            }}
          >
            {isHorizontal ? "Critical" : "Low"}
          </Typography>
        </Stack>
      )}
      {/* Progress bar with 5 segments */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column-reverse",
          width: isHorizontal ? "100%" : `${barHeightWidth}px`,
          height: isHorizontal ? `${barHeightWidth}px` : "100%",
          borderRadius: `${barHeightWidth / 2}px`,
          overflow: "hidden",
        }}
      >
        {severityColors.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: isHorizontal ? `${segmentHeightWidth}%` : barHeightWidth,
              height: isHorizontal ? barHeightWidth : `${segmentHeightWidth}%`,
              backgroundColor: color,
              borderRight:
                isHorizontal && index < 4 ? "1px solid #fff" : "none",
              borderBottom:
                !isHorizontal && index < 4 ? "1px solid #fff" : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LegendScale;
