"use client";
import { customStyles } from "@/styles/customStyles";
import { Box, Paper, Stack, Typography } from "@mui/material";
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
  TooltipProps,
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
  height?: number;
}

const RiskExposureByProcessChart: React.FC<Props> = ({
  data,
  selectedProcess,
  setSelectedProcess,
  riskAppetite,
  height = 500,
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
        {/* Process Name */}
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

        {/* Values */}
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
        p: 2.5,
        backgroundColor: "#fff",
        borderRadius: 3,
        width: "100%",
        height: height,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              onClick={(e) => {
                // Clear selection by clicking empty chart area
                if (!e?.activeLabel) setSelectedProcess(null);
              }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={true}
                strokeDasharray={"3 3"}
              />

              <XAxis
                dataKey="processName"
                height={70}
                tick={{
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.xAxisTicks.fontSize,
                  fontWeight: customStyles.xAxisTicks.fontWeight,
                }}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
                // label={{
                //   value: "Business Process",
                //   angle: 0,
                //   position: "insideBottom",
                //   style: {
                //     color: customStyles.fontColor,
                //     fontFamily: customStyles.fontFamily,
                //     fontSize: customStyles.xAxisLabels.fontSize,
                //     fontWeight: customStyles.xAxisLabels.fontWeight,
                //   },
                // }}
              />

              <YAxis
                label={{
                  value: "Exposure (in Billion USD)",
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
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend formatter={legendFormatter} />

              {/* RISK EXPOSURE */}
              <Bar
                dataKey="maxRiskExposureBillion"
                name="Max Risk Exposure"
                fill="#12229d"
                shape={<CustomBar />}
                isAnimationActive={false}
                barSize={customStyles.barSize}
              />

              {/* NET EXPOSURE */}
              <Bar
                dataKey="maxNetExposureBillion"
                name="Max Net Exposure"
                fill="#6f80eb"
                shape={<CustomBar />}
                isAnimationActive={false}
                barSize={customStyles.barSize}
              />

              <ReferenceLine
                y={riskAppetite}
                stroke="#ffa500"
                strokeWidth={2}
                label={{
                  value: `Risk Appetite ($ ${riskAppetite} Bn)`,
                  position: "insideBottomRight",
                  fill: "#ffa500",
                  fontSize: customStyles.referenceLine.fontSize,
                  fontWeight: customStyles.referenceLine.fontWeight,
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

export default RiskExposureByProcessChart;
