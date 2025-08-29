import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface StepProps {
  number: number;
  title: string;
  subtitle: string;
  active?: boolean;
  completed?: boolean;
}

function Step({ number, title, subtitle, active, completed }: StepProps) {
  const activeColor = "#04139A";
  const inactiveColor = "#9E9FA5";
  const completedColor = "#147A50";

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Circle with number or check */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={32}
        height={32}
        borderRadius="50%"
        sx={{
          bgcolor: completed
            ? completedColor
            : active
            ? activeColor
            : "transparent",
          border: `2px solid ${
            completed ? completedColor : active ? activeColor : inactiveColor
          }`,
          color: completed ? "#fff" : active ? "#fff" : inactiveColor,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : number}
      </Box>

      {/* Texts */}
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: completed
              ? completedColor
              : active
              ? activeColor
              : inactiveColor,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: completed
              ? completedColor
              : active
              ? "#91939A"
              : inactiveColor,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

interface StepIndicatorProps {
  steps: { title: string; subtitle: string }[];
  activeStep: number;
}

export default function StepIndicator({
  steps,
  activeStep,
}: StepIndicatorProps) {
  return (
    <Box display="flex" alignItems="center" gap={4}>
      {steps.map((step, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2} flex={1}>
          <Step
            number={index + 1}
            title={step.title}
            subtitle={step.subtitle}
            active={index === activeStep}
            completed={index < activeStep}
          />

          {/* Connector line except for last */}
          {index < steps.length - 1 && (
            <Box
              flex={1}
              height="2px"
              bgcolor={index < activeStep ? "#04139A" : "#D3D3D3"}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}
