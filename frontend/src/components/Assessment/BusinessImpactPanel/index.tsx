"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImpactSelector from "../ImpactSelector";
import TextFieldStyled from "@/components/TextFieldStyled";
import TooltipComponent from "@/components/TooltipComponent";
import { Risk, Taxonomy } from "@/types/assessment";
import { getOrganizationTaxonomy } from "@/pages/api/organization";
import { useAssessment } from "@/context/AssessmentContext";

export default function BusinessImpactPanel({
  selectedScenario,
  onUpdateScenario,
}: {
  selectedScenario: Risk | null | undefined;
  onUpdateScenario: (risk: Risk) => void;
}) {
  const { assessment } = useAssessment();

  const [taxonomies, setTaxonomies] = useState<any[]>([]);
  const [taxonomyValue, setTaxonomyValue] = useState<Taxonomy[]>([]);
  const [value, setValue] = useState("1");
  const [isInternalChange, setIsInternalChange] = useState(false);

  // fetch taxonomies
  useEffect(() => {
    const getTaxonomies = async () => {
      const res = await getOrganizationTaxonomy(assessment?.orgId);
      setTaxonomies(res.data);

      // initialize taxonomyValue
      setTaxonomyValue(
        res.data.map((item: any) => ({
          taxonomyId: item.taxonomyId,
          name: item.name,
          orgId: item.organizationId,
          severityDetails: {},
        }))
      );
    };
    getTaxonomies();
  }, [assessment?.orgId]);

  // Reset form when selectedScenario changes
  useEffect(() => {
    console.log("selected scenario", selectedScenario);

    if (
      selectedScenario &&
      selectedScenario.taxonomy &&
      selectedScenario.taxonomy.length > 0
    ) {
      // map scenario taxonomy to array
      setTaxonomyValue(
        selectedScenario.taxonomy.map((t: any) => ({
          taxonomyId: t.taxonomyId,
          name: t.name ?? "",
          orgId: t.orgId ?? assessment?.orgId,
          severityDetails: t.severityDetails ?? {},
        }))
      );
    } else {
      setTaxonomyValue([]);
    }

    setIsInternalChange(false);
  }, [JSON.stringify(selectedScenario), assessment?.orgId]);

  // Push updates back into parent
  useEffect(() => {
    if (!selectedScenario || !isInternalChange) return;

    const updatedScenario: Risk = {
      ...selectedScenario,
      taxonomy: taxonomyValue,
    };

    const isDifferent =
      JSON.stringify(updatedScenario.taxonomy) !==
      JSON.stringify(selectedScenario.taxonomy);

    if (isDifferent) {
      onUpdateScenario(updatedScenario);
    }
  }, [
    taxonomyValue,
    JSON.stringify(selectedScenario),
    isInternalChange,
    onUpdateScenario,
  ]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const setTaxonomy = (
    taxonomyId: string,
    name: string,
    ind: number,
    val: string
  ) => {
    setIsInternalChange(true);

    const severity = taxonomies[ind].severityLevels.find(
      (item: any) => item.severityId === val
    );
    if (!severity) return;

    setTaxonomyValue((prev) => {
      const updated = [...prev];
      updated[ind] = {
        ...updated[ind],
        taxonomyId,
        name,
        severityDetails: {
          severityId: severity.severityId,
          name: severity.name,
          minRange: severity.minRange,
          maxRange: severity.maxRange,
          color: severity.color,
        },
      };
      return updated;
    });
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
        {selectedScenario.riskScenario}
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
            {taxonomies.length > 0 ? (
              taxonomies.map((item: any, ind: number) => (
                <ImpactSelector
                  key={item.taxonomyId}
                  label={item.name}
                  severityLevels={item.severityLevels}
                  value={taxonomyValue[ind]?.severityDetails?.severityId ?? ""}
                  onChange={(val) =>
                    setTaxonomy(item.taxonomyId, item.name, ind, val)
                  }
                />
              ))
            ) : (
              <Box>
                <Typography>No taxonomy added in the organization</Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
