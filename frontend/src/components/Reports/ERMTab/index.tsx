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
import VerticalSingleBarChart from "../VerticalSingleBarChart";
import TableViewHeader from "../BusinessProcessRiskDashboard/TableViewHeader";
import TableViewRiskScenarioCard from "../BusinessProcessRiskDashboard/TableViewRiskScenarioCard";
import { useEffect, useState } from "react";
import { RiskRadarRecord, RiskScenarioTableChartItem } from "@/types/dashboard";
import { riskScenariosHeaderDataWithProcess } from "@/constants/constant";
import { BusinessUnitRadarChart } from "../BusinessProcessRiskDashboard/BusinessUnitRadarChart";
import HeatmapChart from "../HeatmapChart";

interface Props {
  riskScenariosTableChartData: RiskScenarioTableChartItem[];
  businessUnitSeverityData: any[];
  businessUnitRadarChartData: RiskRadarRecord[];
}

const ERMTab: React.FC<Props> = ({
  riskScenariosTableChartData,
  businessUnitSeverityData,
  businessUnitRadarChartData,
}) => {
  const [riskScenariosTableChart, setRiskScenariosTableChart] = useState<
    RiskScenarioTableChartItem[]
  >(riskScenariosTableChartData);
  const [selectedCIATableChart, setSelectedCIATableChart] =
    useState<string>("All");
  const [selectedProcessTableChart, setSelectedProcessTableChart] =
    useState<string>("All");

  useEffect(() => {
    let filtered = [...riskScenariosTableChartData];

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
    selectedCIATableChart,
    selectedProcessTableChart,
    riskScenariosTableChartData,
  ]);

  const processesForDropdown = [
    ...new Set(riskScenariosTableChartData.map((i) => i.businessProcess)),
  ];

  const topAssets = [
    {
      name: "Customer Database",
      value: 3.3,
    },
    {
      name: "Underwriting Application",
      value: 3,
    },
    {
      name: "Banking Application",
      value: 2.2,
    },
    {
      name: "Loan Application",
      value: 2.1,
    },
    {
      name: "Payment Rails",
      value: 1.7,
    },
  ];

  const topRiskScenarios = [
    {
      name: "Customer account data is exposed",
      value: 3.2,
    },
    {
      name: "Customer accounts cannot be managed for 1 week",
      value: 3.1,
    },
    {
      name: "Customer loan data is exposed",
      value: 3.1,
    },
    {
      name: "Customer account data is corrupted and no longer accurate",
      value: 3,
    },
    {
      name: "ATM data is exposed",
      value: 2.5,
    },
  ];

  const severityOrder = ["Very Low", "Low", "Moderate", "High", "Critical"];

  return (
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
        <Grid size={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#fafafa",
              height: "450px",
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
              Top 5 Risk Scenarios
            </Typography>
            <VerticalSingleBarChart
              data={topRiskScenarios}
              labelYAxis="Net Risk Score"
              height={380}
            />
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#fafafa",
              height: "450px",
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
              Top 5 Assets
            </Typography>
            <VerticalSingleBarChart
              data={topAssets}
              labelYAxis="Net Risk Score"
              height={380}
              barColor="#233dff"
            />
          </Paper>
        </Grid>
        <Grid size={12}>
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
                    {processesForDropdown.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <Stack>
              <TableViewHeader
                headerData={riskScenariosHeaderDataWithProcess}
              />
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default ERMTab;
