"use client";
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
}

const AssetsRiskScoreBarChart: React.FC<Props> = ({ data }) => {
  // Convert raw values into billions
  const formattedData = data?.map((item) => ({
    ...item,
    inherentRiskScore: item.inherentRiskScore / 1_000_000_000,
    netRiskScore: item.netRiskScore / 1_000_000_000,
  }));

  const legendFormatter = (value: any, entry: any, index: any) => {
    // You can apply different colors based on the value or index if needed
    return <span style={{ color: "#484848" }}>{value}</span>;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "#fff",
        borderRadius: 3,
        width: "100%",
        height: 460,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="assetName"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
            tickMargin={10}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            label={{
              value: "Risk Score",
              angle: -90,
              position: "insideCentre",
              style: { fontWeight: "bold", fontSize: 12 },
            }}
            width={100}
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
            barSize={24}
            radius={[6, 6, 0, 0]}
          />

          {/* Net Risk Score */}
          <Bar
            dataKey="netRiskScore"
            name="Net Risk Score"
            fill="#6f80eb"
            isAnimationActive={false}
            barSize={24}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AssetsRiskScoreBarChart;
