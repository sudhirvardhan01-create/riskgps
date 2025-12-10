import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
import { AssetLevelReportsData } from "@/types/reports";
import { DashboardService } from "@/services/dashboardService";

const AssetLevelReportsContainer: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>();

  const [assetLevelReportsData, setAssetLevelReportsData] = useState<
    AssetLevelReportsData[]
  >([]);

  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    assetLevelReportsData[0]?.assetId
  );
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<string>("All");

  const selectedAsset =
    assetLevelReportsData.find((a) => a.assetId === selectedAssetId) ??
    assetLevelReportsData[0];

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
      console.log(res)
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
        {assetLevelReportsData.length > 0 && (
          <AssetSummaryRow assets={assetLevelReportsData} />
        )}

        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, md: 7 }}>

              <AssetControlFamilyLineChart asset={selectedAsset} />

          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <AssetStrengthBarChart assets={assetLevelReportsData} />
          </Grid>
        </Grid>

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
              color={asset.assetId === selectedAssetId ? "primary" : "default"}
            />
          ))}
        </Stack>

        <AssetTableViewContainer />
      </Box>
    </>
  );
};

export default AssetLevelReportsContainer;
