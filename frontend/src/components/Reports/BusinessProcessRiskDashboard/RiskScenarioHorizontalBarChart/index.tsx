"use client";
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

export interface RiskScenarioItem {
  riskScenario: string;
  riskExposure: number; // in USD
  netExposure: number; // in USD
}

interface Props {
  data: RiskScenarioItem[];
  selectedRiskScenario: string | null;
  setSelectedRiskScenario: React.Dispatch<React.SetStateAction<string | null>>;
}

const RiskScenarioHorizontalBarChart: React.FC<Props> = ({
  data,
  selectedRiskScenario,
  setSelectedRiskScenario,
}) => {
  // Convert numeric values to billions
  const formattedData = data.map((d) => ({
    ...d,
    riskExposureBillion: d.riskExposure / 1_000_000_000,
    netExposureBillion: d.netExposure / 1_000_000_000,
  }));

  // Custom shape for bars with dynamic opacity
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload, fill } = props;

    const isSelected =
      !selectedRiskScenario || selectedRiskScenario === payload.riskScenario;

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
          setSelectedRiskScenario(payload.riskScenario);
        }}
      />
    );
  };

  return (
    <>
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            onClick={(e) => {
              // Clear selection by clicking empty chart area
              if (!e?.activeLabel) setSelectedRiskScenario(null);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              label={{
                value: "Exposure (in Billion USD)",
                position: "insideCentre",
                offset: -5,
                style: { fontWeight: "bold", fontSize: 10 },
              }}
              height={60}
            />
            <YAxis type="category" dataKey="riskScenario" width={200} />
            <Tooltip
              formatter={(value: number) => `$ ${value.toFixed(2)} Bn`}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend />

            {/* Risk Exposure Bar */}
            <Bar
              dataKey="riskExposureBillion"
              name="Risk Exposure (B)"
              fill="#31a8b2"
              shape={<CustomBar />}
              isAnimationActive={false}
              barSize={24}
            />

            {/* Net Exposure Bar */}
            <Bar
              dataKey="netExposureBillion"
              name="Net Exposure (B)"
              fill="#20cfcf"
              shape={<CustomBar />}
              isAnimationActive={false}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography>No data available</Typography>
      )}
    </>
  );
};

export default RiskScenarioHorizontalBarChart;
