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
  TooltipProps,
  ReferenceLine,
} from "recharts";

interface Props {
  data: any[];
  bar1Label: string;
  bar2Label: string;
  dataConvertedIntoBillion: boolean;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisHeight?: number;
  showReferenceLine?: boolean;
  referenceLineValue?: number;
  referenceLineLabelValue?: string;
}

const AssetsRiskScoreBarChart: React.FC<Props> = ({
  data,
  height = 460,
  bar1Label,
  bar2Label,
  xAxisLabel,
  yAxisLabel,
  xAxisHeight = 70,
  dataConvertedIntoBillion = false,
  showReferenceLine = false,
  referenceLineValue,
  referenceLineLabelValue,
}) => {
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
      payload?: any[];
      label: string;
    };
    if (!active || !payload || !payload.length) return null;

    const bar1 = payload[0]?.value ?? 0;
    const bar2 = payload[1]?.value ?? 0;

    const diff = bar1 - bar2;
    const diffAbs = Math.abs(diff);

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
              {dataConvertedIntoBillion
                ? `$ ${Number(entry.value).toFixed(2)} Bn`
                : Number(entry.value)}
            </Typography>
          </Stack>
        ))}
        {/* Difference */}
        <Stack direction="row" gap={0.5}>
          <Typography
            sx={{
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.tooltipTextFontSize,
              fontWeight: customStyles.tooltipLightFontWeight,
              color: customStyles.tooltipFontColor,
            }}
          >
            Difference:
          </Typography>

          <Typography
            sx={{
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.tooltipTextFontSize,
              fontWeight: customStyles.tooltipDarkFontWeight,
              color: customStyles.tooltipFontColor,
            }}
          >
            {dataConvertedIntoBillion ? `$ ${diffAbs.toFixed(2)} Bn` : diffAbs}
          </Typography>
        </Stack>
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
      <Box sx={{ flexGrow: 1 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={true}
                strokeDasharray={"3 3"}
              />

              <XAxis
                dataKey="assetName"
                height={xAxisHeight}
                tickMargin={2}
                tick={{
                  color: customStyles.fontColor,
                  fontFamily: customStyles.fontFamily,
                  fontSize: customStyles.xAxisTicks.fontSize,
                  fontWeight: customStyles.xAxisTicks.fontWeight,
                }}
                axisLine={{ stroke: "#ddd" }}
                tickLine={false}
                label={{
                  value: xAxisLabel,
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
                  value: yAxisLabel,
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

              {/* Inherent Risk Score */}
              <Bar
                dataKey="bar1Value"
                name={bar1Label}
                fill="#12229d"
                isAnimationActive={false}
                barSize={customStyles.barSize}
                radius={[6, 6, 0, 0]}
              />

              {/* Net Risk Score */}
              <Bar
                dataKey="bar2Value"
                name={bar2Label}
                fill="#6f80eb"
                isAnimationActive={false}
                barSize={customStyles.barSize}
                radius={[6, 6, 0, 0]}
              />

              {showReferenceLine && (
                <ReferenceLine
                  // y={riskAppetite}
                  stroke="#ffa500"
                  strokeWidth={2}
                  label={{
                    // value: `Risk Appetite ($ ${riskAppetite} Bn)`,
                    position: "insideBottomRight",
                    fill: "#ffa500",
                    fontSize: customStyles.referenceLine.fontSize,
                    fontWeight: customStyles.referenceLine.fontWeight,
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AssetsRiskScoreBarChart;
