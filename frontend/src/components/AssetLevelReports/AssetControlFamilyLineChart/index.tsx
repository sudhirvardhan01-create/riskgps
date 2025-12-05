"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ControlMetricPoint {
  id: string;
  familyLabel: string;
  orgCurrent: number;
  orgTarget: number;
  assetCurrent: number;
}

interface AssetControlProfile {
  assetName: string;
  metrics: ControlMetricPoint[];
}

interface AssetControlFamilyLineChartProps {
  asset: AssetControlProfile;
}

const AssetControlFamilyLineChart: React.FC<AssetControlFamilyLineChartProps> = ({ asset }) => {
  const data = asset.metrics.length
    ? asset.metrics
    : [
        {
          id: "ID",
          familyLabel: "ID",
          orgCurrent: 3.0,
          orgTarget: 3.0,
          assetCurrent: 2.5,
        },
      ];

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
      <Typography variant="body2" fontWeight={600} textAlign="center" sx={{ mb: 2 }}>
        {asset.assetName} – Org vs Asset Control Scores
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="familyLabel"
            angle={-40}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 11 }}
          />
          <YAxis domain={[0, 6]} tick={{ fontSize: 11 }} tickFormatter={(v) => v.toFixed(0)} />
          <Tooltip
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="orgCurrent"
            name="Org Current Score"
            stroke="#1D4ED8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="orgTarget"
            name="Org Target Score"
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="assetCurrent"
            name="Asset Current Score"
            stroke="#F97316"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AssetControlFamilyLineChart;
