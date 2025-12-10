import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import AssetsRiskScoreBarChart from "../BoardTab/AssetsRiskScoreBarChart";
import VerticalSingleBarChart from "../VerticalSingleBarChart";
import AssetSummaryRow from "@/components/AssetLevelReports/AssetSummaryRow/indext";
import AssetControlFamilyLineChart from "@/components/AssetLevelReports/AssetControlFamilyLineChart";
import AssetStrengthBarChart from "@/components/AssetLevelReports/AssetStrengthBarChart";
import { useState } from "react";
import dynamic from "next/dynamic";
import HorizontalBarChart from "../CustomReports/HorizontalBarChart";
import WorldMap from "../CustomReports/WorldMap";
import { transformAssetData } from "@/utils/utility";
import AssetTableViewContainer from "@/components/AssetLevelReports/AssetTableViewContainer";

interface AssetControlProfile {
  assetName: string;
  businessUnit: string;
  businessProcess: string;
  controlStrength: number;
  band: string;
  metrics: any[];
}

const mockAssetProfiles: AssetControlProfile[] = [
  {
    assetName: "Banking Application",
    businessUnit: "Retail Banking",
    businessProcess: "Electronic Banking",
    controlStrength: 3.8,
    band: "High",
    metrics: [
      {
        id: "GV.OC",
        familyLabel: "GV.OC",
        orgCurrent: 2.5,
        orgTarget: 3.0,
        assetCurrent: 0.3,
      },
      {
        id: "GV.OV",
        familyLabel: "GV.OV",
        orgCurrent: 3.0,
        orgTarget: 3.5,
        assetCurrent: 0.3,
      },
      {
        id: "GV.PO",
        familyLabel: "GV.PO",
        orgCurrent: 4.0,
        orgTarget: 3.2,
        assetCurrent: 0.3,
      },
      {
        id: "ID.IM",
        familyLabel: "ID.IM",
        orgCurrent: 2.8,
        orgTarget: 3.5,
        assetCurrent: 2.1,
      },
      {
        id: "ID.RA",
        familyLabel: "ID.RA",
        orgCurrent: 3.0,
        orgTarget: 3.8,
        assetCurrent: 5.5,
      },
      {
        id: "PR.AA",
        familyLabel: "PR.AA",
        orgCurrent: 2.9,
        orgTarget: 3.4,
        assetCurrent: 5.0,
      },
      {
        id: "PR.DS",
        familyLabel: "PR.DS",
        orgCurrent: 2.0,
        orgTarget: 3.0,
        assetCurrent: 1.0,
      },
      {
        id: "PR.PS",
        familyLabel: "PR.PS",
        orgCurrent: 2.8,
        orgTarget: 3.2,
        assetCurrent: 3.0,
      },
      {
        id: "DE.AE",
        familyLabel: "DE.AE",
        orgCurrent: 3.0,
        orgTarget: 3.0,
        assetCurrent: 3.2,
      },
      {
        id: "RS.AN",
        familyLabel: "RS.AN",
        orgCurrent: 3.0,
        orgTarget: 3.0,
        assetCurrent: 0.0,
      },
      {
        id: "RC.RP",
        familyLabel: "RC.RP",
        orgCurrent: 3.0,
        orgTarget: 3.0,
        assetCurrent: 0.0,
      },
    ],
  },
  {
    assetName: "Payment Rails",
    businessUnit: "Retail Banking",
    businessProcess: "ACH",
    controlStrength: 2.7,
    band: "Moderate",
    metrics: [],
  },
  {
    assetName: "Fraud Application",
    businessUnit: "Retail Banking",
    businessProcess: "Fraud Monitoring",
    controlStrength: 2.7,
    band: "Moderate",
    metrics: [],
  },
  {
    assetName: "Customer Database",
    businessUnit: "Retail Banking",
    businessProcess: "Account Management Process",
    controlStrength: 1.2,
    band: "Critical",
    metrics: [],
  },
];

const PieChartComponent = dynamic(() => import("../CustomReports/PieChart"), {
  ssr: false,
});

export default function CISOTab({ assetData, tooltipData }: any) {
  const { asset_data, vendor_data, network_data, cityData } =
    transformAssetData(assetData);

  const [selectedAssetName, setSelectedAssetName] = useState<string>(
    "Banking Application"
  );

  const selectedAsset =
    mockAssetProfiles.find((a) => a.assetName === selectedAssetName) ??
    mockAssetProfiles[0];

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
      <AssetSummaryRow assets={mockAssetProfiles} />
      <Grid size={12}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {mockAssetProfiles.map((asset) => (
            <Chip
              key={asset.assetName}
              label={asset.assetName}
              size="small"
              clickable
              onClick={() => setSelectedAssetName(asset.assetName)}
              color={
                asset.assetName === selectedAssetName ? "primary" : "default"
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
          <AssetStrengthBarChart assets={mockAssetProfiles} />
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
  );
}
