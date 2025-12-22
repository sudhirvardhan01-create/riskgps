"use client";
import { customStyles } from "@/styles/customStyles";
import { Paper, Stack, Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";

export interface AssetItem {
  applicationName: string;
  controlStrength: number; // in USD
  targetStrength: number; // in USD
}

interface Props {
  data: AssetItem[];
  selectedAsset: string | null;
  setSelectedAsset: React.Dispatch<React.SetStateAction<string | null>>;
}

const AssetHorizontalBarChart: React.FC<Props> = ({
  data,
  selectedAsset,
  setSelectedAsset,
}) => {
  // Custom shape for bars with dynamic opacity
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload, fill } = props;

    const isSelected =
      !selectedAsset || selectedAsset === payload.applicationName;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={6}
        ry={6}
        opacity={isSelected ? 1 : 0.3}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedAsset(payload.applicationName);
        }}
      />
    );
  };

  const legendFormatter = (value: any, entry: any, index: any) => {
    // You can apply different colors based on the value or index if needed
    return (
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
    );
  };

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
              {entry.name}:
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

  return (
    <>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            onClick={(e) => {
              // Clear selection by clicking empty chart area
              if (!e?.activeLabel) setSelectedAsset(null);
            }}
          >
            <CartesianGrid horizontal={false} vertical={true} />

            <XAxis
              type="number"
              height={70}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.xAxisTicks.fontSize,
                fontWeight: customStyles.xAxisTicks.fontWeight,
              }}
              label={{
                value: "Control Strength",
                angle: 0,
                position: "outsideCentre",
                style: {
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.xAxisLabels.fontSize,
                  fontWeight: customStyles.xAxisLabels.fontWeight,
                },
              }}
            />
            <YAxis
              type="category"
              dataKey="applicationName"
              width={200}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.yAxisTicks.fontSize,
                fontWeight: customStyles.yAxisTicks.fontWeight,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={legendFormatter} />

            {/* Control Strength Bar */}
            <Bar
              dataKey="controlStrength"
              name="Current Control Strength"
              fill="#12229d"
              shape={<CustomBar />}
              isAnimationActive={false}
              barSize={customStyles.barSize}
            />

            {/* Target Strength Bar */}
            <Bar
              dataKey="targetStrength"
              name="Target Strength"
              fill="#6f80eb"
              shape={<CustomBar />}
              isAnimationActive={false}
              barSize={customStyles.barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography>No data available</Typography>
      )}
    </>
  );
};

export default AssetHorizontalBarChart;
