"use client";

import React, { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { fetchAssetsById } from "@/pages/api/asset";

// ---- Types ----
type Risk = {
  id: string;
  name: string;
  severity?: string;
};

type Asset = {
  id: string;
  name: string;
};

type Process = {
  id: string;
  name: string;
  assets?: Asset[];
  dependsOn?: string[];
  risks?: Risk[];
};

// ---- Props ----
interface ProcessAssetFlowProps {
  processes: Process[];
}

const nodeWidth = 200;
const nodeHeight = 70;

// ---- Layout (Dagre) ----
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  const isHorizontal = direction === "LR";

  nodes.forEach((n) =>
    dagreGraph.setNode(n.id, { width: nodeWidth, height: nodeHeight })
  );
  edges.forEach((e) => dagreGraph.setEdge(e.source, e.target));

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const n = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: n.x - nodeWidth / 2,
      y: n.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

// ---- Process Colors ----
const COLOR_PALETTES = [
  { bg: "linear-gradient(135deg, #E3F2FD, #BBDEFB)", border: "#1565C0" },
  { bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)", border: "#2E7D32" },
  { bg: "linear-gradient(135deg, #FFF3E0, #FFE0B2)", border: "#EF6C00" },
  { bg: "linear-gradient(135deg, #F3E5F5, #E1BEE7)", border: "#8E24AA" },
  { bg: "linear-gradient(135deg, #E1F5FE, #B3E5FC)", border: "#0277BD" },
];

// ---- Component ----
const ProcessAssetFlow: React.FC<ProcessAssetFlowProps> = ({ processes }) => {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  processes.forEach((process, index) => {
    const color = COLOR_PALETTES[index % COLOR_PALETTES.length];

    // Process Node
    initialNodes.push({
      id: process.id,
      data: { label: process.name, type: "process" },
      position: { x: 0, y: 0 },
      draggable: false,
      style: {
        borderRadius: 14,
        padding: 10,
        background: color.bg,
        border: `2px solid ${color.border}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.2s ease-in-out",
      },
    });

    // Asset Nodes
    process.assets?.forEach((asset) => {
      const assetId = `${process.id}-${asset.id}`;
      initialNodes.push({
        id: assetId,
        data: { id: asset.id, label: asset.name, type: "asset" },
        position: { x: 0, y: 0 },
        draggable: false,
        style: {
          borderRadius: 8,
          padding: "6px 10px",
          background: "#FFFDE7",
          border: "1.5px solid #FBC02D",
          fontSize: 13,
          fontWeight: 500,
          color: "#795548",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
        },
      });

      initialEdges.push({
        id: `edge-${process.id}-${asset.id}`,
        source: process.id,
        target: assetId,
        type: "smoothstep",
        style: { strokeWidth: 1.6, stroke: "#42a5f5" },
        // markerEnd: { type: MarkerType.ArrowClosed, color: "#42a5f5" },
      });
    });

    // Process Dependencies
    process.dependsOn?.forEach((depId) => {
      if (processes.some((p) => p.id === depId)) {
        initialEdges.push({
          id: `proc-edge-${depId}-${process.id}`,
          source: depId,
          target: process.id,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#ef5350" },
          style: { strokeWidth: 2, stroke: "#ef5350" },
        });
      }
    });
  });

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges, "LR"),
    [processes]
  );

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  // ---- Node Click ----
  const handleNodeClick = async (_: any, node: Node) => {
    if (node.data?.type === "process") {
      const clickedProcess = processes.find((p) => p.id === node.id);
      setSelectedProcess(clickedProcess || null);
      setSelectedAsset(null);
    } else if (node.data?.type === "asset") {
      const data = await fetchAssetsById(node.data?.id);
      setSelectedAsset(data.data);
      setSelectedProcess(null);
    } else {
      setSelectedProcess(null);
      setSelectedAsset(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "420px",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Left: Flow chart */}
      <Box
        sx={{
          flex: 3,
          background: "linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          defaultViewport={{ x: 0, y: 0, zoom: 2 }}
          style={{
            background: "linear-gradient(135deg, #f9f9ff 0%, #eef3f9 100%)",
            borderRadius: 12,
          }}
        >
          <MiniMap
            nodeColor={(n) =>
              n.data.type === "process"
                ? "#90caf9"
                : n.data.type === "asset"
                ? "#ffe082"
                : "#cfd8dc"
            }
            maskColor="rgba(0, 0, 0, 0.1)"
            zoomable
            pannable
          />
          <Controls
            showInteractive={false}
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Background color="#e0e0e0" gap={16} />
        </ReactFlow>
      </Box>

      {/* Right: Info Panel */}
      {(selectedProcess || selectedAsset) && (
        <Box
          sx={{
            flex: 1.2,
            background: "#ffffff",
            borderLeft: "1px solid #eee",
            p: 3,
            overflowY: "auto",
            transition: "all 0.3s ease",
          }}
        >
          {selectedProcess && (
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#1565C0">
                  {selectedProcess.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Risk Scenarios:
                </Typography>

                {selectedProcess.risks && selectedProcess.risks.length > 0 ? (
                  selectedProcess.risks.map((r) => (
                    <Box
                      key={r.id}
                      sx={{
                        p: 1.2,
                        mb: 1,
                        borderRadius: 2,
                        background:
                          r.severity === "High"
                            ? "#FFEBEE"
                            : r.severity === "Medium"
                            ? "#FFF8E1"
                            : "#E8F5E9",
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {r.name}
                      </Typography>
                      {r.severity && (
                        <Chip
                          label={r.severity}
                          size="small"
                          sx={{
                            mt: 0.5,
                            fontWeight: 600,
                            color:
                              r.severity === "High"
                                ? "#C62828"
                                : r.severity === "Medium"
                                ? "#EF6C00"
                                : "#2E7D32",
                            backgroundColor:
                              r.severity === "High"
                                ? "#FFCDD2"
                                : r.severity === "Medium"
                                ? "#FFE0B2"
                                : "#C8E6C9",
                          }}
                        />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No risks defined for this process.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {selectedAsset && (
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#FBC02D">
                  {selectedAsset.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Controls:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No controls defined for this asset.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProcessAssetFlow;
