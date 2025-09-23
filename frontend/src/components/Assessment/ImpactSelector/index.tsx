"use client";

import React from "react";
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import TooltipComponent from "@/components/TooltipComponent";

interface ImpactSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const options = [
  {
    label: "Very Low",
    value: "very-low",
    range: "$50k-100k",
    color: "#3BB966",
  },
  {
    label: "Low",
    value: "low",
    range: "$100k-200k",
    color: "#3366CC",
  },
  {
    label: "Moderate",
    value: "moderate",
    range: "$200k-500k",
    color: "#E3B52A",
  },
  {
    label: "High",
    value: "high",
    range: "$500k-1Mn",
    color: "#DA7706",
  },
  {
    label: "Critical",
    value: "critical",
    range: ">$1Mn",
    color: "#B90D0D",
  },
];

export default function ImpactSelector({
  label,
  value,
  onChange,
}: ImpactSelectorProps) {
  return (
    <Grid container spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
      <Grid size={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.primary" fontWeight={550}>
            {label}
          </Typography>
          <TooltipComponent
            title={`${label} Tooltip`}
            width="16px"
            height="16px"
          />
        </Box>
      </Grid>
      <Grid size={9}>
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && onChange(newValue)}
          sx={{ flexWrap: "wrap" }}
        >
          {options.map((opt) => (
            <ToggleButton
              key={opt.value}
              value={opt.value}
              sx={{
                textTransform: "none",
                bgcolor:
                  value === opt.value ? `${opt.color} !important` : "#f5f5f5",
                color: value === opt.value ? "#ffffff !important" : "#333",
                borderRadius: 2,
                px: 2,
                py: 1,
                minWidth: 110,
                display: "flex",
                flexDirection: "column",
                "&.MuiToggleButtonGroup-middleButton, &.MuiToggleButtonGroup-lastButton":
                  {
                    borderLeft: "1px solid #E4E4E4",
                  },
              }}
            >
              <Typography variant="body2" fontWeight="500" sx={{ pb: 1 }}>
                {opt.label}
              </Typography>
              <Typography variant="caption">{opt.range}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}
