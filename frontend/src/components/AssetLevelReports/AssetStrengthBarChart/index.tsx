"use client";

import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
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
import { customStyles } from "@/styles/customStyles";

interface AssetStrengthBarChartProps {
  assets: AssetLevelReportsData[];
}

const AssetStrengthBarChart: React.FC<AssetStrengthBarChartProps> = ({
  assets,
}) => {
  const data = useMemo(
    () =>
      assets.map((a) => ({
        assetName: a.asset,
        controlStrength: a.controlStrength,
      })),
    [assets]
  );

  const avgCurrent =
    data.reduce((sum, d) => sum + (d.controlStrength ?? 0), 0) / data.length ||
    0;
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
      <Typography
        variant="body2"
        fontWeight={600}
        textAlign="left"
        sx={{ mb: 2 }}
        color="text.primary"
      >
        BU - Asset Control Strength Chart
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: "#fff",
          borderRadius: 3,
          width: "100%",
          height: 450,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          >
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis
              type="number"
              domain={[0, 5]}
              height={60}
              tickFormatter={(v) => v.toFixed(1)}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.xAxisTicks.fontSize,
                fontWeight: customStyles.xAxisTicks.fontWeight,
              }}
              label={{
                value: "Control Score",
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
              dataKey="assetName"
              width={100}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.yAxisTicks.fontSize,
                fontWeight: customStyles.yAxisTicks.fontWeight,
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toFixed(2),
                name,
              ]}
            />
            <Bar
              dataKey="controlStrength"
              name="Asset Control Strength"
              fill="#12229d"
              barSize={customStyles.barSize}
              radius={[0, 4, 4, 0]}
            />
            <ReferenceLine
              x={avgCurrent}
              stroke="#12229d"
              strokeWidth={2}
              label={{
                value: `Current Score: ${avgCurrent.toFixed(2)}`,
                position: "insideBottomRight",
                fill: "#233dff",
                fontSize: 11,
                // dy: 12,
              }}
            />
            <ReferenceLine
              x={targetScore}
              stroke="#6f80eb"
              strokeWidth={2}
              label={{
                value: `Target Score: ${targetScore.toFixed(2)}`,
                position: "insideBottomRight",
                fill: "#6f80eb",
                dy: -20,
                fontSize: 11,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Paper>
  );
};

export default AssetStrengthBarChart;
