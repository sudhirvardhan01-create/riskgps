import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import * as d3 from "d3";

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  width?: number;
  height?: number;
  title?: string;
  xOrder?: string[];
  yOrder?: string[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  xAxisLabel = "X-Axis",
  yAxisLabel = "Y-Axis",
  width = 800,
  height = 500,
  title,
  xOrder,
  yOrder,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions and margins
    const margin = { top: 10, right: 0, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Extract unique x and y values
    const xValues = xOrder || Array.from(new Set(data.map((d) => d.x)));
    const yValues = yOrder || Array.from(new Set(data.map((d) => d.y)));

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
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

    // Color scale - from #80fff4 to #214f73
    const maxValue = d3.max(data, (d) => d.value) || 0;
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxValue])
      .range(["#cae8ff", "#12229d"]);

    // Create a map for quick data lookup
    const dataMap = new Map(data.map((d) => [`${d.y}-${d.x}`, d.value]));

    // Create cells
    yValues.forEach((yValue) => {
      xValues.forEach((xValue) => {
        const key = `${yValue}-${xValue}`;
        const value = dataMap.get(key) || 0;

        g.append("rect")
          .attr("x", xScale(xValue)!)
          .attr("y", yScale(yValue)!)
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .attr("fill", value > 0 ? colorScale(value) : "#f0f0f0")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .attr("rx", 4)
          .style("cursor", "pointer")
          .on("mouseenter", function (event) {
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 3);

            if (tooltipRef.current) {
              tooltipRef.current.style.display = "block";
              tooltipRef.current.style.left = `${event.pageX + 10}px`;
              tooltipRef.current.style.top = `${event.pageY - 10}px`;
              tooltipRef.current.innerHTML = `
                <div style="margin-bottom: 4px;"><strong>${yValue}</strong></div>
                <div style="margin-bottom: 2px;">${xAxisLabel}: ${xValue}</div>
                <div>Risk Scenarios: <strong>${value}</strong></div>
              `;
            }
          })
          .on("mousemove", function (event) {
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

    // X-axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", ".50em")
      .style("font-size", "12px");

    // Y-axis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("text-anchor", "bottom");

    // X-axis label
    // svg
    //   .append("text")
    //   .attr("x", width / 2)
    //   .attr("y", height - 10)
    //   .attr("text-anchor", "middle")
    //   .style("font-size", "14px")
    //   .style("font-weight", "bold")
    //   .text(xAxisLabel);

    // Y-axis label
    // svg
    //   .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("x", -height / 2)
    //   .attr("y", 15)
    //   .attr("text-anchor", "middle")
    //   .style("font-size", "14px")
    //   .style("font-weight", "bold")
    //   .text(yAxisLabel);
  }, [data, width, height, xAxisLabel, yAxisLabel, xOrder, yOrder]);

  return (
    <Paper elevation={3} sx={{ p: 3, width: "fit-content" }}>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <Box sx={{ position: "relative" }}>
        <svg ref={svgRef} />
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            display: "none",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "10px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            pointerEvents: "none",
            zIndex: 1000,
            lineHeight: "1.6",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        />
      </Box>
    </Paper>
  );
};

export default HeatmapChart;
