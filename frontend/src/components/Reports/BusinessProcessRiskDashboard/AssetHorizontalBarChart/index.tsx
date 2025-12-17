"use client";
import { customStyles } from "@/styles/customStyles";
import { Typography } from "@mui/material";
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
            <Tooltip
              formatter={(value: number) => `${value}`}
              labelStyle={{ fontWeight: "bold" }}
            />
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
