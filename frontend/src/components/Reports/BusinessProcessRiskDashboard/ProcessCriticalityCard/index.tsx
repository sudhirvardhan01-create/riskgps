import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

interface ProcessCriticalityCardProps {
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardText: string;
  cardTextColor: string;
  cardIcon: React.ReactElement;
  processesCount: number;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

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
      <HtmlTooltip title="Name of Processes">
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
      </HtmlTooltip>
    </>
  );
};

export default ProcessCriticalityCard;
