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
} from "recharts";

type RiskMetric =
  | "Total Risk Exposure"
  | "Average Net Exposure"
  | "Financial Impact"
  | "Operational Impact"
  | "Regulatory Impact"
  | "Reputational Impact";

export interface RiskRadarRecord {
  metric: RiskMetric;
  values: Record<string, number>;
}

interface MultiBURadarChartProps {
  data: RiskRadarRecord[];
}

const palette: Record<900 | 700 | 500 | 300 | 100, string> = {
  900: "#12229d",
  700: "#233dff",
  500: "#6f80eb",
  300: "#5cb6f9",
  100: "#cae8ff",
};

const colorKeys: Array<900 | 700 | 500 | 300 | 100> = [900, 700, 500, 300, 100];

export const BusinessUnitRadarChart: React.FC<MultiBURadarChartProps> = ({
  data,
}) => {
  const [hoveredBU, setHoveredBU] = useState<string | null>(null);

  const businessUnits = useMemo(() => {
    const first = data[0]?.values ?? {};
    return Object.keys(first);
  }, [data]);

  // Normalize all values to 0–100 for visual consistency
  const normalizedData = useMemo(() => {
    return data.map((record) => {
      const max = Math.max(...Object.values(record.values));

      const normalizedValues = Object.entries(record.values).reduce(
        (acc, [bu, val]) => {
          acc[bu] = max === 0 ? 0 : (val / max) * 100;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        metric: record.metric,
        ...normalizedValues,
      };
    });
  }, [data]);

  const legendFormatter = (value: any, entry: any, index: any) => {
    // You can apply different colors based on the value or index if needed
    return <span style={{ color: "#484848" }}>{value}</span>;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, width: "100%", height: "455px" }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={normalizedData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: "#484848",
              fontSize: 12,
              fontWeight: 600,
              // textAnchor: "bottom",
            }}
            tickLine={false}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />

          {businessUnits.map((bu, index) => {
            const color = palette[colorKeys[index % colorKeys.length]];

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

          <Tooltip />
          <Legend
            onMouseEnter={(o) => o.value && setHoveredBU(String(o.value))}
            onMouseLeave={() => setHoveredBU(null)}
            formatter={legendFormatter}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
