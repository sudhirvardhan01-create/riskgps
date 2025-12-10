"use client";

import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import SeverityScale from "@/components/Reports/SeverityScale";

// Types
type StrengthLevel = "very low" | "low" | "moderate" | "high" | "critical";

interface AssetTableViewRow {
  businessUnit: string;
  businessProcess: string;
  assetName: string;
  controlStrength: number;
  targetStrength: number;
  gapLevel?: StrengthLevel;
}

// Mock data
const mockAssetTableViewRows: AssetTableViewRow[] = [
  {
    businessUnit: "Loan Services",
    businessProcess: "KYC",
    assetName: "Loan Application",
    controlStrength: 3.6,
    targetStrength: 4.6,
    gapLevel: "high",
  },
  {
    businessUnit: "Loan Services",
    businessProcess: "Loan Origination",
    assetName: "Loan Application",
    controlStrength: 3.6,
    targetStrength: 4.6,
    gapLevel: "high",
  },
  {
    businessUnit: "Loan Services",
    businessProcess: "Underwriting",
    assetName: "Underwriting Application",
    controlStrength: 1.2,
    targetStrength: 4.6,
    gapLevel: "critical",
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Account Management Process",
    assetName: "Banking Application",
    controlStrength: 3.8,
    targetStrength: 4.6,
    gapLevel: "moderate",
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "ACH",
    assetName: "Payment Rails",
    controlStrength: 2.7,
    targetStrength: 4.6,
    gapLevel: "high",
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Fraud Monitoring",
    assetName: "Fraud Application",
    controlStrength: 2.7,
    targetStrength: 4.6,
    gapLevel: "high",
  },
  {
    businessUnit: "Retail Banking",
    businessProcess: "Account Management Process",
    assetName: "Customer Database",
    controlStrength: 1.2,
    targetStrength: 4.6,
    gapLevel: "critical",
  },
];

interface HeaderCol {
  columnSize: number;
  columnTitle: string;
}

const assetHeaderCols: HeaderCol[] = [
  { columnSize: 2.5, columnTitle: "Business Unit" },
  { columnSize: 2.5, columnTitle: "Business Process" },
  { columnSize: 2.5, columnTitle: "High Value Asset" },
  { columnSize: 1.5, columnTitle: "Control Strength" },
  { columnSize: 1.5, columnTitle: "Target Strength" },
  { columnSize: 1.5, columnTitle: "Gap Severity" },
];

const AssetTableHeader: React.FC = () => (
  <Box
    sx={{
      borderRadius: 1,
      border: "1px solid #E7E7E8ff",
      px: 1.5,
      py: 1,
      mb: 1,
      bgcolor: "#F9FAFB",
    }}
  >
    <Grid container spacing={2} alignItems="center">
      {assetHeaderCols.map((col, idx) => (
        <Grid size={col.columnSize} key={idx}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {col.columnTitle}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Box>
);


const AssetTableRowCard: React.FC<AssetTableViewRow> = ({
  businessUnit,
  businessProcess,
  assetName,
  controlStrength,
  targetStrength,
  gapLevel,
}) => (
  <Box
    sx={{
      borderRadius: 1,
      border: "1px solid #E7E7E8ff",
      p: 1.5,
    }}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid size={2.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {businessUnit}
        </Typography>
      </Grid>
      <Grid size={2.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {businessProcess}
        </Typography>
      </Grid>
      <Grid size={2.5}>
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          {assetName}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {controlStrength.toFixed(2)}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {targetStrength.toFixed(2)}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        {gapLevel ? <SeverityScale severity={gapLevel} height={8} /> : "-"}
      </Grid>
    </Grid>
  </Box>
);

const AssetTableViewContainer: React.FC = () => (
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
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body2" fontWeight={600}>
        Critical Asset Control Strength (Table View)
      </Typography>
      <Chip label={`${mockAssetTableViewRows.length} assets`} size="small" sx={{ borderRadius: 2 }} />
    </Stack>

    <AssetTableHeader />

    <Stack direction="column" spacing={1.5}>
      {mockAssetTableViewRows.map((row, idx) => (
        <AssetTableRowCard key={idx} {...row} />
      ))}
    </Stack>
  </Paper>
);

export default AssetTableViewContainer;
