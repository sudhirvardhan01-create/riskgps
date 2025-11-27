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
import { Severity } from "@/types/assessment";
import { formatCurrencyCompact } from "@/utils/utility";

interface ImpactSelectorProps {
  label: string;
  value?: string; // selected severityId
  onChange: (val: string) => void;
  severityLevels: Severity[];
}

export default function ImpactSelector({
  label,
  value,
  onChange,
  severityLevels,
}: ImpactSelectorProps) {
  return (
    <Grid container spacing={1} sx={{ alignItems: "center", mb: 2.5 }}>
      {/* Label + Tooltip */}
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

      {/* Severity Buttons */}
      <Grid size={9}>
        <ToggleButtonGroup
          value={value ?? ""}
          exclusive
          onChange={(_, newValue) => newValue && onChange(newValue)}
          sx={{ flexWrap: "wrap" }}
        >
          {severityLevels.map((opt, index) => {
            const isLast = index === severityLevels.length - 1;
            return (
              <ToggleButton
                key={opt.severityId}
                value={opt.severityId}
                sx={{
                  textTransform: "none",
                  bgcolor:
                    value === opt.severityId
                      ? `${opt.color} !important`
                      : "#f5f5f5",
                  color:
                    value === opt.severityId ? "#ffffff !important" : "#333",
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
                  {opt.name}
                </Typography>
                <Typography variant="caption">
                  {isLast ? (
                    <>&gt; {formatCurrencyCompact(Number(opt.maxRange))}</>
                  ) : (
                    <>
                      {formatCurrencyCompact(Number(opt.minRange))} -{" "}
                      {formatCurrencyCompact(Number(opt.maxRange))}
                    </>
                  )}
                </Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}
