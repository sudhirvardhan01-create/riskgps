import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface ControlButtonTabProps {
  selectedControlFramework: string;
  setSelectedControlFramework: React.Dispatch<React.SetStateAction<string>>;
  frameworks: string[];
}

const ControlButtonTab: React.FC<ControlButtonTabProps> = ({
  selectedControlFramework,
  setSelectedControlFramework,
  frameworks,
}) => {
  return (
    <Box display={"Flex"} flexDirection={"row"} gap={1.25} mb={3}>
      <Button
        onClick={() => setSelectedControlFramework("MITRE")}
        sx={{
          borderRadius: 1,
          border:
            selectedControlFramework === "MITRE"
              ? "1px solid #04139A"
              : "1px solid #E7E7E8",
          backgroundColor:
            selectedControlFramework === "MITRE"
              ? "#EDF3FCA3"
              : "#fff",
        }}
      >
        <Typography variant="body2" color="text.primary" fontWeight={selectedControlFramework === "MITRE"
              ? 550
              : 500}>
          MITRE
        </Typography>
      </Button>
      {frameworks.map((framework) => (
        <Button
          key={framework}
          onClick={() => setSelectedControlFramework(framework)}
          sx={{
            borderRadius: 1,
            border:
              selectedControlFramework === framework
                ? "1px solid #04139A"
                : "1px solid #E7E7E8",
            backgroundColor:
              selectedControlFramework === framework
                ? "#EDF3FCA3"
                : "#fff",
          }}
        >
          <Typography variant="body2" color="text.primary" fontWeight={selectedControlFramework === framework
              ? 550
              : 500}>
            {framework}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default ControlButtonTab;
