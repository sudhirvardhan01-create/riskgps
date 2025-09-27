"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImpactSelector from "../ImpactSelector";
import TextFieldStyled from "@/components/TextFieldStyled";
import TooltipComponent from "@/components/TooltipComponent";
import { Risk } from "@/types/assessment";
import { getOrganizationTaxonomy } from "@/pages/api/organization";
import { useAssessment } from "@/context/AssessmentContext";

export default function BusinessImpactPanel({
  selectedScenario,
  onUpdateScenario,
}: {
  selectedScenario: Risk | null;
  onUpdateScenario: (risk: Risk) => void;
}) {
  const { selectedOrg } = useAssessment();

  const [thresholdHours, setThresholdHours] = useState<number | undefined>();
  const [thresholdCost, setThresholdCost] = useState<number | undefined>();
  const [taxonomies, setTaxonomies] = useState<any[]>([]);
  const [taxonomyValue, setTaxonomyValue] = useState<Record<string, string>>(
    {}
  );
  const [value, setValue] = useState("1");
  const [isInternalChange, setIsInternalChange] = useState(false);

  useEffect(() => {
    const getTaxonomies = async () => {
      const res = await getOrganizationTaxonomy(selectedOrg);
      setTaxonomies(res.data);
    };
    getTaxonomies();
  }, [selectedOrg]);

  // Reset form when selectedScenario changes
  useEffect(() => {
    if (selectedScenario) {
      setThresholdHours(selectedScenario.thresholdHours ?? undefined);
      setThresholdCost(selectedScenario.thresholdCost ?? undefined);

      if (selectedScenario.taxonomy && selectedScenario.taxonomy.length > 0) {
        const mapped: Record<string, string> = {};
        selectedScenario.taxonomy.forEach((t: any) => {
          mapped[t.taxonomyId] = t.value ?? "";
        });
        setTaxonomyValue(mapped);
      } else {
        // reset if no taxonomy in scenario
        setTaxonomyValue({});
      }
    } else {
      // reset everything if no scenario
      setThresholdHours(undefined);
      setThresholdCost(undefined);
      setTaxonomyValue({});
    }

    setIsInternalChange(false); // reset after parent update
  }, [selectedScenario]);

  // Push updates back into parent, but only if it's from user action
  useEffect(() => {
    if (!selectedScenario || !isInternalChange) return;

    const updatedScenario: Risk = {
      ...selectedScenario,
      thresholdHours,
      thresholdCost,
      taxonomy: Object.entries(taxonomyValue).map(([taxonomyId, value]) => ({
        taxonomyId,
        value,
      })),
    };

    const isDifferent =
      updatedScenario.thresholdHours !== selectedScenario.thresholdHours ||
      updatedScenario.thresholdCost !== selectedScenario.thresholdCost ||
      JSON.stringify(updatedScenario.taxonomy) !==
        JSON.stringify(selectedScenario.taxonomy);

    if (isDifferent) {
      onUpdateScenario(updatedScenario);
    }
  }, [
    thresholdHours,
    thresholdCost,
    taxonomyValue,
    selectedScenario,
    isInternalChange,
    onUpdateScenario,
  ]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // User edits
  const handleThresholdHoursChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsInternalChange(true);
    setThresholdHours(
      e.target.value === "" ? undefined : Number(e.target.value)
    );
  };

  const handleThresholdCostChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsInternalChange(true);
    setThresholdCost(
      e.target.value === "" ? undefined : Number(e.target.value)
    );
  };

  const setTaxonomy = (taxonomyId: string, val: string) => {
    setIsInternalChange(true);
    setTaxonomyValue((prev) => ({
      ...prev,
      [taxonomyId]: val,
    }));
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
                onChange={handleThresholdHoursChange}
              />
              <TextFieldStyled
                label="Risk Threshold ($)"
                type="number"
                size="small"
                value={thresholdCost ?? ""}
                onChange={handleThresholdCostChange}
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
            {taxonomies.map((item: any) => {
              return (
                <ImpactSelector
                  key={item.taxonomyId}
                  label={item.name}
                  severityLevels={item.severityLevels}
                  value={taxonomyValue[item.taxonomyId]}
                  onChange={(val) => setTaxonomy(item.taxonomyId, val)}
                />
              );
            })}
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
