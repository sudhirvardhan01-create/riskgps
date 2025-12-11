"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Paper, Tooltip as MuiTooltip } from "@mui/material";

export interface BarChartData {
  name: string; // Risk Scenario / Asset Name / Anything
  value: number;
}

interface VerticalBarChartProps {
  data: BarChartData[];
  height?: number;
  barColor?: string;
  maxLabelLength?: number; // For truncation
  labelYAxis?: string;
}

/** Truncate long labels */
const truncateLabel = (label: string, max: number) => {
  return label.length > max ? label.slice(0, max) + "..." : label;
};

/** Custom X-Axis Tick Renderer for truncation + tooltip  */
const CustomXAxisTick = ({
  x,
  y,
  payload,
  maxLabelLength = 10,
}: {
  x: number;
  y: number;
  payload: any;
  maxLabelLength?: number;
}) => {
  const originalLabel = payload.value;
  const truncatedLabel = truncateLabel(originalLabel, maxLabelLength);

  return (
    <g transform={`translate(${x},${y})`}>
      <MuiTooltip title={originalLabel} arrow placement="top">
        <text
          dy={16}
          textAnchor="middle"
          fill="#475569"
          style={{ fontSize: "12px", cursor: "pointer" }}
        >
          {truncatedLabel}
        </text>
      </MuiTooltip>
    </g>
  );
};

const VerticalSingleBarChart: React.FC<VerticalBarChartProps> = ({
  data,
  height = 400,
  barColor = "#12229d",
  maxLabelLength = 10,
  labelYAxis,
}) => {
  if (!data || data.length === 0)
    return <p className="text-center text-gray-500">No data available</p>;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "#fff",
        borderRadius: 3,
        height,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            interval={0}
            height={40}
            angle={-45}
            textAnchor="end"
            tick={(props) => (
              <CustomXAxisTick {...props} maxLabelLength={maxLabelLength} />
            )}
            // tickMargin={10}
            // tick={{ fontSize: 12 }}
          />

          <YAxis
            label={{
              value: labelYAxis,
              angle: -90,
              position: "insideCentre",
              style: { fontWeight: "bold", fontSize: 12 },
            }}
            width={100}
          />

          <Tooltip
            wrapperStyle={{ zIndex: 100 }}
            formatter={(value: number) => [value, "Value"]}
            contentStyle={{
              borderRadius: "10px",
              padding: "8px 12px",
              background: "white",
              border: "1px solid #ddd",
            }}
          />

          <Bar
            dataKey="value"
            fill={barColor}
            radius={[6, 6, 0, 0]} // Rounded top
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default VerticalSingleBarChart;
