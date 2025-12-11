"use client";

import React, { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { AssetLevelReportsData } from "@/types/reports";


interface AssetStrengthBarChartProps {
  assets: AssetLevelReportsData[];
}

const AssetStrengthBarChart: React.FC<AssetStrengthBarChartProps> = ({ assets }) => {
  const data = useMemo(
    () => assets.map((a) => ({ assetName: a.asset, controlStrength: a.controlStrength })),
    [assets]
  );

  const avgCurrent =
    data.reduce((sum, d) => sum + (d.controlStrength ?? 0), 0) / data.length || 0;
  const targetScore = 4.68;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "#fafafa",
        height: 520,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        borderRadius: 2,
        border: "1px solid #E5E7EB",
      }}
    >
      <Typography variant="body2" fontWeight={600} textAlign="left" sx={{ mb: 2 }}>
        Asset Control Strength vs Org Targets
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 120, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 5]} tickFormatter={(v) => v.toFixed(1)} />
          <YAxis type="category" dataKey="assetName" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
          />
          <Bar
            dataKey="controlStrength"
            name="Asset Control Strength"
            fill="#1D4ED8"
            barSize={26}
            radius={[0, 4, 4, 0]}
          />
          <ReferenceLine
            x={avgCurrent}
            stroke="#0F172A"
            strokeWidth={2}
            label={{
              value: `Current Score: ${avgCurrent.toFixed(2)}`,
              position: "insideBottomRight",
              fill: "#0F172A",
              fontSize: 11,
              // dy: 12,
            }}
          />
          <ReferenceLine
            x={targetScore}
            stroke="#EF4444"
            strokeWidth={2}
            label={{
              value: `Target Score: ${targetScore.toFixed(2)}`,
              position: "insideBottomRight",
              fill: "#EF4444",
              dy: -20,
              fontSize: 11,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AssetStrengthBarChart;
