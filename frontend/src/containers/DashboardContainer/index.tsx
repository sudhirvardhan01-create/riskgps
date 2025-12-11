import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { dashboardPageTabs } from "@/constants/constant";
import BoardTab from "@/components/Reports/BoardTab";
import ERMTab from "@/components/Reports/ERMTab";
import {
  RiskExposureByProcessChartItem,
  RiskRadarRecord,
  RiskScenarioTableChartItem,
} from "@/types/dashboard";
import { DashboardService } from "@/services/dashboardService";
import BusinessTab from "@/components/Reports/BusinessTab";
import CISOTab from "@/components/Reports/CISOTab";
import { getOrganizationAssets } from "@/pages/api/organization";
import { OrganizationFrameworkControl } from "@/types/reports";
import NistControlScoreCardList from "@/components/NistScore/NistScoreInput";
import {
  getRiskPrioritisedAssetsData,
  getTopOrgRiskScenariosAssets,
} from "../../pages/api/reports";

export default function DashboardContainer() {
  const [currentTab, setCurrentTab] = useState(0);
  const [orgId, setOrgId] = useState<string | null>();
  const [orgFrameworkControls, setOrgFrameworkControls] = useState<
    OrganizationFrameworkControl[]
  >([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [riskExposureProcessChartData, setRiskExposureProcessChartData] =
    useState<RiskExposureByProcessChartItem[]>([]);
  const [riskScenariosTableChartData, setRiskScenariosTableChartData] =
    useState<RiskScenarioTableChartItem[]>([]);
  const [businessUnitSeverityData, setBusinessUnitSeverityData] = useState<
    any[]
  >([]);
  const [businessUnitRadarChartData, setBusinessUnitRadarChartData] = useState<
    RiskRadarRecord[]
  >([]);
  const [topRiskScenarios, setTopRiskScenarios] = useState<any[]>([]);
  const [topAssets, setTopAssets] = useState<any[]>([]);
  const [riskPrioritisedAssetsData, setRiskPrioritisedAssetsData] = useState<
    any[]
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
          riskExposureProcessChartRes,
          riskScenarioTableChartRes,
          businessUnitHeatmapChartRes,
          businessUnitRadarChartRes,
          assetRes,
          topRiskScenariosAssetsRes,
          riskPrioritisedAssetsRes,
        ] = await Promise.all([
          DashboardService.getRiskExposureBusinessProcessChartData(orgId),
          DashboardService.getRiskScenariosTableChartData(orgId),
          DashboardService.getBusinessUnitSeverityHeatmapChartData(orgId),
          DashboardService.getBusinessUnitRadarChartData(orgId),
          getOrganizationAssets(orgId),
          getTopOrgRiskScenariosAssets(orgId),
          getRiskPrioritisedAssetsData(orgId),
        ]);
        setRiskExposureProcessChartData(riskExposureProcessChartRes.data ?? []);
        setRiskScenariosTableChartData(riskScenarioTableChartRes.data ?? []);
        setBusinessUnitSeverityData(businessUnitHeatmapChartRes.data ?? []);
        setBusinessUnitRadarChartData(businessUnitRadarChartRes.data ?? []);
        setAssetData(assetRes.data ?? []);
        setTopRiskScenarios(topRiskScenariosAssetsRes.data.riskScenarios ?? []);
        setTopAssets(topRiskScenariosAssetsRes.data.assets ?? []);
        setRiskPrioritisedAssetsData(riskPrioritisedAssetsRes.data ?? []);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    }
    fetchData();
  }, [orgId]);

  async function fetchOrganizationNistControlScores() {
    if (!orgId) return;
    const nistControlScores =
      await DashboardService.getOrganizationNistControlScores(orgId);
    setOrgFrameworkControls(nistControlScores.data ?? []);
  }
  useEffect(() => {
    if (!orgId) return;

    fetchOrganizationNistControlScores();
  }, [orgId]);

  const handleSaveOrganizationNistControls = async (
    scores: OrganizationFrameworkControl[]
  ) => {
    if (!orgId) return;
    const res = await DashboardService.updateOrganizationNistControlScores(
      orgId,
      scores
    );
    await fetchOrganizationNistControlScores();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (!orgId) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography>User is not assigned to any organization</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        p={5}
        pb="0px !important"
        sx={{
          height: "calc(100vh - 128px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            mb: 3,
          }}
          variant="scrollable"
          scrollButtons
        >
          {dashboardPageTabs.map((item, index) => (
            <Tab
              key={index}
              label={
                <Typography variant="body2" fontWeight={550}>
                  {item.tabName}
                </Typography>
              }
              sx={{
                border:
                  currentTab == item.tabVlaue
                    ? "1px solid #E7E7E8"
                    : "1px solid transparent",
                borderRadius: "8px 8px 0px 0px",
                borderBottom:
                  currentTab == item.tabVlaue
                    ? "1px solid transparent"
                    : "1px solid #E7E7E8",
                maxHeight: 48,
              }}
            />
          ))}
        </Tabs>
        {/* Business Tab Content */}
        {currentTab === 0 && (
          <>
            <BusinessTab
              riskExposureProcessChartData={riskExposureProcessChartData}
            />
          </>
        )}
        {/* ERM Tab Content */}
        {currentTab === 1 && (
          <>
            <ERMTab
              riskScenariosTableChartData={riskScenariosTableChartData}
              businessUnitSeverityData={businessUnitSeverityData}
              businessUnitRadarChartData={businessUnitRadarChartData}
              topAssets={topAssets}
              topRiskScenarios={topRiskScenarios}
            />
          </>
        )}
        {/* CISO Tab Content */}
        {currentTab === 2 && (
          <>
            <CISOTab
              assetData={assetData}
              topAssets={topAssets}
              riskPrioritisedAssets={riskPrioritisedAssetsData}
            />
          </>
        )}
        {/* CIO Tab Content */}
        {currentTab === 3 && (
          <>
            <BoardTab />
          </>
        )}
        {currentTab === 4 && (
          <>
            <NistControlScoreCardList
              controls={orgFrameworkControls}
              onSave={handleSaveOrganizationNistControls}
            />
          </>
        )}
      </Box>
    </>
  );
}
