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
        onClick={() => setSelectedProcess(payload.processName)}
      />
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
        height: 500,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
            height={90}
            tickMargin={10}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            label={{
              value: "Exposure (in Billion USD)",
              angle: -90,
              position: "insideCentre",
            }}
          />

          <Tooltip
            formatter={(value: number) => `$ ${value.toFixed(2)} Bn`}
            labelStyle={{ fontWeight: "bold" }}
          />

          <Legend />

          {/* RISK EXPOSURE */}
          <Bar
            dataKey="maxRiskExposureBillion"
            name="Max Risk Exposure"
            fill="#FF6B6B"
            shape={<CustomBar />}
            isAnimationActive={false}
          />

          {/* NET EXPOSURE */}
          <Bar
            dataKey="maxNetExposureBillion"
            name="Max Net Exposure"
            fill="#4E89FF"
            shape={<CustomBar />}
            isAnimationActive={false}
          />

          <ReferenceLine
            y={riskAppetite}
            stroke="red"
            strokeWidth={2}
            label={{
              value: `Risk Appetite ($ ${riskAppetite} Bn)`,
              position: "insideTopRight",
              fill: "red",
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
