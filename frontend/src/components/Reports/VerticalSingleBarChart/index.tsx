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
  TooltipProps,
} from "recharts";
import { Paper, Tooltip as MuiTooltip, Typography, Stack } from "@mui/material";
import { customStyles } from "@/styles/customStyles";

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
  labelXAxis?: string;
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
          dy={10}
          textAnchor="middle"
          fill={customStyles.fontColor}
          style={{
            color: customStyles.fontColor,
            fontFamily: customStyles.fontFamily,
            fontSize: customStyles.xAxisTicks.fontSize,
            fontWeight: customStyles.xAxisTicks.fontWeight,
            cursor: "pointer",
          }}
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
  labelXAxis,
}) => {
  const CustomTooltip: React.FC<TooltipProps<number, string>> = (props) => {
    const { active, payload, label } = props as TooltipProps<number, string> & {
      payload?: { payload: any }[];
      label: string;
    };
    if (!active || !payload || !payload.length) return null;

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
          sx={{
            fontFamily: customStyles.fontFamily,
            fontSize: customStyles.tooltipTitleFontSize,
            fontWeight: customStyles.tooltipDarkFontWeight,
            color: customStyles.tooltipFontColor,
            mb: 0.5,
          }}
        >
          {label}
        </Typography>

        {/* Values */}
        {payload.map((entry: any, index: number) => (
          <Stack key={index} direction={"row"} gap={0.5}>
            <Typography
              sx={{
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.tooltipTextFontSize,
                fontWeight: customStyles.tooltipLightFontWeight,
                color: customStyles.tooltipFontColor,
                lineHeight: 1.6,
              }}
            >
              {labelYAxis}:
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
              {Number(entry.value)}
            </Typography>
          </Stack>
        ))}
      </Paper>
    );
  };

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
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            horizontal={true}
            vertical={true}
            strokeDasharray={"3 3"}
          />

          <XAxis
            dataKey="name"
            height={60}
            interval={0}
            tick={(props) => (
              <CustomXAxisTick {...props} maxLabelLength={maxLabelLength} />
            )}
            label={{
              value: labelXAxis,
              angle: 0,
              position: "outsideCentre",
              style: {
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.xAxisLabels.fontSize,
                fontWeight: customStyles.xAxisLabels.fontWeight,
              },
            }}
            // tickMargin={10}
            // tick={{ fontSize: 12 }}
          />

          <YAxis
            label={{
              value: labelYAxis,
              angle: -90,
              position: "insideCentre",
              style: {
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.yAxisLabels.fontSize,
                fontWeight: customStyles.yAxisLabels.fontWeight,
              },
            }}
            width={100}
            tick={{
              color: customStyles.fontColor,
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.yAxisTicks.fontSize,
              fontWeight: customStyles.yAxisTicks.fontWeight,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="value"
            fill={barColor}
            radius={[6, 6, 0, 0]} // Rounded top
            barSize={customStyles.barSize}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default VerticalSingleBarChart;
