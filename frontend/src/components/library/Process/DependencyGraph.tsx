// ProcessDependencyGraph.tsx - Updated with bidirectional flow
import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Node,
  Edge,
  Handle,
} from '@xyflow/react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Stack,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Security,
  Storage,
  Api,
  AccountTree,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import '@xyflow/react/dist/style.css';

interface DependencyData {
  targetProcessId?: number;
  relationshipType?: string;
}

interface ProcessDependencyGraphProps {
  dependencies: DependencyData[];
  title: string;
  processId?: number;
  processName?: string;
}

// Process types and their styling
const PROCESS_TYPES = {
  main: { 
    color: '#1976d2', 
    icon: AccountTree, 
    label: 'Main Process'
  },
  depends: { 
    color: '#388e3c', 
    icon: ArrowForward, 
    label: 'Dependency Source'
  },
  follows: { 
    color: '#f57c00', 
    icon: ArrowBack, 
    label: 'Follow Target'
  },
  authentication: { 
    color: '#388e3c', 
    icon: Security, 
    label: 'Authentication Process'
  },
  dataStorage: { 
    color: '#f57c00', 
    icon: Storage, 
    label: 'Data Storage Process'
  },
  apiService: { 
    color: '#7b1fa2', 
    icon: Api, 
    label: 'API Service Process'
  },
  workflow: { 
    color: '#d32f2f', 
    icon: PlayArrow, 
    label: 'Workflow Process'
  },
};

// Custom Process Node Component with smaller icons
const ProcessNode = ({ data }: { data: any }) => {
  const processType = PROCESS_TYPES[data.type as keyof typeof PROCESS_TYPES] || PROCESS_TYPES.workflow;
  const IconComponent = processType.icon;
  
  const isMainProcess = data.type === 'main';
  
  return (
    <Tooltip title={`${data.label} (ID: ${data.processId})`} arrow>
      <Box
        sx={{
          width: isMainProcess ? 80 : 65,
          height: isMainProcess ? 45 : 35,
          borderRadius: isMainProcess ? '12px' : '10px',
          background: `linear-gradient(135deg, ${processType.color} 0%, ${processType.color}dd 100%)`,
          border: `2px solid #ffffff`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: isMainProcess 
            ? '0 6px 18px rgba(25,118,210,0.25)'
            : '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: isMainProcess 
              ? '0 8px 24px rgba(25,118,210,0.35)' 
              : '0 6px 16px rgba(0,0,0,0.25)',
          },
          '&::before': isMainProcess ? {
            content: '""',
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            borderRadius: 'inherit',
            zIndex: -1,
            opacity: 0.6,
          } : {}
        }}
      >
        <IconComponent sx={{ fontSize: isMainProcess ? 14 : 12, mb: 0.25 }} />
        <Typography 
          variant="caption" 
          fontWeight="bold" 
          textAlign="center"
          sx={{ 
            fontSize: isMainProcess ? '8px' : '7px',
            lineHeight: 0.9,
            maxWidth: isMainProcess ? '95px' : '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {data.label}
        </Typography>
        
        {isMainProcess && (
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '7px',
              opacity: 0.9,
              mt: 0.25
            }}
          >
            ID: {data.processId}
          </Typography>
        )}
        
        {/* Connection Handles based on node type */}
        {data.type === 'depends' && (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              backgroundColor: processType.color,
              border: '1.5px solid #ffffff',
              width: 6,
              height: 6,
            }}
          />
        )}
        
        {data.type === 'follows' && (
          <Handle
            type="target"
            position={Position.Left}
            style={{
              backgroundColor: processType.color,
              border: '1.5px solid #ffffff',
              width: 6,
              height: 6,
            }}
          />
        )}
        
        {isMainProcess && (
          <>
            <Handle
              type="target"
              position={Position.Left}
              style={{
                backgroundColor: processType.color,
                border: '1.5px solid #ffffff',
                width: 6,
                height: 6,
              }}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{
                backgroundColor: processType.color,
                border: '1.5px solid #ffffff',
                width: 6,
                height: 6,
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};

const nodeTypes = {
  process: ProcessNode,
};

const DependencyGraph: React.FC<ProcessDependencyGraphProps> = ({
  dependencies,
  title,
  processId = 0,
  processName = 'Main Process',
}) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Separate dependencies by relationship type
    const dependsProcesses = dependencies.filter(dep => dep.relationshipType?.toLowerCase() === 'depends');
    const followProcesses = dependencies.filter(dep => dep.relationshipType?.toLowerCase() === 'follows');
    
    // Create main process node in the center
    const mainNode: Node = {
      id: 'main',
      type: 'process',
      position: { x: 220, y: 120 },
      data: { 
        label: processName, 
        type: 'main',
        processId: processId
      },
    };

    const nodes: Node[] = [mainNode];
    const edges: Edge[] = [];

    // Create "depends" nodes (left side - these depend on main process)
    dependsProcesses.forEach((dep, index) => {
      const nodeId = `depends-${dep.targetProcessId}`;
      nodes.push({
        id: nodeId,
        type: 'process',
        position: {
          x: 10, // Left side
          y: 50 + (index * 70),
        },
        data: {
          label: `Process ${dep.targetProcessId}`,
          type: 'depends',
          processId: dep.targetProcessId,
        },
      });

      // Edge from depends process to main (depends process -> main)
      edges.push({
        id: `edge-${nodeId}-to-main`,
        source: nodeId,
        target: 'main',
        type: 'straight',
        animated: true,
        style: {
          strokeWidth: 1,
          stroke: '#388e3c',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#388e3c',
          width: 14,
          height: 14,
        },
        label: 'depends on',
        labelStyle: { 
          fontSize: 9,
          fill: '#388e3c', 
          fontWeight: 'bold',
          fontFamily: 'system-ui'
        },
        labelBgPadding: [5, 2],
        labelBgBorderRadius: 3,
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 0.9,
          stroke: '#388e3c',
          strokeWidth: 1
        },
      });
    });

    // Create "follow" nodes (right side - main process flows to these)
    followProcesses.forEach((dep, index) => {
      const nodeId = `follows-${dep.targetProcessId}`;
      nodes.push({
        id: nodeId,
        type: 'process',
        position: {
            x: 420, // Move further right (was 360)
            y: 50 + (index * 70),
        },
        data: {
          label: `Process ${dep.targetProcessId}`,
          type: 'follows',
          processId: dep.targetProcessId,
        },
      });

      // Edge from main to follow process (main -> follow process)
      edges.push({
        id: `edge-main-to-${nodeId}`,
        source: 'main',
        target: nodeId,
        type: 'straight',
        animated: true,
        style: {
          strokeWidth: 1,
          stroke: '#f57c00',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#f57c00',
          width: 14,
          height: 14,
        },
        label: 'follows',
        labelStyle: { 
          fontSize: 9,
          fill: '#f57c00', 
          fontWeight: 'bold',
          fontFamily: 'system-ui'
        },
        labelBgPadding: [5, 2],
        labelBgBorderRadius: 3,
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 0.9,
          stroke: '#f57c00',
          strokeWidth: 1
        },
      });
    });

    return {
      nodes,
      edges,
    };
  }, [dependencies, processId, processName]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const dependsCount = dependencies.filter(d => d.relationshipType?.toLowerCase() === 'depends').length;
  const followsCount = dependencies.filter(d => d.relationshipType?.toLowerCase() === 'follows').length;

  return (
    <Paper 
      sx={{ 
        p: 2, 
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountTree color="primary" sx={{ fontSize: 18 }} />
          <Typography variant="subtitle2" fontWeight="bold" color="primary">
            Process Flow Dependencies
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {dependsCount > 0 && (
            <Chip 
              label={`${dependsCount} Depends`} 
              color="success" 
              size="small" 
              sx={{ height: 22, fontSize: '10px' }}
            />
          )}
          {followsCount > 0 && (
            <Chip 
              label={`${followsCount} Follows`} 
              sx={{ 
                height: 22, 
                fontSize: '10px',
                backgroundColor: '#f57c00',
                color: 'white'
              }}
            />
          )}
        </Stack>
      </Stack>

      <Box 
        sx={{ 
          width: '100%', 
          height: 250,
          border: '2px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
          minZoom={0.4}
          maxZoom={2}
          attributionPosition="bottom-left"
          nodesDraggable={true}
          panOnDrag={true}
          zoomOnScroll={true}
        >
          <Controls 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              const nodeType = (node.data as any)?.type;
              return PROCESS_TYPES[nodeType as keyof typeof PROCESS_TYPES]?.color || '#757575';
            }}
            nodeStrokeWidth={1}
            zoomable
            pannable
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              width: 100,
              height: 65,
            }}
          />
          <Background 
            color="#e9ecef" 
            gap={14}
            size={0.4}
          />
        </ReactFlow>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '10px' }}>
          Process flow: Dependencies → Main Process → Followers
        </Typography>
        <Stack direction="row" spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, backgroundColor: '#388e3c', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>Depends On</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, backgroundColor: '#1976d2', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>Main Process</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, backgroundColor: '#f57c00', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>Follows</Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DependencyGraph;
