import { Box } from "@mui/material";
import StepCapsule from "../StepCapsule";

interface ArrowStepperProps {
  steps: string[];
  activeStep: number;
}

export default function ArrowStepper({ steps, activeStep }: ArrowStepperProps) {
  return (
    <Box display="flex" alignItems="center">
      {steps.map((step, index) => (
        <StepCapsule
          key={index}
          label={step}
          active={index === activeStep}
          completed={index < activeStep}
          isLast={index === steps.length - 1}
          isFirst={index === 0}
        />
      ))}
    </Box>
  );
}
