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
  const firstProcess = data.businessUnits[0].processes[0];
  const [selectedProcess, setSelectedProcess] = useState<any>({
    id: firstProcess.id,
    name: firstProcess.processName,
    description: firstProcess.processDescription,
    businessUnit: data.businessUnits[0].name,
    assets: firstProcess.assets || [],
    riskScenarios: firstProcess.riskScenarios || [],
    status: firstProcess.status,
  });
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
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    });

    data.businessUnits.forEach((unit: any) => {
      const buId = unit.orgBusinessUnitId;
      nodes.push({
        id: buId,
        data: { label: unit.name, type: "businessUnit" },
        position: { x: 0, y: 0 },
        style: {
          backgroundColor: "transparent",
          border: "none",
        },
      });

      edges.push({
        id: `org-${buId}`,
        source: orgNodeId,
        target: buId,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#233dff" },
        style: { strokeWidth: 2, stroke: "#233dff" },
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
            backgroundColor: "transparent",
            border: "none",
          },
        });

        edges.push({
          id: `bu-${buId}-${processId}`,
          source: buId,
          target: processId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#6f80eb" },
          style: {
            strokeWidth: 1.6,
            stroke: "#6f80eb",
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
              backgroundColor: "transparent",
              border: "none",
            },
          });

          edges.push({
            id: `proc-${processId}-${assetId}`,
            source: processId,
            target: assetId,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, color: "#5cb6f9" },
            style: {
              strokeWidth: 1.5,
              stroke: "#5cb6f9",
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
              riskScenarios: process.riskScenarios || [],
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
        const colors: Record<
          string,
          { backgroundColor: string; icon: JSX.Element; borderColor: string }
        > = {
          organization: {
            backgroundColor: "linear-gradient(135deg, #12229d, #2a3bdc)",
            icon: <Business fontSize="small" sx={{ color: "#fff" }} />,
            borderColor: "#12229d",
          },
          businessUnit: {
            backgroundColor: "linear-gradient(135deg, #233dff, #4f6bff)",
            icon: <Apartment fontSize="small" sx={{ color: "#fff" }} />,
            borderColor: "#233dff",
          },
          process: {
            backgroundColor: "linear-gradient(135deg, #6f80eb, #9aa6f5)",
            icon: <Lan fontSize="small" sx={{ color: "#fff" }} />,
            borderColor: "#6f80eb",
          },
          asset: {
            backgroundColor: "linear-gradient(135deg, #5cb6f9, #8ed0fb)",
            icon: <Storage fontSize="small" sx={{ color: "#fff" }} />,
            borderColor: "#5cb6f9",
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
              background: color.backgroundColor,
              border: `4px solid ${color.borderColor}`,
              backdropFilter: "blur(8px)",
              borderRadius: 3,
              p: 2,
              color: "text.primary",
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
              opacity: 0.9,
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
                  color: "#fff",
                }}
              >
                {data.label}
              </Typography>
            </Box>

            {description && (
              <Typography
                variant="caption"
                sx={{
                  color: "#fff",
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
          // borderRight: "1px solid #e0e0e0",
        }}
      >
        <style>{`
        .react-flow__node,
        .react-flow__node:hover,
        .react-flow__node.selected,
        .react-flow__node:focus,
        .react-flow__node:focus-visible {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
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
                ? "#6f80eb"
                : n.data.type === "asset"
                ? "#5cb6f9"
                : "#233dff"
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

      {/* {(selectedProcess || selectedAsset) && ( */}
      {/* <Box
        sx={{
          flex: 1.4,
          background: "#fff",
          p: 3,
          overflowY: "auto",
        }}
      > */}
      {selectedProcess && (
        <Card
          sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" color="#484848">
              {selectedProcess.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Risk Scenarios:
            </Typography>
            {selectedProcess.riskScenarios?.length > 0 ? (
              selectedProcess.riskScenarios.map((r: any) => (
                <Box
                  key={r.id}
                  sx={{
                    p: 1.2,
                    mb: 1,
                    borderRadius: 2,
                    // background: r.ciaMapping?.includes("C")
                    //   ? "#E3F2FD"
                    //   : r.ciaMapping?.includes("I")
                    //   ? "#FFF8E1"
                    //   : "#E8F5E9",
                    background: "#E3F2FD",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color="text.secondary"
                  >
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
      {/* </Box> */}
      {/* )} */}
    </Box>
  );
};

export default ProcessAssetFlow;
