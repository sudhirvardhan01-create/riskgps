"use client";

import React, { useMemo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
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
      <Box sx={{ flexGrow: 1 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={true}
                strokeDasharray={"3 3"}
              />
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
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
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
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="controlStrength"
                name="Asset Control Strength"
                fill="#12229d"
                barSize={customStyles.barSize}
                radius={[0, 4, 4, 0]}
              />
              <ReferenceLine
                x={avgCurrent}
                stroke="#6f80eb"
                strokeWidth={2}
                label={{
                  value: `Current Score: ${avgCurrent.toFixed(2)}`,
                  position: "insideBottomRight",
                  fill: "#484848",
                  fontSize: 11,
                  // dy: 12,
                }}
              />
              <ReferenceLine
                x={targetScore}
                stroke="#5cb6f9"
                strokeWidth={2}
                label={{
                  value: `Target Score: ${targetScore.toFixed(2)}`,
                  position: "insideBottomRight",
                  fill: "#484848",
                  dy: -20,
                  fontSize: 11,
                }}
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

export default AssetStrengthBarChart;
