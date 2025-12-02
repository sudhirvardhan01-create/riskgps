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
  ReferenceLine,
} from "recharts";

interface ProcessExposure {
  processName: string;
  maxRiskExposure: number;
  maxNetExposure: number;
}

interface Props {
  data: ProcessExposure[];
  selectedProcess: string | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<string | null>>;
  riskAppetite: number;
}

const RiskExposureByProcessChart: React.FC<Props> = ({
  data,
  selectedProcess,
  setSelectedProcess,
  riskAppetite,
}) => {
  // Convert raw values into billions
  const formattedData = data.map((item) => ({
    ...item,
    maxRiskExposureBillion: item.maxRiskExposure / 1_000_000_000,
    maxNetExposureBillion: item.maxNetExposure / 1_000_000_000,
  }));

  // Custom shape for bars with dynamic opacity
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload, fill } = props;

    const isSelected =
      !selectedProcess || selectedProcess === payload.processName;

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
          setSelectedProcess(payload.processName);
        }}
      />
    );
  };

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
        height: 500,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          onClick={(e) => {
            // Clear selection by clicking empty chart area
            if (!e?.activeLabel) setSelectedProcess(null);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="processName"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
            tickMargin={10}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            label={{
              value: "Exposure (in Billion USD)",
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

          {/* RISK EXPOSURE */}
          <Bar
            dataKey="maxRiskExposureBillion"
            name="Max Risk Exposure"
            fill="#12229d"
            shape={<CustomBar />}
            isAnimationActive={false}
            barSize={24}
          />

          {/* NET EXPOSURE */}
          <Bar
            dataKey="maxNetExposureBillion"
            name="Max Net Exposure"
            fill="#6f80eb"
            shape={<CustomBar />}
            isAnimationActive={false}
            barSize={24}
          />

          <ReferenceLine
            y={riskAppetite}
            stroke="#ffa500"
            strokeWidth={2}
            label={{
              value: `Risk Appetite ($ ${riskAppetite} Bn)`,
              position: "insideBottomRight",
              fill: "#ffa500",
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RiskExposureByProcessChart;
