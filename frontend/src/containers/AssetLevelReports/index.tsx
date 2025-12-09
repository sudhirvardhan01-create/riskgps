"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from "@mui/material";
import AssetSummaryRow from "@/components/AssetLevelReports/AssetSummaryRow/indext";
import AssetControlFamilyLineChart from "@/components/AssetLevelReports/AssetControlFamilyLineChart";
import AssetStrengthBarChart from "@/components/AssetLevelReports/AssetStrengthBarChart";
import AssetTableViewContainer from "@/components/AssetLevelReports/AssetTableViewContainer";

// Types & mock data
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

const AssetLevelReportsContainer: React.FC = () => {
  const [selectedAssetName, setSelectedAssetName] = useState<string>(
    "Banking Application"
  );
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");

  const selectedAsset =
    mockAssetProfiles.find((a) => a.assetName === selectedAssetName) ??
    mockAssetProfiles[0];

  const businessUnits = [
    "All",
    ...Array.from(new Set(mockAssetProfiles.map((a) => a.businessUnit))),
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
      {/* Scrollable content */}
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

        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <AssetControlFamilyLineChart asset={selectedAsset} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <AssetStrengthBarChart assets={mockAssetProfiles} />
          </Grid>
        </Grid>

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

        <AssetTableViewContainer />
      </Box>
    </>
  );
};

export default AssetLevelReportsContainer;
