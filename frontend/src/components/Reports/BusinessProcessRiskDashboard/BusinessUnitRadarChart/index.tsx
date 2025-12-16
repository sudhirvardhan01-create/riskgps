import { customStyles } from "@/styles/customStyles";
import { RiskRadarRecord } from "@/types/dashboard";
import { Paper } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// ---------- Types ----------
interface MultiBURadarChartProps {
  data: RiskRadarRecord[];
  height?: number;
}

interface NormalizedRecord {
  metric: string;
  originalValues: Record<string, number>;
  [bu: string]: string | number | Record<string, number>;
}

interface TooltipEntry {
  name: string;
  value: number;
  payload: NormalizedRecord;
}

// ---------- Color Palette ----------
const palette = {
  900: "#12229d",
  700: "#233dff",
  500: "#6f80eb",
  300: "#5cb6f9",
  100: "#cae8ff",
} as const;

const colorKeys = [900, 700, 500, 300, 100] as const;

// ---------- Format Helpers ----------
const convertValue = (v: number) => {
  if (v >= 1_000_000_000) return v / 1_000_000_000; // Bn
  return v / 1_000_000; // Mn
};

const getUnit = (v: number) => (v >= 1_000_000_000 ? "Bn" : "Mn");

// ---------- Custom Tooltip Component ----------
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}: any) => {
  if (!active || !payload?.length) return null;

  const first = payload[0] as TooltipEntry;
  const { metric, originalValues } = first.payload;

  return (
    <div
      style={{
        background: "white",
        padding: 10,
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontSize: 12,
      }}
    >
      <strong>{metric}</strong>
      <br />
      {Object.entries(originalValues).map(([bu, raw]) => (
        <div key={bu}>
          {bu}:{" "}
          <b>
            {convertValue(raw).toFixed(2)} {getUnit(raw)}
          </b>
        </div>
      ))}
    </div>
  );
};

// ---------- Main Component ----------
export const BusinessUnitRadarChart: React.FC<MultiBURadarChartProps> = ({
  data,
  height = 455,
}) => {
  const [hoveredBU, setHoveredBU] = useState<string | null>(null);

  const businessUnits = useMemo(() => {
    return Object.keys(data[0]?.values ?? {});
  }, [data]);

  // Normalize values BUT also keep originals for tooltip
  const normalizedData = useMemo<NormalizedRecord[]>(() => {
    return data.map((rec) => {
      const max = Math.max(...Object.values(rec.values));

      const normalized: Record<string, number> = {};
      for (const [bu, v] of Object.entries(rec.values)) {
        normalized[bu] = max === 0 ? 0 : (v / max) * 100;
      }

      return {
        metric: rec.metric,
        ...normalized,
        originalValues: rec.values,
      };
    });
  }, [data]);

  return (
    <Paper elevation={0} sx={{ p: 3, width: "100%", height: height }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={normalizedData}>
          <PolarGrid />

          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: customStyles.fontColor,
              fontSize: customStyles.xAxisTicks.fontSize,
              fontWeight: customStyles.xAxisTicks.fontWeight,
              fontFamily: customStyles.fontFamily,
            }}
            tickLine={false}
          />

          {/* <PolarRadiusAxis angle={30} domain={[0, 100]} /> */}

          {businessUnits.map((bu, i) => {
            const color = palette[colorKeys[i % colorKeys.length]];
            return (
              <Radar
                key={bu}
                name={bu}
                dataKey={bu}
                stroke={color}
                fill={color}
                fillOpacity={
                  hoveredBU === null || hoveredBU === bu ? 0.6 : 0.15
                }
                strokeWidth={hoveredBU === bu ? 3 : 1}
                onMouseEnter={() => setHoveredBU(bu)}
                onMouseLeave={() => setHoveredBU(null)}
              />
            );
          })}

          <Tooltip content={<CustomTooltip />} />

          <Legend
            formatter={(value) => (
              <span
                style={{
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.legend.fontSize,
                  fontWeight: customStyles.legend.fontWeight,
                }}
              >
                {value}
              </span>
            )}
            onMouseEnter={(o) => o.value && setHoveredBU(String(o.value))}
            onMouseLeave={() => setHoveredBU(null)}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
