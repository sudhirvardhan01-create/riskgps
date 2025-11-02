import RiskDashboard from "@/components/Reports/CustomReports";
import ProcessAssetFlow from "@/components/Reports/ProcessAssetFlow";
import { ChartProcess } from "@/types/reports";
import { transformProcessData } from "@/utils/utility";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getOrganizationAssets } from "../api/organization";
import { getProcessList } from "../api/reports";
import Cookies from "js-cookie";

function Reports() {
  const [currentTab, setCurrentTab] = useState(0);
  const [processData, setProcessData] = useState<ChartProcess[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<string | null>(
    "71e715aa-ef8c-4af7-8292-127e4c0b5b39"
  );

  // useEffect(() => {
  //   // ✅ Only run on client
  //   if (typeof window !== "undefined") {
  //     try {
  //       const cookieUser = Cookies.get("user");
  //       if (cookieUser) {
  //         const parsed = JSON.parse(cookieUser);
  //         setOrgId(parsed?.orgId || parsed?.org_id || null);
  //       }
  //     } catch (err) {
  //       console.warn("Invalid or missing cookie:", err);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    async function fetchData() {
      if (!orgId) return;
      try {
        const [processRes, assetRes] = await Promise.all([
          getProcessList(orgId),
          getOrganizationAssets(orgId),
        ]);

        const formatted = transformProcessData(processRes.data);
        setProcessData(formatted);
        setAssetData(assetRes.data ?? []);
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
        }}
        variant="scrollable"
        scrollButtons
      >
        <Tab
          label={
            <Typography variant="body2" fontWeight={550}>
              Asset View
            </Typography>
          }
          sx={{
            border:
              currentTab == 0 ? "1px solid #E7E7E8" : "1px solid transparent",
            borderRadius: "8px 8px 0px 0px",
            borderBottom:
              currentTab == 0 ? "1px solid transparent" : "1px solid #E7E7E8",
            maxHeight: 48,
          }}
        />
        <Tab
          label={
            <Typography variant="body2" fontWeight={550}>
              Process View
            </Typography>
          }
          sx={{
            border:
              currentTab == 1 ? "1px solid #E7E7E8" : "1px solid transparent",
            borderRadius: "8px 8px 0px 0px",
            borderBottom:
              currentTab == 1 ? "1px solid transparent" : "1px solid #E7E7E8",
            maxHeight: 48,
          }}
        />
      </Tabs>

      {/* Tab Content */}
      {currentTab === 0 ? (
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
      ) : (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <ProcessAssetFlow processes={processData} />
        </Box>
      )}
    </Box>
  );
}

export default Reports;
