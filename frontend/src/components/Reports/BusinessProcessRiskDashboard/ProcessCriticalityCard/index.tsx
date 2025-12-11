import { Box, Stack, Typography } from "@mui/material";

interface ProcessCriticalityCardProps {
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardText: string;
  cardTextColor: string;
  cardIcon: React.ReactElement;
  processesCount: number;
}

const ProcessCriticalityCard: React.FC<ProcessCriticalityCardProps> = ({
  cardBackgroundColor,
  cardBorderColor,
  cardIcon,
  cardText,
  cardTextColor,
  processesCount,
}) => {
  return (
    <>
      <Box
        sx={{
          border: `1px solid ${cardBorderColor}`,
          backgroundColor: cardBackgroundColor,
          borderRadius: 2,
          p: 2,
          opacity: 0.9,
        }}
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
