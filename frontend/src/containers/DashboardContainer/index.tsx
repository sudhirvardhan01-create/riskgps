import ProcessCriticalityCard from "@/components/Reports/BusinessProcessRiskDashboard/ProcessCriticalityCard";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import RiskExposureByProcessChart from "@/components/Reports/BusinessProcessRiskDashboard/ProcessesRiskExposureBarChart";
import { useEffect, useState } from "react";
import SelectedProcessDialogBox from "@/components/Reports/BusinessProcessRiskDashboard/SelectedProcessDialogBox";
import HeatmapChart from "@/components/Reports/HeatmapChart";
import { BusinessUnitRadarChart } from "@/components/Reports/BusinessProcessRiskDashboard/BusinessUnitRadarChart";
import { RiskExposureByProcessChartItem } from "@/types/dashboard";
import Cookies from "js-cookie";
import { DashboardService } from "@/services/dashboardService";

type RiskMetric =
  | "Total Risk Exposure"
  | "Average Net Exposure"
  | "Financial Impact"
  | "Operational Impact"
  | "Regulatory Impact"
  | "Reputational Impact";

interface RiskRadarRecord {
  metric: RiskMetric;
  values: Record<string, number>; // dynamic BUs
}

export default function DashboardContainer() {
  const [currentTab, setCurrentTab] = useState(0);
  const [orgId, setOrgId] = useState<string | null>();
  const [riskExposureProcessChartData, setRiskExposureProcessChartData] =
    useState<RiskExposureByProcessChartItem[]>([]);
  const [businessUnitSeverityData, setBusinessUnitSeverityData] = useState<
    any[]
  >([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [processes, setProcesses] = useState<RiskExposureByProcessChartItem[]>(
    riskExposureProcessChartData
  );
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

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
        const [riskExposureProcessChartRes, businessUnitHeatmapChartRes] =
          await Promise.all([
            DashboardService.getRiskExposureBusinessProcessChartData(orgId),
            DashboardService.getBusinessUnitSeverityHeatmapChartData(orgId),
          ]);
        setRiskExposureProcessChartData(riskExposureProcessChartRes.data ?? []);
        setBusinessUnitSeverityData(businessUnitHeatmapChartRes.data ?? []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    fetchData();
  }, [orgId]);

  useEffect(() => {
    if (selectedBusinessUnit === "All") {
      setProcesses(riskExposureProcessChartData);
    } else {
      setProcesses(
        riskExposureProcessChartData.filter(
          (item) => item.businessUnitName === selectedBusinessUnit
        )
      );
    }
  }, [selectedBusinessUnit, riskExposureProcessChartData]);

  const businessUnits = [
    "All",
    ...new Set(
      riskExposureProcessChartData.map((item) => item.businessUnitName)
    ),
  ];

  const processBarChartData = processes.map((item) => ({
    processName: item.processName,
    maxRiskExposure: item.maxRiskExposure,
    maxNetExposure: item.maxNetExposure,
  }));

  const processCriticalityCardItems = [
    {
      cardBackgroundColor: "primary.900",
      cardBorderColor: "#04139A",
      cardIcon: <ReportIcon sx={{ color: "#ffffff" }} />,
      cardText: "Critical",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "critical"
      ).length,
    },
    {
      cardBackgroundColor: "primary.700",
      cardBorderColor: "#12229d",
      cardIcon: <WarningAmberIcon sx={{ color: "#ffffff" }} />,
      cardText: "High",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "high"
      ).length,
    },
    {
      cardBackgroundColor: "primary.500",
      cardBorderColor: "#233dff",
      cardIcon: <InfoIcon sx={{ color: "#ffffff" }} />,
      cardText: "Moderate",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "moderate"
      ).length,
    },
    {
      cardBackgroundColor: "primary.300",
      cardBorderColor: "#6f80eb",
      cardIcon: <CheckCircleOutlineIcon sx={{ color: "#214f73" }} />,
      cardText: "Low",
      cardTextColor: "#214f73",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "low"
      ).length,
    },
    {
      cardBackgroundColor: "primary.100",
      cardBorderColor: "#5cb6f9",
      cardIcon: <CheckCircleIcon sx={{ color: "#214f73" }} />,
      cardText: "Very Low",
      cardTextColor: "#214f73",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "very low"
      ).length,
    },
    {
      cardBackgroundColor: "#e0ecedff",
      cardBorderColor: "#cae8ff",
      cardIcon: <AnalyticsIcon sx={{ color: "#214f73" }} />,
      cardText: "Total",
      cardTextColor: "#214f73",
      processesCount: processes.length,
    },
  ];

  const formatBn = (value?: number) =>
    value != null ? `$ ${(value / 1_000_000_000).toFixed(2)} Bn` : "-";

  const riskExposureCardData = [
    {
      title: "Total Risk Scenarios",
      value: selectedProcess
        ? processes.find((item) => item.processName === selectedProcess)?.risks
            .length
        : processes
            .map((item) => item?.risks.length)
            .reduce((a, b) => a + b, 0),
    },
    {
      title: "Max. Risk Exposure",
      value: selectedProcess
        ? formatBn(
            processes.find((item) => item.processName === selectedProcess)
              ?.maxRiskExposure
          )
        : formatBn(
            Math.max(...processes.map((item) => item.maxRiskExposure ?? 0))
          ),
    },
    {
      title: "Max. Net Exposure",
      value: selectedProcess
        ? formatBn(
            processes.find((item) => item.processName === selectedProcess)
              ?.maxNetExposure
          )
        : formatBn(
            Math.max(...processes.map((item) => item.maxNetExposure ?? 0))
          ),
    },
    {
      title: "Risk Appetite",
      value: processes[0]?.riskAppetite
        ? `$ ${processes[0]?.riskAppetite / 1000000000} Bn`
        : "-",
    },
  ];

  const severityOrder = ["Very Low", "Low", "Moderate", "High", "Critical"];

  const riskData: RiskRadarRecord[] = [
    {
      metric: "Total Risk Exposure",
      values: {
        Finance: 2_400_000_000, // $2.4B
        IT: 950_000_000, // $950M
        HR: 350_000_000, // $350M
      },
    },
    {
      metric: "Average Net Exposure",
      values: {
        Finance: 480_000_000, // $480M
        IT: 120_000_000,
        HR: 45_000_000,
      },
    },
    {
      metric: "Financial Impact",
      values: {
        Finance: 1_800_000_000,
        IT: 400_000_000,
        HR: 150_000_000,
      },
    },
    {
      metric: "Operational Impact",
      values: {
        Finance: 320_000_000,
        IT: 870_000_000,
        HR: 210_000_000,
      },
    },
    {
      metric: "Regulatory Impact",
      values: {
        Finance: 900_000_000,
        IT: 250_000_000,
        HR: 90_000_000,
      },
    },
    {
      metric: "Reputational Impact",
      values: {
        Finance: 700_000_000,
        IT: 180_000_000,
        HR: 60_000_000,
      },
    },
  ];

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
          <Tab
            label={
              <Typography variant="body2" fontWeight={550}>
                Process
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
                Asset
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
        {currentTab === 0 ? (
          // Process Tab Content
          <>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={3}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#121212" }}
              >
                Business Process Risk Dashboard
              </Typography>
              <FormControl
                variant="filled"
                sx={{ height: "48px", width: "200px" }}
              >
                <InputLabel id="business-unit-label">Business Unit</InputLabel>
                <Select
                  labelId="business-unit-label"
                  value={selectedBusinessUnit}
                  onChange={(e) => {
                    setSelectedBusinessUnit(e.target.value);
                  }}
                >
                  {businessUnits.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto", // scroll only vertical
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mb: 1 }}
                >
                  Process Criticality Overview
                </Typography>
                <Grid container spacing={2}>
                  {processCriticalityCardItems.map((item, index) => (
                    <Grid size={{ xs: 2 }} key={index}>
                      <ProcessCriticalityCard
                        cardBackgroundColor={item.cardBackgroundColor}
                        cardBorderColor={item.cardBorderColor}
                        cardIcon={item.cardIcon}
                        cardText={item.cardText}
                        cardTextColor={item.cardTextColor}
                        processesCount={item.processesCount}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "#fafafa",
                      height: "530px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textAlign="left"
                      sx={{ mb: 2 }}
                    >
                      Business Units(Y) vs Severity Levels(X)
                    </Typography>
                    <HeatmapChart
                      data={businessUnitSeverityData}
                      xAxisLabel="Severity Level"
                      yAxisLabel="Business Unit"
                      xOrder={severityOrder}
                      width={535}
                      height={400}
                    />
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "#fafafa",
                      height: "530px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textAlign="left"
                      sx={{ mb: 2 }}
                    >
                      Business Units vs Severity Levels
                    </Typography>
                    <BusinessUnitRadarChart data={riskData} />
                  </Paper>
                </Grid>
              </Grid>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  height: "750px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mb: 2 }}
                >
                  Risk Exposure by Business Process
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    width: "100%",
                    mb: 2,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Grid container spacing={2} width={"100%"}>
                    {riskExposureCardData.map((item, index) => (
                      <Grid size={3} key={index}>
                        <Box
                          sx={{
                            border: `1px solid #d0ccccff`,
                            backgroundColor: "#fafafa",
                            borderRadius: 2,
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "start",
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body1" color="primary.main">
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
                <RiskExposureByProcessChart
                  data={processBarChartData}
                  selectedProcess={selectedProcess}
                  setSelectedProcess={setSelectedProcess}
                  riskAppetite={processes[0]?.riskAppetite / 1000000000}
                />
              </Paper>
            </Box>
          </>
        ) : (
          //Asset Tab Content
          <>
            <Typography>Asset Tab Content here</Typography>
          </>
        )}
      </Box>

      {selectedProcess && (
        <SelectedProcessDialogBox
          selectedProcess={selectedProcess}
          setSelectedProcess={setSelectedProcess}
          processData={processes.find(
            (item) => item.processName === selectedProcess
          )}
        />
      )}
    </>
  );
}
