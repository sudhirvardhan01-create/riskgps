"use client";
import { customStyles } from "@/styles/customStyles";
import { Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
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
          <CartesianGrid horizontal={true} vertical={false} />

          <XAxis
            dataKey="assetName"
            interval={0}
            height={60}
            tickMargin={10}
            tick={{
              color: customStyles.fontColor,
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.xAxisTicks.fontSize,
              fontWeight: customStyles.xAxisTicks.fontWeight,
            }}
          />

          <YAxis
            label={{
              value: "Risk Score",
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

          <Tooltip
            formatter={(value: number) => `$ ${value.toFixed(2)} Bn`}
            labelStyle={{ fontWeight: "bold" }}
          />

          <Legend formatter={legendFormatter} />

          {/* Inherent Risk Score */}
          <Bar
            dataKey="inherentRiskScore"
            name="Inherent Risk Score"
            fill="#12229d"
            isAnimationActive={false}
            barSize={customStyles.barSize}
            radius={[6, 6, 0, 0]}
          />

          {/* Net Risk Score */}
          <Bar
            dataKey="netRiskScore"
            name="Net Risk Score"
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
