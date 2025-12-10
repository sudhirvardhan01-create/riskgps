"use client";

import React from "react";
import { Box, Paper, Stack, Typography, Grid, Chip } from "@mui/material";
import SeverityScale from "@/components/Reports/SeverityScale";
import { AssetLevelReportsData } from "@/types/reports";

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
const mockAssetTableViewRows: AssetLevelReportsData[] = [
  {
    orgId: "bc1b9a89-64f8-469f-bc02-b3417a06c6a4",
    orgName: "Default Org 1",
    organizationRiskAppetiteInMillionDollar: 1000,
    businessUnitId: "f52ea850-e040-4182-b5f6-29f12c3db5c8",
    businessUnit: "Retail Banking",
    businessProcessId: "509a993b-9b47-4fb2-ac07-3ef213d716f3",
    businessProcess: "Loan Management Process - 5",
    assetId: "398e1a6c-a7c0-442e-a632-50ae933921ca",
    asset: "Customer Database",
    assetCategory: "SaaS",
    controlStrength: 3.4,
    inherentRiskScore: 4,
    inherentRiskLevel: "critical",
    residualRiskScore: 1.5,
    residualRiskLevel: "low",
    inherentImpactInDollar: 8854200000,
    residualImpactInDollar: 3276100000,
    targetImpactInDollar: 1000000000,
    targetStrength: 4.4,
    targetResidualRiskScore: 0.7,
    targetResidualRiskLevel: "very low",
    controls: [
      {
        controlCategoryId: "PR.AA",
        controlCategory:
          "Identity Management, Authentication, and Access Control",
        controlSubCategoryId: "PR.AA-03",
        controlSubCategory: "Users, services, and hardware are authenticated",
        calcultatedControlScore: 5,
        currentScore: 3.7,
        targetScore: 4.8,
      },
      {
        controlCategoryId: "DE.CM",
        controlCategory: "Continuous Monitoring",
        controlSubCategoryId: "DE.CM-09",
        controlSubCategory:
          "Computing hardware and software, runtime environments, and their data\nare monitored to find potentially adverse events",
        calcultatedControlScore: 0.1,
        currentScore: 3.2,
        targetScore: 4.5,
      },
      {
        controlCategoryId: "PR.PS",
        controlCategory: "Platform Security",
        controlSubCategoryId: "PR.PS-06",
        controlSubCategory:
          "Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle",
        calcultatedControlScore: 1.4,
        currentScore: 3.5,
        targetScore: 4.7,
      },
      {
        controlCategoryId: "PR.AT",
        controlCategory: "Awareness and Training",
        controlSubCategoryId: "PR.AT-02",
        controlSubCategory:
          "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind",
        calcultatedControlScore: null,
        currentScore: 4,
        targetScore: 4.9,
      },
      {
        controlCategoryId: "ID.RA",
        controlCategory: "Risk Assessment",
        controlSubCategoryId: "ID.RA-01",
        controlSubCategory:
          "Vulnerabilities in assets are identified, validated, and recorded",
        calcultatedControlScore: 5,
        currentScore: 2.7,
        targetScore: 4.1,
      },
      {
        controlCategoryId: "PR.DS",
        controlCategory: "Data Security",
        controlSubCategoryId: "PR.DS-02",
        controlSubCategory:
          "The confidentiality, integrity, and availability of data-in-transit are protected",
        calcultatedControlScore: 2.8,
        currentScore: 2.5,
        targetScore: 3.9,
      },
      {
        controlCategoryId: "PR.IR",
        controlCategory: "Technology Infrastructure Resilience",
        controlSubCategoryId: "PR.IR-01",
        controlSubCategory:
          "Networks and environments are protected from unauthorized logical access and usage",
        calcultatedControlScore: 2.5,
        currentScore: 1.9,
        targetScore: 3.5,
      },
    ],
  },
  {
    orgId: "bc1b9a89-64f8-469f-bc02-b3417a06c6a4",
    orgName: "Default Org 1",
    organizationRiskAppetiteInMillionDollar: 1000,
    businessUnitId: "f52ea850-e040-4182-b5f6-29f12c3db5c8",
    businessUnit: "Retail Banking",
    businessProcessId: "509a993b-9b47-4fb2-ac07-3ef213d716f3",
    businessProcess: "Loan Management Process - 5",
    assetId: "8812adcb-b838-4ebc-b1bd-66242cda21dc",
    asset: "Fraud Application",
    assetCategory: "Windows",
    controlStrength: 3.94,
    inherentRiskScore: 4,
    inherentRiskLevel: "critical",
    residualRiskScore: 1,
    residualRiskLevel: "low",
    inherentImpactInDollar: 8854200000,
    residualImpactInDollar: 2319800000,
    targetImpactInDollar: 1000000000,
    targetStrength: 4.4,
    targetResidualRiskScore: 0.7,
    targetResidualRiskLevel: "very low",
    controls: [
      {
        controlCategoryId: "PR.PS",
        controlCategory: "Platform Security",
        controlSubCategoryId: "PR.PS-03",
        controlSubCategory:
          "Hardware is maintained, replaced, and removed commensurate with risk",
        calcultatedControlScore: 3.5,
        currentScore: 2.3,
        targetScore: 3.7,
      },
      {
        controlCategoryId: "PR.AA",
        controlCategory:
          "Identity Management, Authentication, and Access Control",
        controlSubCategoryId: "PR.AA-03",
        controlSubCategory: "Users, services, and hardware are authenticated",
        calcultatedControlScore: 3.5,
        currentScore: 3.7,
        targetScore: 4.8,
      },
      {
        controlCategoryId: "DE.CM",
        controlCategory: "Continuous Monitoring",
        controlSubCategoryId: "DE.CM-01",
        controlSubCategory:
          "Networks and network services are monitored to find potentially adverse\nevents",
        calcultatedControlScore: 4.4,
        currentScore: 2.8,
        targetScore: 4,
      },
      {
        controlCategoryId: "PR.IR",
        controlCategory: "Technology Infrastructure Resilience",
        controlSubCategoryId: "PR.IR-03",
        controlSubCategory:
          "Mechanisms are implemented to achieve resilience requirements in normal and adverse situations",
        calcultatedControlScore: 5,
        currentScore: 3.8,
        targetScore: 4.7,
      },
      {
        controlCategoryId: "PR.DS",
        controlCategory: "Data Security",
        controlSubCategoryId: "PR.DS-10",
        controlSubCategory:
          "The confidentiality, integrity, and availability of data-in-use are protected",
        calcultatedControlScore: 5,
        currentScore: 4.2,
        targetScore: 5,
      },
      {
        controlCategoryId: "DE.AE",
        controlCategory: "Adverse Event Analysis",
        controlSubCategoryId: "DE.AE-07",
        controlSubCategory:
          "Cyber threat intelligence and other contextual information are integrated into the analysis",
        calcultatedControlScore: 5,
        currentScore: 2.2,
        targetScore: 3.8,
      },
      {
        controlCategoryId: "ID.AM",
        controlCategory: "Asset Management",
        controlSubCategoryId: "ID.AM-02",
        controlSubCategory:
          "Inventories of software, services, and systems managed by the organization are maintained",
        calcultatedControlScore: 5,
        currentScore: 2.6,
        targetScore: 4,
      },
    ],
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
  { columnSize: 1.5, columnTitle: "Risk Level" },
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

const AssetTableRowCard: React.FC<AssetLevelReportsData> = ({
  businessUnit,
  businessProcess,
  asset,
  controlStrength,
  targetStrength,
  residualRiskLevel,
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
          {asset}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {(controlStrength ?? 0).toFixed(2)}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {(targetStrength ?? 0).toFixed(2)}
        </Typography>
      </Grid>
      <Grid size={1.5}>
        {residualRiskLevel ? <SeverityScale severity={residualRiskLevel} height={8} /> : "-"}
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
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="body2" fontWeight={600}>
        Critical Asset Control Strength (Table View)
      </Typography>
      <Chip
        label={`${mockAssetTableViewRows.length} assets`}
        size="small"
        sx={{ borderRadius: 2 }}
      />
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
