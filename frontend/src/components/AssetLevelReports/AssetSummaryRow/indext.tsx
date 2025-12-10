"use client";

import React, { useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { AssetLevelReportsData } from "@/types/reports";


interface AssetSummaryRowProps {
  assets: AssetLevelReportsData[];
}

const AssetSummaryRow: React.FC<AssetSummaryRowProps> = ({assets} ) => {
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

  const summaryCards = [
    {
      cardBackgroundColor: "primary.900",
      cardBorderColor: "#04139A",
      cardIcon: <ReportIcon sx={{ color: "#ffffff" }} />,
      cardText: "Critical",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.critical,
    },
    {
      cardBackgroundColor: "primary.700",
      cardBorderColor: "#12229d",
      cardIcon: <WarningAmberIcon sx={{ color: "#ffffff" }} />,
      cardText: "High",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.high,
    },
    {
      cardBackgroundColor: "primary.500",
      cardBorderColor: "#233dff",
      cardIcon: <InfoIcon sx={{ color: "#ffffff" }} />,
      cardText: "Moderate",
      cardTextColor: "#ffffff",
      processesCount: assetSummaryCardItems.moderate,
    },
    {
      cardBackgroundColor: "primary.300",
      cardBorderColor: "#6f80eb",
      cardIcon: <CheckCircleOutlineIcon sx={{ color: "#214f73" }} />,
      cardText: "Low",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.low,
    },
    {
      cardBackgroundColor: "primary.100",
      cardBorderColor: "#5cb6f9",
      cardIcon: <CheckCircleIcon sx={{ color: "#214f73" }} />,
      cardText: "Very Low",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.veryLow,
    },
    {
      cardBackgroundColor: "#e0ecedff",
      cardBorderColor: "#cae8ff",
      cardIcon: <AnalyticsIcon sx={{ color: "#214f73" }} />,
      cardText: "Total",
      cardTextColor: "#214f73",
      processesCount: assetSummaryCardItems.total,
    },
  ];

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
        Asset Criticality Overview
      </Typography>
      <Grid container spacing={2}>
        {summaryCards.map((item, index) => (
          <Grid size={{ xs: 2 }} key={index}>
            <SummaryCard
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
  );
};

// Updated SummaryCard to match ProcessCriticalityCard props
interface SummaryCardProps {
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardIcon: React.ReactElement;
  cardText: string;
  cardTextColor: string;
  processesCount: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  cardBackgroundColor,
  cardBorderColor,
  cardIcon,
  cardText,
  cardTextColor,
  processesCount,
}) => (
  <Box
    sx={{
      border: `1px solid ${cardBorderColor}`,
      backgroundColor: cardBackgroundColor,
      borderRadius: 2,
      p: 2,
      opacity: 0.9,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
      {cardIcon}
      <Typography color={cardTextColor} fontWeight={600}>
        {processesCount}
      </Typography>
    </Stack>
    <Typography color={cardTextColor}>{cardText}</Typography>
  </Box>
);

export default AssetSummaryRow;
