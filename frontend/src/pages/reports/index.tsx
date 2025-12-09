import RiskDashboard from "@/components/Reports/CustomReports";
import ProcessAssetFlow from "@/components/Reports/ProcessAssetFlow";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getOrganizationAssets } from "../api/organization";
import { getProcessList } from "../api/reports";
import Cookies from "js-cookie";
import NistControlScoreCardList, {
  NistControlCategory,
  NistControlScore,
} from "@/components/NistScore/NistScoreInput";
import { reportsPageTabs } from "@/constants/constant";
import {
  RiskExposureByProcessChartItem,
  RiskRadarRecord,
  RiskScenarioTableChartItem,
} from "@/types/dashboard";
import { DashboardService } from "@/services/dashboardService";
import ProcessTab from "@/components/Reports/ProcessTab";
import AssetLevelReportsContainer from "@/containers/AssetLevelReports";

function Reports() {
  const [currentTab, setCurrentTab] = useState(0);
  const [orgData, setOrgData] = useState<any>({});
  const [assetData, setAssetData] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<string | null>();
  const categories: NistControlCategory[] = [
  { id: "DE.CM", code: "DE.CM", name: "Continuous Monitoring" },
  { id: "PR.AT", code: "PR.AT", name: "Awareness and Training" },
  { id: "PR.AA", code: "PR.AA", name: "Identity Management, Authentication, and Access Control" },
  { id: "PR.IR", code: "PR.IR", name: "Technology Infrastructure Resilience" },
  { id: "PR.PS", code: "PR.PS", name: "Platform Security" },
  { id: "ID.RA", code: "ID.RA", name: "Risk Assessment" },

  // Included because you referenced it
  { id: "DE.AE", code: "DE.AE", name: "Anomalies and Events" }
];;

  const handleSave = (scores: NistControlScore[]) => {
    // replace with your API call
    console.log("Saving NIST scores:", scores);
  };
  const [riskExposureProcessChartData, setRiskExposureProcessChartData] =
    useState<RiskExposureByProcessChartItem[]>([]);
  const [businessUnitSeverityData, setBusinessUnitSeverityData] = useState<
    any[]
  >([]);
  const [riskScenariosTableChartData, setRiskScenariosTableChartData] =
    useState<RiskScenarioTableChartItem[]>([]);
  const [businessUnitRadarChartData, setBusinessUnitRadarChartData] = useState<
    RiskRadarRecord[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cookieUser = Cookies.get("user");
        if (cookieUser) {
          const parsed = JSON.parse(cookieUser);
          setOrgId(parsed?.orgId || parsed?.org_id || null);
        }
      } catch (err) {
        console.warn("Invalid or missing cookie:", err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!orgId) return;
      try {
        const [
          processRes,
          assetRes,
          riskExposureProcessChartRes,
          businessUnitHeatmapChartRes,
          riskScenarioTableChartRes,
          businessUnitRadarChartRes,
        ] = await Promise.all([
          getProcessList(orgId),
          getOrganizationAssets(orgId),
          DashboardService.getRiskExposureBusinessProcessChartData(orgId),
          DashboardService.getBusinessUnitSeverityHeatmapChartData(orgId),
          DashboardService.getRiskScenariosTableChartData(orgId),
          DashboardService.getBusinessUnitRadarChartData(orgId),
        ]);

        setOrgData(processRes.data);
        setAssetData(assetRes.data ?? []);
        setRiskExposureProcessChartData(riskExposureProcessChartRes.data ?? []);
        setBusinessUnitSeverityData(businessUnitHeatmapChartRes.data ?? []);
        setRiskScenariosTableChartData(riskScenarioTableChartRes.data ?? []);
        setBusinessUnitRadarChartData(businessUnitRadarChartRes.data ?? []);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    }
    fetchData();
  }, [orgId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // ✅ SSR-safe: show fallback if no org assigned
  if (!orgId) {
    return (
      <Box sx={{ m: 5 }}>
        <Typography>User is not assigned to any organization</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ m: 5, height: "63vh" }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Reports
        </Typography>
      </Stack>
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
          mb: 1,
        }}
        variant="scrollable"
        scrollButtons
      >
        {reportsPageTabs.map((item, index) => (
          <Tab
            key={index}
            label={
              <Typography variant="body2" fontWeight={550}>
                {item.tabName}
              </Typography>
            }
            sx={{
              border:
                currentTab === item.tabVlaue
                  ? "1px solid #E7E7E8"
                  : "1px solid transparent",
              borderRadius: "8px 8px 0px 0px",
              borderBottom:
                currentTab === item.tabVlaue
                  ? "1px solid transparent"
                  : "1px solid #E7E7E8",
              maxHeight: 48,
            }}
          />
        ))}
      </Tabs>
      {/* Tab Content */}
      {currentTab === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 0,
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          <ProcessTab
            riskExposureProcessChartData={riskExposureProcessChartData}
            businessUnitSeverityData={businessUnitSeverityData}
            riskScenariosTableChartData={riskScenariosTableChartData}
            businessUnitRadarChartData={businessUnitRadarChartData}
          />
        </Box>
      )}
      {currentTab === 1 && <AssetLevelReportsContainer/>}
      {currentTab === 2 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <RiskDashboard assetData={assetData} />
        </Box>
      )}
      {currentTab === 3 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <ProcessAssetFlow data={orgData} />
        </Box>
      )}
      {currentTab === 4 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 500,
          }}
        >
          <NistControlScoreCardList
            categories={categories}
            onSave={handleSave}
          />{" "}
        </Box>
      )}
    </Box>
  );
}

export default Reports;
