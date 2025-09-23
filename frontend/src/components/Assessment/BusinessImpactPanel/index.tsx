"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImpactSelector from "../ImpactSelector";
import TextFieldStyled from "@/components/TextFieldStyled";
import TooltipComponent from "@/components/TooltipComponent";
import { Risk } from "@/types/assessment";

export default function BusinessImpactPanel({
  selectedScenario,
  onUpdateScenario, // callback to push state updates up
}: {
  selectedScenario: Risk | null;
  onUpdateScenario: (risk: Risk) => void;
}) {
  const [thresholdHours, setThresholdHours] = useState<number | undefined>();
  const [thresholdCost, setThresholdCost] = useState<number | undefined>();
  const [financial, setFinancial] = useState("");
  const [regulatory, setRegulatory] = useState("");
  const [reputational, setReputational] = useState("");
  const [operational, setOperational] = useState("");
  const [value, setValue] = useState("1");

  // Reset form when selectedScenario changes
  useEffect(() => {
    if (selectedScenario) {
      setThresholdHours(selectedScenario.thresholdHours ?? undefined);
      setThresholdCost(selectedScenario.thresholdCost ?? undefined);
      setFinancial(selectedScenario.financial ?? "");
      setRegulatory(selectedScenario.regulatory ?? "");
      setReputational(selectedScenario.reputational ?? "");
      setOperational(selectedScenario.operational ?? "");
    }
  }, [selectedScenario]);

  // Push updates back into selectedScenario
  useEffect(() => {
    if (selectedScenario) {
      onUpdateScenario({
        ...selectedScenario,
        thresholdHours,
        thresholdCost,
        financial,
        regulatory,
        reputational,
        operational,
      });
    }
  }, [
    thresholdHours,
    thresholdCost,
    financial,
    regulatory,
    reputational,
    operational,
  ]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!selectedScenario) {
    return (
      <Box
        sx={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "text.secondary",
          fontStyle: "italic",
        }}
      >
        Select a risk scenario to view details
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "70%",
        typography: "body1",
        p: 2.5,
        borderRight: "1px solid #eee",
        borderBottom: "1px solid #eee",
      }}
    >
      <Typography
        variant="body1"
        color="text.primary"
        fontWeight={550}
        sx={{ pb: 2 }}
      >
        {selectedScenario.description}
      </Typography>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 550,
                py: 2.5,
                px: 3,
              },
            }}
          >
            <Tab label="Business Impact" value="1" />
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ p: 0, pt: 4 }}>
          <Box>
            {/* Thresholds */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              <TextFieldStyled
                label="Risk Threshold (hours)"
                type="number"
                size="small"
                value={thresholdHours ?? ""}
                onChange={(e) => setThresholdHours(Number(e.target.value))}
              />
              <TextFieldStyled
                label="Risk Threshold ($)"
                type="number"
                size="small"
                value={thresholdCost ?? ""}
                onChange={(e) => setThresholdCost(Number(e.target.value))}
              />
            </Box>

            {/* Tooltip */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: 1,
                pb: 2.5,
              }}
            >
              <TooltipComponent
                title={"Taxonomy Tooltip"}
                width="16px"
                height="16px"
              />
              <Typography variant="caption" fontWeight={550} color="primary">
                View Risk Taxonomy
              </Typography>
            </Box>

            {/* Impacts */}
            <ImpactSelector
              label="Financial Impact"
              value={financial}
              onChange={setFinancial}
            />
            <ImpactSelector
              label="Regulatory"
              value={regulatory}
              onChange={setRegulatory}
            />
            <ImpactSelector
              label="Reputational"
              value={reputational}
              onChange={setReputational}
            />
            <ImpactSelector
              label="Operational"
              value={operational}
              onChange={setOperational}
            />
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
