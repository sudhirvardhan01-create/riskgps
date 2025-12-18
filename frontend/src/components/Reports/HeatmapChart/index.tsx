import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import * as d3 from "d3";
import { customStyles } from "@/styles/customStyles";

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  xOrder?: string[];
  yOrder?: string[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  xAxisLabel = "X-Axis",
  yAxisLabel = "Y-Axis",
  title,
  xOrder,
  yOrder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  /* -------------------- Resize Observer -------------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({
        width,
        height,
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* -------------------- D3 Render -------------------- */
  useEffect(() => {
    if (
      !svgRef.current ||
      !data.length ||
      dimensions.width === 0 ||
      dimensions.height === 0
    ) {
      return;
    }

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 40, left: 120 };
    const width = dimensions.width;
    const height = dimensions.height;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xValues = xOrder || Array.from(new Set(data.map((d) => d.x)));
    const yValues = yOrder || Array.from(new Set(data.map((d) => d.y)));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = d3
      .scaleBand()
      .domain(yValues)
      .range([0, innerHeight])
      .padding(0.05);

    const maxValue = d3.max(data, (d) => d.value) || 0;

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxValue])
      .range(["#cae8ff", "#12229d"]);

    const dataMap = new Map(data.map((d) => [`${d.y}-${d.x}`, d.value]));

    yValues.forEach((y) => {
      xValues.forEach((x) => {
        const value = dataMap.get(`${y}-${x}`) ?? 0;

        g.append("rect")
          .attr("x", xScale(x)!)
          .attr("y", yScale(y)!)
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .attr("fill", value > 0 ? colorScale(value) : "#f0f0f0")
          .attr("rx", 4)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .on("mouseenter", (event) => {
            d3.select(event.currentTarget)
              .attr("stroke", "#333")
              .attr("stroke-width", 2);

            if (tooltipRef.current) {
              tooltipRef.current.style.display = "block";
              tooltipRef.current.style.backgroundColor =
                customStyles.tooltipBackgroundColor;
              tooltipRef.current.style.border = `1px solid ${customStyles.tooltipBorderColor}`;
              tooltipRef.current.style.left = `${event.pageX + 10}px`;
              tooltipRef.current.style.top = `${event.pageY - 10}px`;
              tooltipRef.current.innerHTML = `
                <div style="margin-bottom: 4px; color: ${customStyles.tooltipFontColor}; font-weight: ${customStyles.tooltipDarkFontWeight}; font-size: ${customStyles.tooltipTitleFontSize}">${y}</div>
                <div style="margin-bottom: 2px; color: ${customStyles.tooltipFontColor}; font-size: ${customStyles.tooltipTextFontSize}">${xAxisLabel}: <strong>${x}</strong></div>
                <div style="color: ${customStyles.tooltipFontColor}; font-size: ${customStyles.tooltipTextFontSize}">Risk Scenarios: <strong>${value}</strong></div>
              `;
            }
          })
          .on("mousemove", (event) => {
            if (tooltipRef.current) {
              tooltipRef.current.style.left = `${event.pageX + 10}px`;
              tooltipRef.current.style.top = `${event.pageY - 10}px`;
            }
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);

            if (tooltipRef.current) {
              tooltipRef.current.style.display = "none";
            }
          });
      });
    });

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", customStyles.xAxisTicks.fontSize)
      .style("font-family", customStyles.fontFamily)
      .style("font-weight", customStyles.xAxisTicks.fontWeight)
      .style("color", customStyles.fontColor);

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", customStyles.yAxisTicks.fontSize)
      .style("font-family", customStyles.fontFamily)
      .style("font-weight", customStyles.yAxisTicks.fontWeight)
      .style("color", customStyles.fontColor);

    // X-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 2)
      .attr("text-anchor", "middle")
      .style("font-size", customStyles.yAxisLabels.fontSize)
      .style("font-weight", customStyles.xAxisLabels.fontWeight)
      .style("fill", customStyles.fontColor)
      .text(xAxisLabel);

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", customStyles.yAxisLabels.fontSize)
      .style("font-weight", customStyles.yAxisLabels.fontWeight)
      .style("fill", customStyles.fontColor)
      .text(yAxisLabel);
  }, [data, dimensions, xAxisLabel, yAxisLabel, xOrder, yOrder]);

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, width: "100%", height: "calc(100% - 40px)" }}
    >
      {title && (
        <Typography variant="body2" fontWeight={600} mb={1}>
          {title}
        </Typography>
      )}

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 300, // Default responsive height
          position: "relative",
        }}
      >
        <svg ref={svgRef} />

        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            display: "none",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      </Box>
    </Paper>
  );
};

export default HeatmapChart;
