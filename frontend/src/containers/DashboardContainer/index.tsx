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
  Typography,
} from "@mui/material";
import RiskExposureByProcessChart from "@/components/Reports/BusinessProcessRiskDashboard/ProcessesRiskExposureBarChart";
import { useEffect, useState } from "react";
import SelectedProcessDialogBox from "@/components/Reports/BusinessProcessRiskDashboard/SelectedProcessDialogBox";
import {
  getBusinessProcessRiskDashboardData,
  getBusinessUnitSeverityData,
} from "@/utils/mockupData";
import HeatmapChart from "@/components/Reports/HeatmapChart";

export default function DashboardContainer() {
  const [data, setData] = useState<any[]>([]);
  const [businessUnitSeverityData, setBusinessUnitSeverityData] = useState<
    any[]
  >([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [processes, setProcesses] = useState<any[]>(data);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  useEffect(() => {
    setData(getBusinessProcessRiskDashboardData());
    setBusinessUnitSeverityData(getBusinessUnitSeverityData());
  }, []);

  console.log(businessUnitSeverityData);

  useEffect(() => {
    if (selectedBusinessUnit === "All") {
      setProcesses(data);
    } else {
      setProcesses(
        data.filter((item) => item.businessUnitName === selectedBusinessUnit)
      );
    }
  }, [selectedBusinessUnit, data]);

  const businessUnits = [
    "All",
    ...new Set(data.map((item) => item.businessUnitName)),
  ];

  const processBarChartData = processes.map((item) => ({
    processName: item.processName,
    maxRiskExposure: item.maxRiskExposure,
    maxNetExposure: item.maxNetExposure,
  }));

  const processCriticalityCardItems = [
    {
      cardBackgroundColor: "#214f73",
      cardBorderColor: "#1b415f",
      cardIcon: <ReportIcon sx={{ color: "#ffffff" }} />,
      cardText: "Critical",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "critical"
      ).length,
    },
    {
      cardBackgroundColor: "#31a8b2",
      cardBorderColor: "#298c94",
      cardIcon: <WarningAmberIcon sx={{ color: "#ffffff" }} />,
      cardText: "High",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "high"
      ).length,
    },
    {
      cardBackgroundColor: "#20cfcf",
      cardBorderColor: "#1aa9a9",
      cardIcon: <InfoIcon sx={{ color: "#ffffff" }} />,
      cardText: "Moderate",
      cardTextColor: "#ffffff",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "moderate"
      ).length,
    },
    {
      cardBackgroundColor: "#5af4de",
      cardBorderColor: "#49c9b8",
      cardIcon: <CheckCircleOutlineIcon sx={{ color: "#214f73" }} />,
      cardText: "Low",
      cardTextColor: "#214f73",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "low"
      ).length,
    },
    {
      cardBackgroundColor: "#80fff4",
      cardBorderColor: "#6ad4ca",
      cardIcon: <CheckCircleIcon sx={{ color: "#214f73" }} />,
      cardText: "Very Low",
      cardTextColor: "#214f73",
      processesCount: processes.filter(
        (item) => item.severity.toLowerCase() === "very low"
      ).length,
    },
    {
      cardBackgroundColor: "#f7fffc",
      cardBorderColor: "#d9eae6",
      cardIcon: <AnalyticsIcon sx={{ color: "#214f73" }} />,
      cardText: "Total",
      cardTextColor: "#214f73",
      processesCount: processes.length,
    },
  ];

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
        ? `$ ${
            processes.find((item) => item.processName === selectedProcess)
              ?.maxRiskExposure / 1000000000
          } Bn`
        : `$ ${
            Math.max(
              ...processes.map((item) => item.maxRiskExposure as number)
            ) / 1000000000
          } Bn`,
    },
    {
      title: "Max. Net Exposure",
      value: selectedProcess
        ? `$ ${
            processes.find((item) => item.processName === selectedProcess)
              ?.maxNetExposure / 1000000000
          } Bn`
        : `$ ${
            Math.max(
              ...processes.map((item) => item.maxNetExposure as number)
            ) / 1000000000
          } Bn`,
    },
    {
      title: "Risk Appetite",
      value: processes[0]?.riskAppetite
        ? `$ ${processes[0]?.riskAppetite / 1000000000} Bn`
        : "-",
    },
  ];

  const severityData = [
    { x: "Very Low", y: "Retail Banking", value: 5 },
    { x: "Low", y: "Retail Banking", value: 8 },
    { x: "Moderate", y: "Retail Banking", value: 12 },
    { x: "High", y: "Loan Services", value: 25 },
    { x: "Critical", y: "Retail Banking", value: 10 },
    { x: "High", y: "Corporate Banking", value: 20 },
    { x: "Critical", y: "Corporate Banking", value: 30 },
    { x: "Moderate", y: "Loan Services", value: 15 },
    { x: "Low", y: "Corporate Banking", value: 5 },
    { x: "Moderate", y: "Corporate Banking", value: 12 },
  ];

  const severityOrder = ["Very Low", "Low", "Moderate", "High", "Critical"];

  return (
    <>
      <Box
        p={5}
        sx={{
          height: "calc(100vh - 128px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#121212" }}
          mb={5}
        >
          Business Process Risk Dashboard
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          alignItems={"center"}
          mb={3}
          gap={2}
        >
          <Typography variant="body1">
            Filter by Business Unit to view specific processes
          </Typography>
          <FormControl variant="filled" sx={{ height: "48px", width: "200px" }}>
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
              // riskAppetite={70000000}
              riskAppetite={processes[0]?.riskAppetite / 1000000000}
            />
          </Paper>

          <HeatmapChart
            data={businessUnitSeverityData}
            xAxisLabel="Severity Level"
            yAxisLabel="Business Unit"
            xOrder={severityOrder}
            title="Business Units vs Severity Levels"
            width={800}
            height={400}
          />
        </Box>
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
