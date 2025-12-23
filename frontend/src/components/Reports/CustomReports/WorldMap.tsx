"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { LatLngExpression } from "leaflet";
import { Asset } from "@/types/assessment";
import { customStyles } from "@/styles/customStyles";
import LegendScale from "../LegendScale";

// ✅ Dynamic imports to avoid SSR errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), {
  ssr: false,
});

export interface LocationData {
  name: string;
  value: number;
  coords: LatLngExpression;
  severity: string;
}

interface GreyWorldMapProps {
  data?: LocationData[];
  tooltipData?: Asset[];
}

const GreyWorldMap: React.FC<GreyWorldMapProps> = ({
  data = [],
  tooltipData = [],
}) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ✅ Load Leaflet only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet);
        setMounted(true);
      });
    }
  }, []);

  const mapData = data.length ? data : [];

  console.log(mapData);

  if (!mounted || !L)
    return (
      <Paper
        sx={{
          height: 300,
          width: "100%",
          borderRadius: 3,
          bgcolor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        Loading map...
      </Paper>
    );

  // ✅ Map bounds
  const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  // ✅ Enhanced bubble scaling (logarithmic for better visual range)
  // 🟢 Bubble size based on difference from 0
  const getSize = (v: number): number => {
    const maxAbsVal = Math.max(...mapData.map((d) => Math.abs(d.value))) || 1;

    const normalized = Math.abs(v) / maxAbsVal; // range 0 → 1
    const minSize = 10; // smallest bubble
    const maxSize = 35; // largest bubble

    return minSize + normalized * (maxSize - minSize);
  };

  // ✅ More distinct color mapping (blue → red)

  const getBubbleColor = (s: string): string => {
    let bubbleColor = "";
    switch (s) {
      case "critical":
        bubbleColor = "#12229d";
        break;
      case "high":
        bubbleColor = "#233dff";
        break;
      case "moderate":
        bubbleColor = "#6f80eb";
        break;
      case "low":
        bubbleColor = "#5cb6f9";
        break;
      case "very low":
        bubbleColor = "#cae8ff";
        break;
      default:
        bubbleColor = "#e0ecedff";
        break;
    }
    return bubbleColor;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: 300,
        borderRadius: 0,
        background: "transparent",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          height: 270,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <MapContainer
          center={[37.0902, -95.7129]}
          zoom={4}
          minZoom={2}
          maxZoom={6}
          scrollWheelZoom
          zoomControl
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          style={{
            height: "100%",
            width: "100%",
            filter: "contrast(1.05)",
          }}
        >
          {/* 🗺️ Theme-based tile */}
          <TileLayer
            url={
              theme.palette.mode === "dark"
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            noWrap
          />

          {mapData.map((item, idx) => {
            const size = getSize(item.value);
            const color = getBubbleColor(item.severity);
            const isHovered = hoveredIndex === idx;
            const markerSize = isHovered ? size * 1.25 : size;
            const glow = isHovered ? `${color}` : `${color}99`;

            const icon = L.divIcon({
              className: "custom-marker",
              html: `
              <div 
                style="
                  width:${markerSize}px;
                  height:${markerSize}px;
                  background:${color};
                  border-radius:50%;
                  border:2px solid white;
                  cursor:pointer;
                  box-shadow:0 0 10px ${glow};
                  transition: all 0.25s ease;
                "
              ></div>
            `,
              iconSize: [markerSize, markerSize],
              iconAnchor: [markerSize / 2, markerSize / 2],
            });

            return (
              <Marker
                key={idx}
                position={item.coords}
                icon={icon}
                eventHandlers={{
                  mouseover: () => setHoveredIndex(idx),
                  mouseout: () => setHoveredIndex(null),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <Stack
                    direction={"column"}
                    sx={{ display: "flex", alignItems: "start" }}
                  >
                    <Typography
                      gutterBottom
                      sx={{
                        pl: 2,
                        fontFamily: customStyles.fontFamily,
                        fontSize: customStyles.tooltipTitleFontSize,
                        fontWeight: customStyles.tooltipDarkFontWeight,
                        color: customStyles.tooltipFontColor,
                      }}
                    >
                      {item.name}
                    </Typography>

                    <List
                      dense
                      sx={{ py: 0, maxHeight: 150, overflowY: "auto" }}
                    >
                      {tooltipData
                        .filter(
                          (asset) => asset.geographicLocation === item.name
                        )
                        .map((x, index) => (
                          <ListItem key={index} sx={{ py: 0.25 }}>
                            <ListItemText
                              primary={x.applicationName}
                              primaryTypographyProps={{
                                fontFamily: customStyles.fontFamily,
                                fontSize: customStyles.tooltipTextFontSize,
                                fontWeight: customStyles.tooltipLightFontWeight,
                                color: customStyles.tooltipFontColor,
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Stack>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </Paper>
      <Stack direction={"row"} justifyContent={"center"}>
        <LegendScale />
      </Stack>
    </Paper>
  );
};

export default GreyWorldMap;
