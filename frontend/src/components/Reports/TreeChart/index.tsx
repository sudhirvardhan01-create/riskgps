"use client";
import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";

const buildTreeData = (processes) => {
  return processes.map((process) => ({
    name: process.name,
    children: [
      {
        name: "Assets",
        children: process.assets.map((asset) => ({
          name: asset.name,
          attributes: {
            Description: asset.description,
          },
        })),
      },
      {
        name: "Risks",
        children: process.risks.map((risk) => ({
          name: risk.name,
          attributes: { Description: risk.description },
          children: risk.taxonomy.map((tax) => ({
            name: tax.name,
            attributes: {
              Severity: tax.severityDetails?.name,
              Range: `${tax.severityDetails?.minRange} - ${tax.severityDetails?.maxRange}`,
              Color: tax.severityDetails?.color,
            },
          })),
        })),
      },
    ],
  }));
};

const TreeChart = ({ processes }) => {
  const [treeData, setTreeData] = useState([]);
  const treeContainer = useRef(null);

  useEffect(() => {
    if (processes && processes.length > 0) {
      setTreeData(buildTreeData(processes));
    }
  }, [processes]);

  const containerStyles = {
    width: "100%",
    height: "90vh",
    background: "#f8fafc",
    borderRadius: "12px",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
  };

  const getSeverityColor = (level) => {
    if (!level) return "#cbd5e1";
    const map = {
      "Very Low": "#22c55e",
      Low: "#84cc16",
      Medium: "#facc15",
      High: "#f97316",
      "Very High": "#ef4444",
    };
    return map[level] || "#3b82f6";
  };

  const renderNode = ({ nodeDatum, toggleNode, hierarchyPointNode }) => {
    const severity = nodeDatum.attributes?.Severity;
    const badgeColor = getSeverityColor(severity);
    const borderColor = nodeDatum.attributes?.Color || badgeColor;
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const isRoot = hierarchyPointNode.depth === 0;

    const baseStyle = {
      cursor: hasChildren ? "pointer" : "default",
      borderRadius: "12px",
      padding: "10px 14px",
      background: "#fff",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.25s ease",
    };

    const nodeStyle = isRoot
      ? {
          ...baseStyle,
          border: "3px solid transparent",
          backgroundImage:
            "linear-gradient(#fff, #fff), linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          backgroundOrigin: "border-box",
          backgroundClip: "content-box, border-box",
          width: "220px",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#1e293b",
          boxShadow: "0 0 20px rgba(59,130,246,0.25)",
        }
      : {
          ...baseStyle,
          border: `2px solid ${borderColor}`,
          width: "200px",
          minHeight: "60px",
        };

    return (
      <g>
        <foreignObject x={-110} y={-20} width={240} height={200}>
          <div
            onClick={toggleNode}
            style={{
              ...nodeStyle,
              overflow: "visible",
              whiteSpace: "normal",
              wordBreak: "break-word",
              textAlign: "center",
              lineHeight: "1.3",
              height: "auto", // 👈 allows auto expansion
            }}
          >
            <div
              style={{
                fontWeight: isRoot ? 700 : 600,
                color: "#1e293b",
                fontSize: isRoot ? "1rem" : "0.9rem",
                marginBottom: severity ? "4px" : "0",
              }}
            >
              {nodeDatum.name}
            </div>

            {severity && (
              <span
                style={{
                  background: badgeColor,
                  color: "white",
                  borderRadius: "10px",
                  padding: "2px 8px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  marginBottom: "3px",
                }}
              >
                {severity}
              </span>
            )}

            {nodeDatum.attributes &&
              Object.entries(nodeDatum.attributes).map(([key, val]) => {
                if (key === "Severity" || key === "Color") return null;
                return (
                  <div
                    key={key}
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      lineHeight: "1.3",
                      marginTop: "2px",
                    }}
                  >
                    <strong>{key}: </strong>
                    {val}
                  </div>
                );
              })}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div style={containerStyles} ref={treeContainer}>
      {treeData.length > 0 && (
        <Tree
          data={treeData}
          translate={{ x: 200, y: 400 }}
          orientation="horizontal"
          zoomable
          collapsible
          transitionDuration={800}
          renderCustomNodeElement={renderNode}
          pathFunc={"diagonal"}
          nodeSize={{ x: 280, y: 180 }}
          separation={{ siblings: 2, nonSiblings: 2.5 }}
          shouldCollapseNeighborNodes={false}
          enableLegacyTransitions={false}
        />
      )}
    </div>
  );
};

export default TreeChart;
