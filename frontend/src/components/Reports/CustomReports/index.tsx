"use client";

import { Paper, Typography, Box, Grid } from "@mui/material";
import CriticalDependenciesBarChart from "./CriticalDependenciesBarChart";
import GreyWorldMap from "./GreyWorldMap";
import { LatLngExpression } from "leaflet";
import { transformAssetData } from "@/utils/utility";

// ----- Component -----
export default function RiskDashboard({ assetData }: any) {
  const { asset_data, vendor_data, locations } = transformAssetData(assetData);

  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      {/* ===== LEFT CARD: GEO MAP ===== */}
      <Grid size={12}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "#fafafa",
            height: "100%",
          }}
        >
          <Typography
            variant="subtitle1"
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
            <GreyWorldMap data={locations} />
          </Box>
        </Paper>
      </Grid>

      {/* ===== RIGHT CARD: BAR CHARTS ===== */}
      <Grid size={12}>
        <Grid container spacing={3}>
          {/* ---- Asset Dependencies ---- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
              >
                Asset / Critical Process Dependencies
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <CriticalDependenciesBarChart data={asset_data} />
              </Box>
            </Paper>
          </Grid>

          {/* ---- Vendor Dependencies ---- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#fafafa",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                textAlign="left"
                sx={{ mb: 1 }}
              >
                Vendors / Critical Process Dependencies
              </Typography>

              <Box sx={{ width: "100%", height: "100%" }}>
                <CriticalDependenciesBarChart data={vendor_data} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
