"use client";
import { customStyles } from "@/styles/customStyles";
import { Paper, Stack, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface AssetRiskScoreItem {
  assetName: string;
  inherentRiskScore: number;
  netRiskScore: number;
}

interface Props {
  data: AssetRiskScoreItem[];
  height?: number;
}

const AssetsRiskScoreBarChart: React.FC<Props> = ({ data, height = 460 }) => {
  // Convert raw values into billions
  const formattedData = data?.map((item) => ({
    ...item,
    inherentRiskScore: item.inherentRiskScore / 1_000_000_000,
    netRiskScore: item.netRiskScore / 1_000_000_000,
  }));

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
              $ {Number(entry.value).toFixed(2)} Bn
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
        height: height,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            horizontal={true}
            vertical={true}
            strokeDasharray={"3 3"}
          />

          <XAxis
            dataKey="assetName"
            height={70}
            tickMargin={2}
            tick={{
              color: customStyles.fontColor,
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.xAxisTicks.fontSize,
              fontWeight: customStyles.xAxisTicks.fontWeight,
            }}
            label={{
              value: "Assets",
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
            label={{
              value: "Impact (in Billion USD)",
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

          <Legend formatter={legendFormatter} />

          {/* Inherent Risk Score */}
          <Bar
            dataKey="inherentRiskScore"
            name="Inherent Impact"
            fill="#12229d"
            isAnimationActive={false}
            barSize={customStyles.barSize}
            radius={[6, 6, 0, 0]}
          />

          {/* Net Risk Score */}
          <Bar
            dataKey="netRiskScore"
            name="Residual Impact"
            fill="#6f80eb"
            isAnimationActive={false}
            barSize={customStyles.barSize}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AssetsRiskScoreBarChart;
