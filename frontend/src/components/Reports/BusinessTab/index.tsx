import { RiskExposureByProcessChartItem } from "@/types/dashboard";
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
import RiskExposureByProcessChart from "../BusinessProcessRiskDashboard/ProcessesRiskExposureBarChart";
import { useEffect, useState } from "react";
import SelectedProcessDialogBox from "../BusinessProcessRiskDashboard/SelectedProcessDialogBox";
import ProcessCriticalityCard from "../BusinessProcessRiskDashboard/ProcessCriticalityCard";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";

interface BusinessTabProps {
  riskExposureProcessChartData: RiskExposureByProcessChartItem[];
}

const BusinessTab: React.FC<BusinessTabProps> = ({
  riskExposureProcessChartData,
}) => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [processes, setProcesses] = useState<RiskExposureByProcessChartItem[]>(
    riskExposureProcessChartData
  );
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

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

  const businessUnits = [
    "All",
    ...new Set(
      riskExposureProcessChartData.map((item) => item.businessUnitName)
    ),
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

export default BusinessTab;
