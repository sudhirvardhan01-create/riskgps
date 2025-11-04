"use client";

import React, { JSX, useMemo, useState } from "react";
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
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import { fetchAssetsById } from "@/pages/api/asset";
import { Apartment, Business, Lan, Storage } from "@mui/icons-material";

const nodeWidth = 220;
const nodeHeight = 70;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

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
    node.position = { x: n.x - nodeWidth / 2, y: n.y - nodeHeight / 2 };
  });
  return { nodes, edges };
};

const ProcessAssetFlow = ({ data }: { data: any }) => {
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // --- Data Transform ---
  function transformHierarchyForFlow(data: any) {
    if (!data?.organizationId || !Array.isArray(data.businessUnits))
      return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const orgNodeId = data.organizationId;

    // Organization node
    nodes.push({
      id: orgNodeId,
      data: {
        label: data.name,
        type: "organization",
        description: data.desc || "",
      },
      position: { x: 0, y: 0 },
      style: { background: "linear-gradient(135deg, #1565C0, #42A5F5)" },
    });

    data.businessUnits.forEach((unit: any) => {
      const buId = unit.orgBusinessUnitId;
      nodes.push({
        id: buId,
        data: { label: unit.name, type: "businessUnit" },
        position: { x: 0, y: 0 },
        style: { background: "linear-gradient(135deg, #6A1B9A, #AB47BC)" },
      });

      edges.push({
        id: `org-${buId}`,
        source: orgNodeId,
        target: buId,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6A1B9A" },
        style: { strokeWidth: 2, stroke: "#6A1B9A" },
      });

      (unit.processes || []).forEach((process: any) => {
        const processId = process.id;
        nodes.push({
          id: processId,
          data: {
            label: process.processName,
            type: "process",
            description: process.processDescription || "",
          },
          position: { x: 0, y: 0 },
          style: {
            background: "linear-gradient(135deg, #EF6C00, #FFB74D)",
            cursor: "pointer",
          },
        });

        edges.push({
          id: `bu-${buId}-${processId}`,
          source: buId,
          target: processId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#EF6C00" },
          style: {
            strokeWidth: 1.6,
            stroke: "#EF6C00",
            strokeDasharray: "4 2",
          },
        });

        (process.assets || []).forEach((asset: any) => {
          const assetId = `${processId}-${asset.id}`;
          nodes.push({
            id: assetId,
            data: { id: asset.id, label: asset.applicationName, type: "asset" },
            position: { x: 0, y: 0 },
            style: {
              background: "linear-gradient(135deg, #2E7D32, #81C784)",
              cursor: "pointer",
            },
          });

          edges.push({
            id: `proc-${processId}-${assetId}`,
            source: processId,
            target: assetId,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, color: "#2E7D32" },
            style: {
              strokeWidth: 1.5,
              stroke: "#2E7D32",
              strokeDasharray: "3 3",
            },
          });
        });
      });
    });
    return { nodes, edges };
  }

  // --- Layout & States ---
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const { nodes, edges } = transformHierarchyForFlow(data);
    return getLayoutedElements(nodes, edges, "TB");
  }, [data]);

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  // --- Node Click Logic ---
  const handleNodeClick = async (_: any, node: Node) => {
    if (node.data?.type === "process") {
      let clickedProcess: any = null;
      data.businessUnits?.forEach((unit: any) => {
        unit.processes?.forEach((process: any) => {
          if (process.id === node.id) {
            clickedProcess = {
              id: process.id,
              name: process.processName,
              description: process.processDescription,
              businessUnit: unit.name,
              assets: process.assets || [],
              risks: process.riskScenarios || [],
              status: process.status,
            };
          }
        });
      });
      setSelectedProcess(clickedProcess);
      setSelectedAsset(null);
    } else if (node.data?.type === "asset") {
      const assetData = await fetchAssetsById(node.data?.id);
      setSelectedAsset(assetData);
      setSelectedProcess(null);
    } else {
      setSelectedProcess(null);
      setSelectedAsset(null);
    }
  };

  const nodeTypes = useMemo(
    () => ({
      default: ({ data }: any) => {
        const colors: Record<string, { gradient: string; icon: JSX.Element }> =
          {
            organization: {
              gradient: "linear-gradient(135deg, #1565C0, #42A5F5)",
              icon: <Business fontSize="small" sx={{ color: "#fff" }} />,
            },
            businessUnit: {
              gradient: "linear-gradient(135deg, #6A1B9A, #AB47BC)",
              icon: <Apartment fontSize="small" sx={{ color: "#fff" }} />,
            },
            process: {
              gradient: "linear-gradient(135deg, #EF6C00, #FFB74D)",
              icon: <Lan fontSize="small" sx={{ color: "#fff" }} />,
            },
            asset: {
              gradient: "linear-gradient(135deg, #2E7D32, #81C784)",
              icon: <Storage fontSize="small" sx={{ color: "#fff" }} />,
            },
          };

        const color = colors[data.type] || colors.organization;
        const description =
          data.description?.length > 90
            ? data.description.substring(0, 90) + "..."
            : data.description || "";

        return (
          <Box
            sx={{
              width: 240,
              minHeight: 110,
              background: color.gradient,
              border: "1.5px solid rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(8px)",
              borderRadius: 3,
              p: 2,
              color: "#fff",
              fontWeight: 500,
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
              },
            }}
          >
            <Handle
              type="target"
              position={Position.Top}
              style={{ opacity: 0 }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
                textAlign: "center",
              }}
            >
              {color.icon}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data.label}
              </Typography>
            </Box>

            {description && (
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </Typography>
            )}

            <Handle
              type="source"
              position={Position.Bottom}
              style={{ opacity: 0 }}
            />
          </Box>
        );
      },
    }),
    []
  );

  // --- Render ---
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
      <Box
        sx={{
          flex: 3.2,
          background: "#fafafa",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll
          zoomOnPinch
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap
            nodeColor={(n) =>
              n.data.type === "process"
                ? "#FFB74D"
                : n.data.type === "asset"
                ? "#81C784"
                : "#90CAF9"
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

      {(selectedProcess || selectedAsset) && (
        <Box
          sx={{
            flex: 1.4,
            background: "#fff",
            borderLeft: "1px solid #eee",
            p: 3,
            overflowY: "auto",
          }}
        >
          {selectedProcess && (
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#EF6C00">
                  {selectedProcess.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Risk Scenarios:
                </Typography>
                {selectedProcess.risks?.length > 0 ? (
                  selectedProcess.risks.map((r: any) => (
                    <Box
                      key={r.id}
                      sx={{
                        p: 1.2,
                        mb: 1,
                        borderRadius: 2,
                        background: r.ciaMapping?.includes("C")
                          ? "#E3F2FD"
                          : r.ciaMapping?.includes("I")
                          ? "#FFF8E1"
                          : "#E8F5E9",
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {r.riskScenario}
                      </Typography>
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
        </Box>
      )}
    </Box>
  );
};

export default ProcessAssetFlow;
