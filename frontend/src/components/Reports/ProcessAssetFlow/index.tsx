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
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
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

const nodeWidth = 180;
const nodeHeight = 60;

// ---- Layout (Dagre) ----
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

// ---- Component ----
const ProcessAssetFlow: React.FC<ProcessAssetFlowProps> = ({ processes }) => {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  processes.forEach((process) => {
    // Process Node
    initialNodes.push({
      id: process.id,
      data: { label: process.name, type: "process" },
      position: { x: 0, y: 0 },
      type: "default",
      draggable: false,
      style: {
        borderRadius: 12,
        padding: 10,
        background: "#fff",
        border: "1.5px solid #bbb",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
      },
    });

    // Asset Nodes
    process.assets?.forEach((asset) => {
      const assetId = `${process.id}-${asset.id}`;
      initialNodes.push({
        id: assetId,
        data: { id: asset.id, label: asset.name, type: "asset" },
        position: { x: 0, y: 0 },
        type: "default",
        draggable: false,
        style: {
          borderRadius: 8,
          padding: 6,
          background: "#f8f8f8",
          border: "1px solid #ddd",
          cursor: "pointer",
        },
      });

      initialEdges.push({
        id: `edge-${process.id}-${asset.id}`,
        source: process.id,
        target: assetId,
        type: "smoothstep",
        //markerEnd: { type: MarkerType.ArrowClosed, color: "#517ca0" },
        style: { strokeWidth: 1.5, stroke: "#517ca0" },
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
          markerEnd: { type: MarkerType.ArrowClosed, color: "#fc816d" },
          style: { strokeWidth: 2, stroke: "#fc816d" },
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
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "420px" }}>
      {/* Left: Flow chart */}
      <Box sx={{ flex: 3, backgroundColor: "#fafafa" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeClick={handleNodeClick}
          panOnDrag
          zoomOnScroll
          fitView
        >
          <MiniMap zoomable={false} pannable={false} />
          <Controls />
          <Background color="#e0e0e0" gap={16} />
        </ReactFlow>
      </Box>

      {/* Right: Risk panel */}
      {selectedProcess && (
        <Box
          sx={{
            flex: 1,
            borderLeft: "1px solid #ddd",
            p: 2,
            background: "#fff",
            overflowY: "auto",
          }}
        >
          {selectedProcess ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {selectedProcess.name}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Risk Scenarios:
                </Typography>
                {selectedProcess.risks && selectedProcess.risks.length > 0 ? (
                  selectedProcess.risks.map((r) => (
                    <Box
                      key={r.id}
                      sx={{
                        p: 1,
                        mb: 1,
                        border: "1px solid #eee",
                        borderRadius: 2,
                        background: "#fafafa",
                      }}
                    >
                      <Typography variant="body1">{r.name}</Typography>
                      {r.severity && (
                        <Typography variant="caption" color="text.secondary">
                          Severity: {r.severity}
                        </Typography>
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
          ) : (
            <Typography
              color="text.secondary"
              sx={{ mt: 5, textAlign: "center" }}
            >
              Click a process node to view its risk scenarios
            </Typography>
          )}
        </Box>
      )}

      {/* Right: Risk panel */}
      {selectedAsset && (
        <Box
          sx={{
            flex: 1,
            borderLeft: "1px solid #ddd",
            p: 2,
            background: "#fff",
            overflowY: "auto",
          }}
        >
          {selectedAsset ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {selectedAsset.name}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Controls:
                </Typography>
                {/* {selectedProcess.controls &&
                selectedProcess.controls.length > 0 ? (
                  selectedProcess.controls.map((r) => (
                    <Box
                      key={r.id}
                      sx={{
                        p: 1,
                        mb: 1,
                        border: "1px solid #eee",
                        borderRadius: 2,
                        background: "#fafafa",
                      }}
                    >
                      <Typography variant="body1">{r.name}</Typography>
                      {r.severity && (
                        <Typography variant="caption" color="text.secondary">
                          Severity: {r.severity}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No controls defined for this asset.
                  </Typography>
                )} */}
              </CardContent>
            </Card>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ mt: 5, textAlign: "center" }}
            >
              Click a asset node to view its controls
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProcessAssetFlow;
