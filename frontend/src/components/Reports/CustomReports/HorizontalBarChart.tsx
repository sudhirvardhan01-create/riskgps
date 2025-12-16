"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// ✅ Define the shape of your data
export interface BarChartData {
  name: string;
  dependencies: number;
}

interface CriticalDependenciesBarChartProps {
  data: BarChartData[];
}

// ✅ Define prop types for custom tick
interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

// ✅ Prevent text wrapping on Y-axis
const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({
  x = 0,
  y = 0,
  payload,
}) => (
  <text
    x={x - 10}
    y={y + 4}
    textAnchor="end"
    fontSize={11}
    fontWeight="bold"
    fill="#444"
    style={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {payload?.value}
  </text>
);

// ✅ Material UI styled tooltip

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = (props) => {
  const { active } = props;
  const payload = (props as any).payload;
  const label = (props as any).label; // ✅ bypass type limitation safely

  if (active && payload && payload.length > 0) {
    const data = payload[0];

    return (
      <Paper
        elevation={3}
        sx={{
          p: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          border: "1px solid #eee",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: "#333", mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: "#517ca0" }}>
          Dependencies: {data.value}
        </Typography>
      </Paper>
    );
  }

  return null;
};

// ✅ Final Chart Component
const CriticalDependenciesBarChart: React.FC<
  CriticalDependenciesBarChartProps
> = ({ data }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        backgroundColor: "#fff",
        borderRadius: 3,
        width: "100%",
        height: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                type="number"
                domain={[0, "dataMax + 1"]}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
                label={{
                  value: "Number of Critical Process Dependencies",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontWeight: "bold", fontSize: 10 },
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={<CustomYAxisTick />}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="dependencies"
                fill="#12229d"
                barSize={14}
                radius={[0, 4, 4, 0]}
                animationDuration={800}
                animationEasing="ease-in-out"
                isAnimationActive={false}
                activeBar={false}
                className="bar-clickable"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CriticalDependenciesBarChart;
