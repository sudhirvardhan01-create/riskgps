"use client";

import { transformAssetData } from "@/utils/utility";
import { Box, Grid, Paper, Typography } from "@mui/material";
import HorizontalBarChart from "./HorizontalBarChart";
import WorldMap from "./WorldMap";
import dynamic from "next/dynamic";

const PieChartComponent = dynamic(() => import("./PieChart"), {
  ssr: false,
});

// ----- Component -----
export default function RiskDashboard({ assetData }: any) {
  const { asset_data, vendor_data, network_data, cityData } =
    transformAssetData(assetData);

  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      {/* ===== LEFT CARD: GEO MAP ===== */}
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
            <WorldMap data={cityData} />
          </Box>
        </Paper>
      </Grid>

      {/* ===== RIGHT CARD: BAR CHARTS ===== */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          {/* ---- Asset Dependencies ---- */}
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
                    />
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
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
