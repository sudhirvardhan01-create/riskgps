"use client";

import { useState } from "react";
import { Paper, Tabs, Tab, Typography, Box, Grid } from "@mui/material";
import CriticalDependenciesBarChart from "./CriticalDependenciesBarChart";
import GreyWorldMap from "./GreyWorldMap";
import { LatLngExpression } from "leaflet";

export interface LocationData {
  name: string;
  value: number;
  coords: LatLngExpression;
}

export default function RiskDashboard() {
  const locations: LocationData[] = [
    { name: "Chicago", value: 75, coords: [41.8781, -87.6298] },
    { name: "New York", value: 90, coords: [40.7128, -74.006] },
    { name: "Los Angeles", value: 60, coords: [34.0522, -118.2437] },
    { name: "Dallas", value: 50, coords: [32.7767, -96.797] },
  ];

  const asset_data = [
    { name: "Banking Application", dependencies: 4 },
    { name: "Loan Application", dependencies: 3 },
    { name: "Payment Rails", dependencies: 3 },
    { name: "Underwriting Application", dependencies: 2 },
    { name: "Customer Database", dependencies: 1 },
    { name: "Fraud Application", dependencies: 1 },
  ];

  const vendor_data = [
    { name: "Fundingo", dependencies: 4 },
    { name: "SEON", dependencies: 3 },
  ];

  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      {/* ===== LEFT CARD: BAR CHART ===== */}
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

      {/* ===== RIGHT CARD: GEO MAP ===== */}
      <Grid size={12}>
        <Grid container spacing={3}>
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
