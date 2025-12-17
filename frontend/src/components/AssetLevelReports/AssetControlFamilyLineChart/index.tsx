"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
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
import { AssetLevelReportsData } from "@/types/reports";
import { customStyles } from "@/styles/customStyles";

interface AssetControlFamilyLineChartProps {
  asset: AssetLevelReportsData;
}

const AssetControlFamilyLineChart: React.FC<
  AssetControlFamilyLineChartProps
> = ({ asset }) => {
  const data = asset?.controls
    ?.map((item) => {
      if (item.calcultatedControlScore === null) return null;
      return {
        nistCategory: item.controlCategoryId,
        mitreMappedNistScore: item.calcultatedControlScore,
        orgCurrentScore: item.currentScore,
        orgTargeScore: item.targetScore,
      };
    })
    .filter(Boolean);

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
        {asset?.asset} – Org vs Asset Control Scores
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
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={true}
              strokeDasharray={"3 3"}
            />
            <XAxis
              dataKey="nistCategory"
              height={60}
              tickMargin={2}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.xAxisTicks.fontSize,
                fontWeight: customStyles.xAxisTicks.fontWeight,
              }}
              label={{
                value: "NIST Control Category",
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
              domain={[0, 6]}
              tick={{
                color: customStyles.fontColor,
                fontFamily: customStyles.fontFamily,
                fontSize: customStyles.yAxisTicks.fontSize,
                fontWeight: customStyles.yAxisTicks.fontWeight,
              }}
              tickFormatter={(v) => v.toFixed(0)}
              label={{
                value: "Control Score",
                angle: -90,
                position: "insideCentre",
                style: {
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.yAxisLabels.fontSize,
                  fontWeight: customStyles.yAxisLabels.fontWeight,
                },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toFixed(2),
                name,
              ]}
            />
            <Legend formatter={legendFormatter} />
            <Line
              type="monotone"
              dataKey="orgCurrentScore"
              name="Org Current Score"
              stroke="#233dff"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="orgTargeScore"
              name="Org Target Score"
              stroke="#6f80eb"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="mitreMappedNistScore"
              name="Asset Current Score"
              stroke="#12229d"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Paper>
  );
};

export default AssetControlFamilyLineChart;
