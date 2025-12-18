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
import { Paper, Typography, Box, Stack } from "@mui/material";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { customStyles } from "@/styles/customStyles";

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
    fontSize={customStyles.yAxisTicks.fontSize}
    fontWeight={customStyles.yAxisTicks.fontWeight}
    fontFamily={customStyles.fontFamily}
    color={customStyles.fontColor}
    fill={customStyles.fontColor}
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
          p: 1.5,
          borderRadius: customStyles.tooltipBorderRadius,
          backgroundColor: customStyles.tooltipBackgroundColor,
          border: `1px solid ${customStyles.tooltipBorderColor}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: "#333", mb: 0.5 }}
        >
          {label}
        </Typography>
        <Stack direction={"row"} gap={0.5}>
          <Typography
            sx={{
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.tooltipTextFontSize,
              fontWeight: customStyles.tooltipLightFontWeight,
              color: customStyles.tooltipFontColor,
              lineHeight: 1.6,
            }}
          >
            Dependencies:
          </Typography>
          <Typography
            sx={{
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.tooltipTextFontSize,
              fontWeight: customStyles.tooltipDarkFontWeight,
              color: customStyles.tooltipFontColor,
              lineHeight: 1.6,
            }}
          >
            {data.value}
          </Typography>
        </Stack>
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
              <CartesianGrid horizontal={false} vertical={true} />
              <XAxis
                type="number"
                domain={[0, "dataMax + 1"]}
                tick={{
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.xAxisTicks.fontSize,
                  fontWeight: customStyles.xAxisTicks.fontWeight,
                }}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
                label={{
                  value: "Number of Critical Process Dependencies",
                  position: "insideBottom",
                  offset: -5,
                  style: {
                    fontWeight: customStyles.xAxisLabels.fontWeight,
                    fontSize: customStyles.xAxisLabels.fontSize,
                    color: customStyles.fontColor,
                    fontFamily: customStyles.fontFamily,
                  },
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
                barSize={customStyles.barSize}
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
