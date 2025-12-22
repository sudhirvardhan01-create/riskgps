import { customStyles } from "@/styles/customStyles";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface ProcessCriticalityCardProps {
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardText: string;
  cardTextColor: string;
  cardIcon: React.ReactElement;
  processesCount: number;
  names: string[];
  module: string;
}

const ProcessCriticalityCard: React.FC<ProcessCriticalityCardProps> = ({
  cardBackgroundColor,
  cardBorderColor,
  cardIcon,
  cardText,
  cardTextColor,
  processesCount,
  names,
  module,
}) => {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPos({
      x: e.clientX + 10,
      y: e.clientY - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };
  return (
    <>
      {tooltipPos && (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y,
            pointerEvents: "none",
            zIndex: 1300,
            borderRadius: customStyles.tooltipBorderRadius,
            backgroundColor: customStyles.tooltipBackgroundColor,
            border: `1px solid ${customStyles.tooltipBorderColor}`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {names.length !== 0 ? (
            <>
              <Typography
                variant="body2"
                color={customStyles.tooltipFontColor}
                fontWeight={customStyles.tooltipDarkFontWeight}
                sx={{ mb: 0.5 }}
              >
                {module}:
              </Typography>
              {names.map((i, index) => (
                <Typography
                  variant="body2"
                  color={customStyles.tooltipFontColor}
                  key={index}
                  fontWeight={customStyles.tooltipLightFontWeight}
                >
                  {index + 1}. {i}
                </Typography>
              ))}
            </>
          ) : (
            <Typography
              variant="body2"
              color={customStyles.tooltipFontColor}
              fontWeight={customStyles.tooltipLightFontWeight}
            >
              0 {module}
            </Typography>
          )}
        </Paper>
      )}
      <Box
        component={"div"}
        sx={{
          border: `1px solid ${cardBorderColor}`,
          backgroundColor: cardBackgroundColor,
          borderRadius: 2,
          p: 2,
          opacity: 0.9,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {cardIcon}
          <Typography color={cardTextColor}>{processesCount}</Typography>
        </Stack>
        <Typography color={cardTextColor}>{cardText}</Typography>
      </Box>
    </>
  );
};

export default ProcessCriticalityCard;
