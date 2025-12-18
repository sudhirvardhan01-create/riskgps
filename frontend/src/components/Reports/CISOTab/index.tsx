import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import AssetsRiskScoreBarChart from "../BoardTab/AssetsRiskScoreBarChart";
import VerticalSingleBarChart from "../VerticalSingleBarChart";
import AssetControlFamilyLineChart from "@/components/AssetLevelReports/AssetControlFamilyLineChart";
import AssetStrengthBarChart from "@/components/AssetLevelReports/AssetStrengthBarChart";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HorizontalBarChart from "../CustomReports/HorizontalBarChart";
import WorldMap from "../CustomReports/WorldMap";
import { transformAssetData } from "@/utils/utility";
import AssetTableViewContainer from "@/components/AssetLevelReports/AssetTableViewContainer";
import { DashboardService } from "@/services/dashboardService";
import Cookies from "js-cookie";
import { AssetLevelReportsData } from "@/types/reports";
import { getProcessList } from "@/pages/api/reports";
import ProcessAssetFlow from "../ProcessAssetFlow";
import ProcessCriticalityCard from "../BusinessProcessRiskDashboard/ProcessCriticalityCard";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { constants } from "@/utils/constants";

const PieChartComponent = dynamic(() => import("../CustomReports/PieChart"), {
  ssr: false,
});

interface CISOTabProps {
  assetData: any;
  topAssets: any[];
  riskPrioritisedAssets: any[];
}

const CISOTab: React.FC<CISOTabProps> = ({
  assetData,
  topAssets,
  riskPrioritisedAssets,
}) => {
  const [orgId, setOrgId] = useState<string | null>();
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");
  const [assetLevelReportsData, setAssetLevelReportsData] = useState<
    AssetLevelReportsData[]
  >([]);
  const { asset_data, vendor_data, network_data, cityData } =
    transformAssetData(assetData);

  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    assetLevelReportsData[0]?.assetId
  );
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [orgData, setOrgData] = useState<any>(null);
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
        const [res, processRes] = await Promise.all([
          DashboardService.getAssetLevelChartsData(orgId),
          getProcessList(orgId),
        ]);
        setOrgData(processRes.data);
        const data = res?.data;
        const businessUNits: string[] = [
          ...Array.from(
            new Set(data.map((a: AssetLevelReportsData) => a.businessUnit))
          ),
        ] as string[];
        setBusinessUnits(["All", ...businessUNits]);
        if (selectedBusinessUnit === "All") {
          setAssetLevelReportsData(data);
          setSelectedAssetId(data[0].assetId);
        } else {
          const filteredData = data.filter(
            (a: AssetLevelReportsData) =>
              a.businessUnit === selectedBusinessUnit
          );
          setAssetLevelReportsData(filteredData);
          setSelectedAssetId(filteredData[0].assetId);
        }
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    }
    fetchData();
  }, [orgId, selectedBusinessUnit]);

  const selectedAsset =
    assetLevelReportsData.find((a) => a.assetId === selectedAssetId) ??
    assetLevelReportsData[0];

  const assets = Array.from(
    new Map(assetLevelReportsData.map((a) => [a.assetId, a])).values()
  );

  const assetSummaryCardItems = useMemo(
    () => ({
      critical: assets.filter((a) => a.residualRiskLevel === "critical").length,
      high: assets.filter((a) => a.residualRiskLevel === "high").length,
      moderate: assets.filter((a) => a.residualRiskLevel === "moderate").length,
      low: assets.filter((a) => a.residualRiskLevel === "low").length,
      veryLow: assets.filter((a) => a.residualRiskLevel === "very low").length,
      total: assets.length,
    }),
    [assets]
  );

  const assetCriticalityCardItems = [
    {
      cardBackgroundColor: "primary.900",
      cardBorderColor: "#04139A",
      cardIcon: <ReportIcon sx={{ color: "#ffffff" }} />,
      cardText: "Critical",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.critical,
      names: assets
        .filter((a) => a.residualRiskLevel === "critical")
        .map((i) => i.asset),
    },
    {
      cardBackgroundColor: "primary.700",
      cardBorderColor: "#12229d",
      cardIcon: <WarningAmberIcon sx={{ color: "#ffffff" }} />,
      cardText: "High",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.high,
      names: assets
        .filter((a) => a.residualRiskLevel === "high")
        .map((i) => i.asset),
    },
    {
      cardBackgroundColor: "primary.500",
      cardBorderColor: "#233dff",
      cardIcon: <InfoIcon sx={{ color: "#ffffff" }} />,
      cardText: "Moderate",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.moderate,
      names: assets
        .filter((a) => a.residualRiskLevel === "moderate")
        .map((i) => i.asset),
    },
    {
      cardBackgroundColor: "primary.300",
      cardBorderColor: "#6f80eb",
      cardIcon: <CheckCircleOutlineIcon sx={{ color: "#214f73" }} />,
      cardText: "Low",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.low,
      names: assets
        .filter((a) => a.residualRiskLevel === "low")
        .map((i) => i.asset),
    },
    {
      cardBackgroundColor: "primary.100",
      cardBorderColor: "#5cb6f9",
      cardIcon: <CheckCircleIcon sx={{ color: "#214f73" }} />,
      cardText: "Very Low",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.veryLow,
      names: assets
        .filter((a) => a.residualRiskLevel === "very low")
        .map((i) => i.asset),
    },
    {
      cardBackgroundColor: "#e0ecedff",
      cardBorderColor: "#cae8ff",
      cardIcon: <AnalyticsIcon sx={{ color: "#214f73" }} />,
      cardText: "Total",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.total,
      names: assets.map((i) => i.asset),
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
        {/* <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            pb: 2,
            backgroundColor: "transparent",
          }}
        >
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            mb={1}
          >
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
        </Box> */}
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
            color="text.primary"
          >
            {constants.assetCriticalityCardsChart}
          </Typography>
          <Grid container spacing={2}>
            {assetCriticalityCardItems.map((item, index) => (
              <Grid size={{ xs: 2 }} key={index}>
                <ProcessCriticalityCard
                  cardBackgroundColor={item.cardBackgroundColor}
                  cardBorderColor={item.cardBorderColor}
                  cardIcon={item.cardIcon}
                  cardText={item.cardText}
                  cardTextColor={item.cardTextColor}
                  processesCount={item.processesCount}
                  names={item.names}
                  module="Assets"
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Grid size={12}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Array.from(
              new Map(assetLevelReportsData.map((a) => [a.assetId, a])).values()
            ).map((asset) => (
              <Chip
                key={asset.assetId}
                label={asset.asset}
                size="small"
                clickable
                onClick={() => setSelectedAssetId(asset.assetId)}
                color={
                  asset.assetId === selectedAssetId ? "primary" : "default"
                }
                sx={{ textTransform: "none" }}
              />
            ))}
          </Stack>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: 520,
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
                {constants.assetControlFamilyLineChart}
              </Typography>
              <AssetControlFamilyLineChart asset={selectedAsset} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: 520,
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
                {constants.assetControlStrengthChart}
              </Typography>
              <AssetStrengthBarChart
                assets={Array.from(
                  new Map(
                    assetLevelReportsData.map((a) => [a.assetId, a])
                  ).values()
                )}
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
              >
                {constants.topAssets}
              </Typography>
              <VerticalSingleBarChart
                data={topAssets}
                labelYAxis="Residual Risk Score"
                height={460}
                labelXAxis="Assets"
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
              >
                {constants.riskPrioritisedAssetChart}
              </Typography>
              <AssetsRiskScoreBarChart data={riskPrioritisedAssets} />
            </Paper>
          </Grid>
          <Grid size={12}>
            <AssetTableViewContainer assets={assetLevelReportsData} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
              >
                {constants.assetsByGeography}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <WorldMap data={cityData} tooltipData={assetData} />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
              >
                {constants.assetsByProcess}
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <HorizontalBarChart data={asset_data} />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
                color="text.primary"
              >
                {constants.assetsByVendor}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  height: "calc(100% - 30px)",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                }}
              >
                <PieChartComponent
                  innerData={[
                    {
                      name: "Total Processes",
                      value: vendor_data.reduce(
                        (sum, item) => sum + (item.value || 0),
                        0
                      ),
                    },
                  ]}
                  outerData={vendor_data}
                  tooltipData={assetData}
                  tooltipKey="thirdPartyName"
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
                color="text.primary"
              >
                {constants.assetsByNetwork}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  height: "calc(100% - 30px)",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                }}
              >
                <PieChartComponent
                  innerData={[
                    {
                      name: "Total Processes",
                      value: network_data.reduce(
                        (sum, item) => sum + (item.value || 0),
                        0
                      ),
                    },
                  ]}
                  outerData={network_data}
                  tooltipData={assetData}
                  tooltipKey="networkName"
                />
              </Box>
            </Paper>
          </Grid>
          <Grid size={12}>
            {orgData && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  height: "100%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mb: 1 }}
                >
                  {constants.orgTreeViewChart}
                </Typography>
                <ProcessAssetFlow data={orgData} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CISOTab;
