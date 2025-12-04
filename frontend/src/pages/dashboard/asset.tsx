// pages/reports/AssetControlStrengthDashboard.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

/* ----------------------------------------------------------------
   Mock Data
---------------------------------------------------------------- */

type ControlBand = "Critical" | "High" | "Moderate" | "Low" | "Very Low";

interface AssetRow {
  businessUnit: string;
  businessProcess: string;
  assetName: string;
  controlStrength: number; // 1–5
}

interface ControlMetricPoint {
  id: string;
  familyLabel: string;
  orgCurrent: number;
  orgTarget: number;
  assetCurrent: number;
}

interface AssetControlProfile {
  assetName: string;
  businessUnit: string;
  businessProcess: string;
  controlStrength: number;
  band: ControlBand;
  metrics: ControlMetricPoint[];
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

const assetTableRows: AssetRow[] = [
  {
    businessUnit: "Loan Services",
    businessProcess: "KYC",
    assetName: "Loan Application",
    controlStrength: 3.6,
  },
  {
    businessUnit: "Loan Services",
    businessProcess: "Loan Origination",
    assetName: "Loan Application",
    controlStrength: 3.6,
  },
  {
    businessUnit: "Loan Services",
    businessProcess: "Underwriting",
    assetName: "Underwriting Application",
    controlStrength: 1.2,
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Account Management Process",
    assetName: "Banking Application",
    controlStrength: 3.8,
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Account Management Process",
    assetName: "Customer Database",
    controlStrength: 1.2,
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "ACH",
    assetName: "Payment Rails",
    controlStrength: 2.7,
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Fraud Monitoring",
    assetName: "Fraud Application",
    controlStrength: 2.7,
  },
];

/* ----------------------------------------------------------------
   Cards
---------------------------------------------------------------- */

interface SummaryCardProps {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  icon: React.ReactElement;
  label: string;
  count: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  borderColor,
  backgroundColor,
  textColor,
  icon,
  label,
  count,
}) => (
  <Box
    sx={{
      border: `1px solid ${borderColor}`,
      backgroundColor,
      borderRadius: 2,
      p: 2,
      opacity: 0.9,
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={0.5}
    >
      {icon}
      <Typography color={textColor} fontWeight={600}>
        {count}
      </Typography>
    </Stack>
    <Typography color={textColor}>{label}</Typography>
  </Box>
);

const AssetSummaryRow: React.FC<{ assets: AssetControlProfile[] }> = ({
  assets,
}) => {
  const counts = useMemo(
    () => ({
      critical: assets.filter((a) => a.band === "Critical").length,
      high: assets.filter((a) => a.band === "High").length,
      moderate: assets.filter((a) => a.band === "Moderate").length,
      low: assets.filter((a) => a.band === "Low").length,
      veryLow: assets.filter((a) => a.band === "Very Low").length,
      total: assets.length,
    }),
    [assets]
  );

  return (
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
        Asset Control Strength Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#04139A"
            backgroundColor="primary.900"
            textColor="#fff"
            icon={<ReportIcon sx={{ color: "#fff" }} />}
            label="Critical"
            count={counts.critical}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#12229d"
            backgroundColor="primary.700"
            textColor="#fff"
            icon={<WarningAmberIcon sx={{ color: "#fff" }} />}
            label="High"
            count={counts.high}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#233dff"
            backgroundColor="primary.500"
            textColor="#fff"
            icon={<InfoIcon sx={{ color: "#fff" }} />}
            label="Moderate"
            count={counts.moderate}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#6f80eb"
            backgroundColor="primary.300"
            textColor="#214f73"
            icon={<CheckCircleOutlineIcon sx={{ color: "#214f73" }} />}
            label="Low"
            count={counts.low}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#5cb6f9"
            backgroundColor="primary.100"
            textColor="#214f73"
            icon={<CheckCircleIcon sx={{ color: "#214f73" }} />}
            label="Very Low"
            count={counts.veryLow}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <SummaryCard
            borderColor="#cae8ff"
            backgroundColor="#e0ecedff"
            textColor="#214f73"
            icon={<AnalyticsIcon sx={{ color: "#214f73" }} />}
            label="Total"
            count={counts.total}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

/* ----------------------------------------------------------------
   Charts
---------------------------------------------------------------- */

const AssetControlFamilyLineChart: React.FC<{ asset: AssetControlProfile }> = ({
  asset,
}) => {
  const data = asset.metrics.length
    ? asset.metrics
    : [
        {
          id: "ID",
          familyLabel: "ID",
          orgCurrent: 3.0,
          orgTarget: 3.0,
          assetCurrent: 2.5,
        },
      ];

  return (
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
        textAlign="center"
        sx={{ mb: 2 }}
      >
        {asset.assetName} – Org vs Asset Control Scores
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="familyLabel"
            angle={-40}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 6]}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.toFixed(0)}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toFixed(2),
              name,
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="orgCurrent"
            name="Org Current Score"
            stroke="#1D4ED8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="orgTarget"
            name="Org Target Score"
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="assetCurrent"
            name="Asset Current Score"
            stroke="#F97316"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

const AssetStrengthBarChart: React.FC<{ assets: AssetControlProfile[] }> = ({
  assets,
}) => {
  const data = useMemo(
    () =>
      assets.map((a) => ({
        assetName: a.assetName,
        controlStrength: a.controlStrength,
      })),
    [assets]
  );

  const avgCurrent =
    data.reduce((sum, d) => sum + d.controlStrength, 0) / data.length || 0;
  const targetScore = 4.68;

  return (
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
      >
        Asset Control Strength vs Org Targets
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 120, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 5]}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="assetName"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toFixed(2),
              name,
            ]}
          />
          <Bar
            dataKey="controlStrength"
            name="Asset Control Strength"
            fill="#1D4ED8"
            barSize={26}
            radius={[0, 4, 4, 0]}
          />
          <ReferenceLine
            x={avgCurrent}
            stroke="#0F172A"
            strokeWidth={2}
            label={{
              value: `Current Score: ${avgCurrent.toFixed(2)}`,
              position: "insideBottomRight",
              fill: "#0F172A",
            }}
          />
          <ReferenceLine
            x={targetScore}
            stroke="#EF4444"
            strokeWidth={2}
            label={{
              value: `Target Score: ${targetScore.toFixed(2)}`,
              position: "insideBottomRight",
              fill: "#EF4444",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

/* ----------------------------------------------------------------
   Bottom table
---------------------------------------------------------------- */

const AssetControlTable: React.FC = () => (
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
      sx={{ mb: 1.5 }}
    >
      Critical Asset Control Strength
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Business Unit</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Business Process</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>High Value Asset</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Control Strength</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assetTableRows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.businessUnit}</TableCell>
            <TableCell>{row.businessProcess}</TableCell>
            <TableCell>
              <Typography fontWeight={600}>{row.assetName}</Typography>
            </TableCell>
            <TableCell>{row.controlStrength.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

/* ----------------------------------------------------------------
   Container
---------------------------------------------------------------- */

const AssetControlStrengthDashboardContainer: React.FC = () => {
  const [selectedAssetName, setSelectedAssetName] = useState<string>(
    "Banking Application"
  );

  const selectedAsset =
    mockAssetProfiles.find((a) => a.assetName === selectedAssetName) ??
    mockAssetProfiles[0];

  return (
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
        mb={4}
      >
        Asset Control Strength Dashboard
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <AssetSummaryRow assets={mockAssetProfiles} />

        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 7 }}>
            <AssetControlFamilyLineChart asset={selectedAsset} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <AssetStrengthBarChart assets={mockAssetProfiles} />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
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

        <AssetControlTable />
      </Box>
    </Box>
  );
};

export default AssetControlStrengthDashboardContainer;
