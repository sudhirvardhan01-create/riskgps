"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import RiskScenarioList from "../RiskScenarioBussiness";
import BusinessImpactPanel from "../BusinessImpactPanel";
import { useAssessment } from "@/context/AssessmentContext";
import { Risk } from "@/types/assessment";

export default function ProcessTabs() {
  const { assessment, updateAssessment } = useAssessment();

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<
    Risk | null | undefined
  >(null);

  useEffect(() => {
    setSelectedScenario({ ...assessment!.processes[0].risks[0] } as Risk);
  }, []);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedScenario({
      ...assessment!.processes[newValue].risks[0],
    } as Risk); // reset selection when switching process
  };

  const handleUpdateScenario = (updatedScenario: Risk) => {
    // update inside context
    const updatedProcesses = assessment?.processes.map((p, idx) => {
      if (idx !== currentTab) return p;

      return {
        ...p,
        risks: p.risks.map((r: Risk) =>
          r.id === updatedScenario.id ? updatedScenario : r
        ),
      };
    });

    updateAssessment({ processes: updatedProcesses }); // push back to context
    setSelectedScenario({ ...updatedScenario });
  };

  const activeProcess = assessment?.processes[currentTab];

  useEffect(() => {
    if (assessment?.processes && assessment?.processes.length > 0) {
      setSelectedScenario({ ...assessment?.processes[0].risks[0] });
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tabs Header */}
      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 550,
            py: 2,
            px: 6,
          },
          "& .MuiTabs-indicator": { display: "none" },
          mx: -5,
        }}
        variant="scrollable"
        scrollButtons
      >
        {assessment?.processes.map((p, idx) => (
          <Tab
            key={idx}
            label={
              <Typography
                variant="body2"
                fontWeight={550}
              >{`${p.processName} (${p.risks.length})`}</Typography>
            }
            sx={{
              border:
                currentTab == idx
                  ? "1px solid #E7E7E8"
                  : "1px solid transparent",
              borderRadius: "8px 8px 0px 0px",
              borderBottom:
                currentTab == idx
                  ? "1px solid transparent"
                  : "1px solid #E7E7E8",
              maxHeight: 48,
            }}
          />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ display: "flex", flex: 1, mb: 0 }}>
        {/* Left Panel: Risk Scenarios */}
        <RiskScenarioList
          scenarios={activeProcess?.risks}
          onSelect={setSelectedScenario}
          selectedScenario={selectedScenario}
        />

        {/* Right Panel: Business Impact */}
        <BusinessImpactPanel
          selectedScenario={selectedScenario}
          onUpdateScenario={handleUpdateScenario}
        />
      </Box>
    </Box>
  );
}
