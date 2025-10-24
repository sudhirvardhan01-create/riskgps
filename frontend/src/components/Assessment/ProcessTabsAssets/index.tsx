"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useAssessment } from "@/context/AssessmentContext";
import { Asset } from "@/types/assessment";
import AssetStrength from "../AssetStrength";
import QuestionnaireForAsset from "../QuestionnaireForAsset";
import { getAssetQuestionnaire } from "@/pages/api/assessment";

export default function ProcessTabsAssets() {
  const { selectedProcesses, setSelectedProcesses } = useAssessment();

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [questionnaire, setQuestionnaire] = useState([]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedAsset(selectedProcesses[newValue].assets[0]); // reset selection when switching process
  };

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getAssetQuestionnaire();
        setQuestionnaire(res.result.data);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      }
    };

    fetchOrgs();
  }, []);

  const handleUpdateScenario = (updatedAsset: Asset) => {
    // update inside context
    const updatedProcesses = selectedProcesses.map((p, idx) => {
      if (idx !== currentTab) return p;

      return {
        ...p,
        assets: p.assets.map((a: Asset) =>
          a.orgAssetId === updatedAsset.orgAssetId ? updatedAsset : a
        ),
      };
    });

    setSelectedProcesses(updatedProcesses); // push back to context
    setSelectedAsset(updatedAsset);
  };

  const activeProcess = selectedProcesses[currentTab];

  useEffect(() => {
    if (selectedProcesses.length > 0) {
      setSelectedAsset(selectedProcesses[0].assets[0]);
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
        {selectedProcesses.map((p, idx) => (
          <Tab
            key={idx}
            label={
              <Typography
                variant="body2"
                fontWeight={550}
              >{`${p.name} (${p.assets.length})`}</Typography>
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
        {/* Left Panel: Asset Scenarios */}
        <AssetStrength
          assets={activeProcess.assets}
          onSelect={setSelectedAsset}
          selectedAsset={selectedAsset}
        />

        {/* Right Panel: Questionnaire*/}
        <QuestionnaireForAsset
          questionnaires={questionnaire}
          assetCategory={selectedAsset?.assetCategory}
          onSubmit={() => {
            console.log("questionnaire");
          }}
        />
      </Box>
    </Box>
  );
}
