"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useAssessment } from "@/context/AssessmentContext";
import { Asset } from "@/types/assessment";
import AssetStrength from "../AssetStrength";
import QuestionnaireForAsset from "../QuestionnaireForAsset";
import { getAssetQuestionnaire } from "@/pages/api/assessment";

export default function ProcessTabsAssets() {
  const { assessment, updateAssessment } = useAssessment();

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [questionnaire, setQuestionnaire] = useState([]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedAsset(assessment?.processes[newValue].assets[0]); // reset selection when switching process
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

  const handleUpdateAsset = (questionaireObj: any) => {
    if (!assessment || selectedAsset == null) return;

    const updatedProcesses = assessment.processes.map((p, idx) => {
      if (idx !== currentTab) return p;

      const updatedAssets = p.assets.map((a: Asset) => {
        if (a.id !== selectedAsset.id) return a;

        const updatedQuestionnaire = (() => {
          const existingQuestionnaire = a.questionnaire || [];

          // Try to find an existing entry
          const index = existingQuestionnaire.findIndex(
            (q: any) => q.questionaireId === questionaireObj.questionaireId
          );

          if (index === -1) {
            // Not found → add new entry
            return [...existingQuestionnaire, questionaireObj];
          } else {
            // Found → update existing one
            return existingQuestionnaire.map((q: any, i: number) =>
              i === index ? { ...q, ...questionaireObj } : q
            );
          }
        })();

        return {
          ...a,
          questionnaire: updatedQuestionnaire,
        };
      });

      return {
        ...p,
        assets: updatedAssets,
      };
    });

    // Find the newly updated asset to keep UI in sync
    const updatedAsset = updatedProcesses[currentTab].assets.find(
      (a: Asset) => a.id === selectedAsset.id
    );

    updateAssessment({ processes: updatedProcesses }); // push back to context
    setSelectedAsset(updatedAsset);
  };

  const activeProcess = assessment?.processes[currentTab];

  useEffect(() => {
    if (assessment?.processes && assessment?.processes.length > 0) {
      setSelectedAsset(assessment?.processes[0].assets[0]);
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
              >{`${p.processName} (${p.assets.length})`}</Typography>
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
          assets={activeProcess?.assets}
          onSelect={setSelectedAsset}
          selectedAsset={selectedAsset}
        />

        {/* Right Panel: Questionnaire*/}
        <QuestionnaireForAsset
          questionnaires={questionnaire}
          asset={selectedAsset}
          onSubmit={handleUpdateAsset}
        />
      </Box>
    </Box>
  );
}
