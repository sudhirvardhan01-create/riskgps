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
import AssetSummaryRow from "@/components/AssetLevelReports/AssetSummaryRow/indext";
import AssetControlFamilyLineChart from "@/components/AssetLevelReports/AssetControlFamilyLineChart";
import AssetStrengthBarChart from "@/components/AssetLevelReports/AssetStrengthBarChart";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HorizontalBarChart from "../CustomReports/HorizontalBarChart";
import WorldMap from "../CustomReports/WorldMap";
import { transformAssetData } from "@/utils/utility";
import AssetTableViewContainer from "@/components/AssetLevelReports/AssetTableViewContainer";
import OrgId from "@/pages/orgManagement/[orgId]";
import { DashboardService } from "@/services/dashboardService";
import Cookies from "js-cookie";
import { AssetLevelReportsData } from "@/types/reports";

const PieChartComponent = dynamic(() => import("../CustomReports/PieChart"), {
  ssr: false,
});

export default function CISOTab({ assetData, tooltipData }: any) {
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
  const businessUnits = [
    "All",
    ...Array.from(new Set(assetLevelReportsData.map((a) => a.businessUnit))),
  ];

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
      const [res] = await Promise.all([
        DashboardService.getAssetLevelChartsData(orgId),
      ]);
      const data = res?.data;
      console.log(res);
      if (selectedBusinessUnit === "All") {
        setAssetLevelReportsData(data);
        setSelectedAssetId(data[0].assetId);
      } else {
        const filteredData = data.filter(
          (a: AssetLevelReportsData) => a.businessUnit === selectedBusinessUnit
        );
        setAssetLevelReportsData(filteredData);
        setSelectedAssetId(filteredData[0].assetId);
      }
    }
    fetchData();
  }, [orgId, selectedBusinessUnit]);

  const selectedAsset =
    assetLevelReportsData.find((a) => a.assetId === selectedAssetId) ??
    assetLevelReportsData[0];

  const assetRiskScoresData = [
    {
      assetName: "Customer Database",
      inherentRiskScore: 3.6,
      netRiskScore: 3.3,
    },
    {
      assetName: "Banking Application",
      inherentRiskScore: 3.6,
      netRiskScore: 2.2,
    },
    {
      assetName: "Payment Rails",
      inherentRiskScore: 3.4,
      netRiskScore: 1.7,
    },
    {
      assetName: "Fraud Application",
      inherentRiskScore: 2.5,
      netRiskScore: 1.3,
    },
    {
      assetName: "Underwriting Application",
      inherentRiskScore: 3.5,
      netRiskScore: 3,
    },
    {
      assetName: "Loan Application",
      inherentRiskScore: 3.6,
      netRiskScore: 2.1,
    },
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

  return (
    <>
      {/* <Stack
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
      </Stack> */}
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
        <Box
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
        </Box>
        <AssetSummaryRow assets={assetLevelReportsData} />
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
            <AssetControlFamilyLineChart asset={selectedAsset} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <AssetStrengthBarChart assets={assetLevelReportsData} />
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
                Top 5 Assets
              </Typography>
              <VerticalSingleBarChart
                data={topAssets}
                labelYAxis="Net Risk Score"
                height={460}
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
                Risk Prioritised Assets
              </Typography>
              <AssetsRiskScoreBarChart data={assetRiskScoresData} />
            </Paper>
          </Grid>
          <Grid size={12}>
            <AssetTableViewContainer />
          </Grid>
          {/* ===== LEFT CARD: GEO MAP ===== */}
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          <Grid size={{ xs: 6 }}>
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
                Assets by Geography
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

          {/* ===== RIGHT CARD: BAR CHARTS ===== */}
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          <Grid size={{ xs: 6 }}>
            {/* ---- Asset Dependencies ---- */}
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
                Asset / Critical Process Dependencies
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <HorizontalBarChart data={asset_data} />
              </Box>
            </Paper>
          </Grid>

          {/* ---- Vendor Dependencies ---- */}
          {/* <Grid size={12}> */}
          <Grid size={6}>
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
                Vendors / Critical Process Dependencies
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
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
          <Grid size={{ xs: 6 }}>
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
                Networks / Critical Process Dependencies
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
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
        </Grid>
      </Box>
    </>
  );
}
