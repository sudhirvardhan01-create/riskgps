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

function Reports() {
  const [currentTab, setCurrentTab] = useState(0);
  const [orgData, setOrgData] = useState<any>({});
  const [assetData, setAssetData] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<string | null>();
  const categories: NistControlCategory[] = [
    { id: "ID", code: "ID", name: "Identify" },
    { id: "PR", code: "PR", name: "Protect" },
    { id: "DE", code: "DE", name: "Detect" },
    { id: "RS", code: "RS", name: "Respond" },
    { id: "RC", code: "RC", name: "Recover" },
  ];

  const handleSave = (scores: NistControlScore[]) => {
    // replace with your API call
    console.log("Saving NIST scores:", scores);
  };

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
        const [processRes, assetRes] = await Promise.all([
          getProcessList(orgId),
          getOrganizationAssets(orgId),
        ]);

        setOrgData(processRes.data);
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
        <Tab
          label={
            <Typography variant="body2" fontWeight={550}>
              Nist Scores
            </Typography>
          }
          sx={{
            border:
              currentTab == 2 ? "1px solid #E7E7E8" : "1px solid transparent",
            borderRadius: "8px 8px 0px 0px",
            borderBottom:
              currentTab == 1 ? "1px solid transparent" : "1px solid #E7E7E8",
            maxHeight: 48,
          }}
        />
      </Tabs>

      {/* Tab Content */}
      {currentTab === 0 && (
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
      {currentTab === 1 && (
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
      {currentTab === 2 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 600,
            overflow: "auto",
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
