"use client";

import { Asset } from "@/types/assessment";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";

export interface Data extends Record<string, unknown> {
  name: string;
  value: number;
}

interface DualDonutChartProps {
  innerData: Data[];
  outerData: Data[];
  tooltipData: Asset[];
  tooltipKey: string;
}

interface CustomPayloadItem {
  name: string;
  value: number;
  tooltipData?: { applicationName: string }[];
  fill?: string;
}

const COLORS_OUTER = [
  // "#4F46E5",
  // "#10B981",
  // "#F59E0B",
  // "#EF4444",
  // "#3B82F6",
  // "#8B5CF6",
  // "#14B8A6",
  // "#EAB308",
  // "#EC4899",
  // "#6366F1",
  "#12229d",
  "#233dff",
  "#6f80eb",
  "#0693e3",
  "#5cb6f9",
  "#cae8ff",
  "#d9d9d9",
  "#ffa500",
];

const COLORS_INNER = ["#CBD5E1", "#94A3B8", "#64748B"];

const DualDonutChart: React.FC<DualDonutChartProps> = ({
  innerData,
  outerData,
  tooltipData,
  tooltipKey,
}) => {
  const [activeOuterIndex, setActiveOuterIndex] = useState<number | null>(null);
  const [activeInnerIndex, setActiveInnerIndex] = useState<number | null>(null);

  if (!outerData?.length && !innerData?.length) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }

  // ✅ Calculate inner total
  const innerTotal = innerData.reduce((sum, item) => sum + item.value, 0);

  const CustomPieTooltip: React.FC<TooltipProps<number, string>> = (props) => {
    const { active, payload } = props as TooltipProps<number, string> & {
      payload?: { payload: CustomPayloadItem }[];
    };

    if (active && payload && payload.length) {
      const item = payload[0].payload;

      return (
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            borderRadius: "12px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            minWidth: 180,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 0.5, textAlign: "left", pl: 2 }}
          >
            {`${item.name} (${item.value} dependencies)`}
          </Typography>

          {tooltipData.length > 0 && (
            <List dense sx={{ py: 0, maxHeight: 150, overflowY: "auto" }}>
              {tooltipData
                .filter(
                  (asset) => asset[tooltipKey as keyof Asset] === item.name
                )
                .map((x, index) => (
                  <ListItem key={index} sx={{ py: 0.25 }}>
                    <ListItemText
                      primary={x.applicationName}
                      primaryTypographyProps={{ fontSize: "0.8rem" }}
                    />
                  </ListItem>
                ))}
            </List>
          )}
        </Paper>
      );
    }

    return null;
  };

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-center gap-6">
      <div className="w-full md:w-2/3">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            {/* Outer Ring */}
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              isAnimationActive
              onMouseEnter={(_, index) => setActiveOuterIndex(index)}
              onMouseLeave={() => setActiveOuterIndex(null)}
            >
              {outerData.map((_, index) => {
                const isActive = index === activeOuterIndex;
                const color = COLORS_OUTER[index % COLORS_OUTER.length];
                const fill = isActive ? brightenColor(color, 25) : color;
                return (
                  <Cell
                    key={`outer-${index}`}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      transition: "transform 0.3s ease, fill 0.3s ease",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                );
              })}
            </Pie>

            {/* Inner Ring */}
            <Pie
              data={innerData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              dataKey="value"
              nameKey="name"
              onMouseEnter={(_, index) => setActiveInnerIndex(index)}
              onMouseLeave={() => setActiveInnerIndex(null)}
            >
              {innerData.map((_, index) => {
                const isActive = index === activeInnerIndex;
                const color = COLORS_INNER[index % COLORS_INNER.length];
                const fill = isActive ? brightenColor(color, 20) : color;
                return (
                  <Cell
                    key={`inner-${index}`}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{
                      transition: "transform 0.3s ease, fill 0.3s ease",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                );
              })}
            </Pie>

            {/* ✅ Center Text for Inner Total */}
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                fill: "#1E293B",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {innerTotal}
            </text>

            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "8px",
                fill: "#1E293B",
                fontFamily: "Inter, sans-serif",
              }}
            >
              processes
            </text>

            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                fontFamily: "Inter, Helvetica, Arial, sans-serif",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper: brighten colors dynamically
function brightenColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `rgb(${R},${G},${B})`;
}

export default DualDonutChart;
