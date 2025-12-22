"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { AssetLevelReportsData } from "@/types/reports";
import { customStyles } from "@/styles/customStyles";

interface AssetControlFamilyLineChartProps {
  asset: AssetLevelReportsData;
}

const AssetControlFamilyLineChart: React.FC<
  AssetControlFamilyLineChartProps
> = ({ asset }) => {
  const data = asset?.controls
    ?.map((item) => {
      if (item.calcultatedControlScore === null) return null;
      return {
        nistCategory: item.controlCategoryId,
        mitreMappedNistScore: item.calcultatedControlScore,
        orgCurrentScore: item.currentScore,
        orgTargeScore: item.targetScore,
      };
    })
    .filter(Boolean);

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
              {Number(entry.value)}
            </Typography>
          </Stack>
        ))}
      </Paper>
    );
  };

  return (
    // <Paper
    //   elevation={0}
    //   sx={{
    //     p: 2,
    //     backgroundColor: "#fff",
    //     borderRadius: 3,
    //     width: "100%",
    //     height: 450,
    //     display: "flex",
    //     flexDirection: "column",
    //   }}
    // >
    //   <Stack direction={"row"} justifyContent={"space-between"}>
    //     <Typography
    //       variant="body2"
    //       fontWeight={600}
    //       textAlign="left"
    //       sx={{ mb: 2 }}
    //       color="text.primary"
    //     >
    //       {asset?.asset}
    //     </Typography>
    //     {/* <FormControl
    //         variant="outlined"
    //         sx={{ height: "48px", width: "200px" }}
    //       >
    //         <InputLabel
    //           id="business-unit-label"
    //           shrink
    //           sx={{ backgroundColor: "#f5f5f5" }}
    //         >
    //           Asset
    //         </InputLabel>
    //         <Select
    //           labelId="business-unit-label"
    //           value={selectedBusinessUnit}
    //           onChange={(e) => {
    //             setSelectedBusinessUnit(e.target.value);
    //           }}
    //           sx={{ borderRadius: "8px" }}
    //         >
    //           {businessUnits.map((item, index) => (
    //             <MenuItem value={item} key={index}>
    //               {item}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl> */}
    //   </Stack>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        <CartesianGrid
          horizontal={true}
          vertical={true}
          strokeDasharray={"3 3"}
        />
        <XAxis
          dataKey="nistCategory"
          height={55}
          tickMargin={2}
          tick={{
            color: customStyles.fontColor,
            fontFamily: customStyles.fontFamily,
            fontSize: customStyles.xAxisTicks.fontSize,
            fontWeight: customStyles.xAxisTicks.fontWeight,
          }}
          label={{
            value: "NIST Control Category",
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
          domain={[0, 6]}
          tick={{
            color: customStyles.fontColor,
            fontFamily: customStyles.fontFamily,
            fontSize: customStyles.yAxisTicks.fontSize,
            fontWeight: customStyles.yAxisTicks.fontWeight,
          }}
          tickFormatter={(v) => v.toFixed(0)}
          label={{
            value: "Control Score",
            angle: -90,
            position: "insideCentre",
            style: {
              color: customStyles.fontColor,
              fontFamily: customStyles.fontFamily,
              fontSize: customStyles.yAxisLabels.fontSize,
              fontWeight: customStyles.yAxisLabels.fontWeight,
            },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={legendFormatter} />
        <Line
          type="monotone"
          dataKey="orgCurrentScore"
          name="Org Current Score"
          stroke="#233dff"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="orgTargeScore"
          name="Org Target Score"
          stroke="#6f80eb"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="mitreMappedNistScore"
          name="Asset Current Score"
          stroke="#12229d"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
    // </Paper>
  );
};

export default AssetControlFamilyLineChart;
