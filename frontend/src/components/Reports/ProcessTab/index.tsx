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
import ProcessCriticalityCard from "../BusinessProcessRiskDashboard/ProcessCriticalityCard";
import HeatmapChart from "../HeatmapChart";
import { BusinessUnitRadarChart } from "../BusinessProcessRiskDashboard/BusinessUnitRadarChart";
import RiskExposureByProcessChart from "../BusinessProcessRiskDashboard/ProcessesRiskExposureBarChart";
import TableViewHeader from "../BusinessProcessRiskDashboard/TableViewHeader";
import TableViewRiskScenarioCard from "../BusinessProcessRiskDashboard/TableViewRiskScenarioCard";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useEffect, useState } from "react";
import {
  RiskExposureByProcessChartItem,
  RiskRadarRecord,
  RiskScenarioTableChartItem,
} from "@/types/dashboard";
import { riskScenariosHeaderDataWithProcess } from "@/constants/constant";
import SelectedProcessDialogBox from "../BusinessProcessRiskDashboard/SelectedProcessDialogBox";

interface ProcessTabProps {
  riskExposureProcessChartData: RiskExposureByProcessChartItem[];
  businessUnitSeverityData: any[];
  riskScenariosTableChartData: RiskScenarioTableChartItem[];
  businessUnitRadarChartData: RiskRadarRecord[];
}

const ProcessTab: React.FC<ProcessTabProps> = ({
  riskExposureProcessChartData,
  businessUnitSeverityData,
  riskScenariosTableChartData,
  businessUnitRadarChartData,
}) => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [processes, setProcesses] = useState<RiskExposureByProcessChartItem[]>(
    riskExposureProcessChartData
  );
  const [riskScenariosTableChart, setRiskScenariosTableChart] = useState<
    RiskScenarioTableChartItem[]
  >(riskScenariosTableChartData);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedCIATableChart, setSelectedCIATableChart] =
    useState<string>("All");
  const [selectedProcessTableChart, setSelectedProcessTableChart] =
    useState<string>("All");

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

  useEffect(() => {
    let filtered = [...riskScenariosTableChartData];

    if (selectedBusinessUnit !== "All") {
      filtered = filtered.filter(
        (item) => item.businessUnit === selectedBusinessUnit
      );
    }

    if (selectedCIATableChart !== "All") {
      filtered = filtered.filter(
        (item) => item.riskScenarioCIAMapping === selectedCIATableChart
      );
    }

    if (selectedProcessTableChart !== "All") {
      filtered = filtered.filter(
        (item) => item.businessProcess === selectedProcessTableChart
      );
    }

    setRiskScenariosTableChart(filtered);
  }, [
    selectedBusinessUnit,
    selectedCIATableChart,
    selectedProcessTableChart,
    riskScenariosTableChartData,
  ]);

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

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        alignItems={"center"}
        mb={3}
      >
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
                width={530}
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
                Business Units - Risk Impact
              </Typography>
              <BusinessUnitRadarChart data={businessUnitRadarChartData} />
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
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="body2" fontWeight={600} textAlign="left">
              Risk Scenarios
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <FormControl
                variant="filled"
                sx={{ height: "48px", width: "200px" }}
              >
                <InputLabel id="cia-table-chart-label">CIA</InputLabel>
                <Select
                  labelId="cia-table-chart-label"
                  value={selectedCIATableChart}
                  onChange={(e) => {
                    setSelectedCIATableChart(e.target.value);
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value={"C"}>C</MenuItem>
                  <MenuItem value={"I"}>I</MenuItem>
                  <MenuItem value={"A"}>A</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                variant="filled"
                sx={{ height: "48px", width: "200px" }}
              >
                <InputLabel id="process-table-chart-label">
                  Business Process
                </InputLabel>
                <Select
                  labelId="process-table-chart-label"
                  value={selectedProcessTableChart}
                  onChange={(e) => {
                    setSelectedProcessTableChart(e.target.value);
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {processes.map((item, index) => (
                    <MenuItem value={item.processName} key={index}>
                      {item.processName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Stack>
            <TableViewHeader headerData={riskScenariosHeaderDataWithProcess} />
            <Stack direction={"column"} spacing={2}>
              {riskScenariosTableChart?.map((item: any, index: number) => (
                <TableViewRiskScenarioCard
                  key={index}
                  riskScenario={item.riskScenario}
                  ciaMapping={item.riskScenarioCIAMapping}
                  riskExposure={`$ ${(item.riskExposure / 1000000000).toFixed(
                    2
                  )} Bn`}
                  riskExposureLevel={item.riskExposureLevel}
                  netExposure={`$ ${(item.netExposure / 1000000000).toFixed(
                    2
                  )} Bn`}
                  netExposureLevel={item.netExposureLevel}
                  processName={item.businessProcess}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>
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
};

export default ProcessTab;
