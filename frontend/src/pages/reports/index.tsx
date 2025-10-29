import React, { useEffect, useState } from "react";
import ProcessAssetFlow from "@/components/Reports/ProcessAssetFlow";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import RiskDashboard from "@/components/Reports/CustomReports";
import { ChartProcess } from "@/types/reports";
import { transformProcessData } from "@/utils/utility";
import { getProcessList } from "../api/reports";

function Reports() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [chartData, setChartData] = useState<ChartProcess[]>([]);

  useEffect(() => {
    async function fetchData() {
      const processData = await getProcessList();
      const formatted = transformProcessData(processData.data);
      setChartData(formatted);
    }
    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ m: 5, height: "63vh" }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Reports
      </Typography>
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
              Asset Reports
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
              Process Tree
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
      {currentTab == 0 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <RiskDashboard />
        </Box>
      )}

      {/* Tab Content */}
      {currentTab == 1 && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            mb: 0,
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <ProcessAssetFlow processes={chartData} />
        </Box>
      )}
    </Box>
  );
}

export default Reports;
