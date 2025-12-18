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
import { constants } from "@/utils/constants";

interface Props {
  riskScenariosTableChartData: RiskScenarioTableChartItem[];
  businessUnitSeverityData: any[];
  businessUnitRadarChartData: RiskRadarRecord[];
  topRiskScenarios: any[];
  topAssets: any[];
}

const ERMTab: React.FC<Props> = ({
  riskScenariosTableChartData,
  businessUnitSeverityData,
  businessUnitRadarChartData,
  topRiskScenarios,
  topAssets,
}) => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [riskScenariosTableChart, setRiskScenariosTableChart] = useState<
    RiskScenarioTableChartItem[]
  >(riskScenariosTableChartData);
  // const [selectedCIATableChart, setSelectedCIATableChart] =
  //   useState<string>("All");
  const [selectedProcessTableChart, setSelectedProcessTableChart] =
    useState<string>("All");

  useEffect(() => {
    let filtered = [...riskScenariosTableChartData];

    // if (selectedCIATableChart !== "All") {
    //   filtered = filtered.filter(
    //     (item) => item.riskScenarioCIAMapping === selectedCIATableChart
    //   );
    // }

    if (selectedProcessTableChart !== "All") {
      filtered = filtered.filter(
        (item) => item.businessProcess === selectedProcessTableChart
      );
    }

    setRiskScenariosTableChart(filtered);
  }, [
    // selectedCIATableChart,
    selectedProcessTableChart,
    riskScenariosTableChartData,
  ]);

  const processesForDropdown = [
    ...new Set(riskScenariosTableChartData.map((i) => i.businessProcess)),
  ];

  const severityOrder = ["Very Low", "Low", "Moderate", "High", "Critical"];

  const businessUnits = [
    "All",
    ...new Set(riskScenariosTableChartData.map((item) => item.businessUnit)),
  ];

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        alignItems={"center"}
        mb={3}
      >
        <FormControl variant="outlined" sx={{ height: "48px", width: "200px" }}>
          <InputLabel
            id="business-unit-label"
            shrink
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            Business Unit
          </InputLabel>
          <Select
            labelId="business-unit-label"
            value={selectedBusinessUnit}
            onChange={(e) => {
              setSelectedBusinessUnit(e.target.value);
            }}
            sx={{ borderRadius: "8px" }}
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
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
                color="text.primary"
              >
                {constants.buHeatmapChart}
              </Typography>
              <HeatmapChart
                data={businessUnitSeverityData}
                xAxisLabel="Severity Level"
                yAxisLabel="Business Unit"
                xOrder={severityOrder}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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
                color="text.primary"
              >
                {constants.riskImpactRadarChart}
              </Typography>
              <BusinessUnitRadarChart data={businessUnitRadarChartData} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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
                {constants.topRiskScenarios}
              </Typography>
              <VerticalSingleBarChart
                data={topRiskScenarios}
                labelYAxis="Residual Risk Score"
                height={380}
                labelXAxis="Risk Scenarios"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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
                {constants.topAssets}
              </Typography>
              <VerticalSingleBarChart
                data={topAssets}
                labelYAxis="Residual Risk Score"
                height={380}
                barColor="#233dff"
                labelXAxis="Assets"
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
                  {constants.riskScenariosTableChart}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  spacing={2}
                >
                  <FormControl
                    variant="outlined"
                    sx={{ height: "48px", width: "200px" }}
                  >
                    <InputLabel
                      id="process-table-chart-label"
                      shrink
                      sx={{ backgroundColor: "#fafafa" }}
                    >
                      Business Process
                    </InputLabel>
                    <Select
                      labelId="process-table-chart-label"
                      value={selectedProcessTableChart}
                      onChange={(e) => {
                        setSelectedProcessTableChart(e.target.value);
                      }}
                      sx={{ borderRadius: "8px" }}
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
                      riskExposure={`$ ${(
                        item.riskExposure / 1000000000
                      ).toFixed(2)} Bn`}
                      riskExposureLevel={item.riskExposureLevel}
                      netExposure={`$ ${(item.netExposure / 1000000000).toFixed(
                        2
                      )} Bn`}
                      netExposureLevel={item.netExposureLevel}
                      processName={item.businessProcess}
                      showCIAColumn={false}
                    />
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ERMTab;
