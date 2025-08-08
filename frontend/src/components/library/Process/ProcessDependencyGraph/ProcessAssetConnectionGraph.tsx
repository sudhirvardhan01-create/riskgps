import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MarkerType,
  Position,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Handle,
  MiniMap
} from '@xyflow/react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalance,
  Storage,
  CheckCircle,
  Warning,
  AccountTree,
  AttachMoney,
  CreditCard,
  Security,
  Person,
  PointOfSale
} from '@mui/icons-material';
import '@xyflow/react/dist/style.css';

// Types for nodes and edges
interface NodeData {
  [key: string]: any;
  label: string;
  itemType: 'process' | 'asset';
  status: 'active' | 'warning' | 'error';
  description: string;
  category?: string;
  onNodeClick?: (data: any) => void;
}

// Styling for different node types
const ITEM_TYPES = {
  process: {
    color: '#4CAF50',
    label: 'Process',
    bgColor: '#ffffff'
  },
  asset: {
    color: '#FF6B35',
    label: 'Asset/System',
    bgColor: '#ffffff'
  }
};

// Icon mapping for different processes
const getProcessIcon = (label: string) => {
  if (label.includes('ATM')) return AttachMoney;
  if (label.includes('LOAN')) return CreditCard;
  if (label.includes('CREDIT RATING')) return CreditCard;
  if (label.includes('AUTHENTICATION')) return Security;
  if (label.includes('SALES')) return PointOfSale;
  return AccountBalance;
};

// Icon mapping for different assets
const getAssetIcon = (label: string) => {
  if (label.includes('Snowflake')) return Storage;
  if (label.includes('Salesforce')) return PointOfSale;
  if (label.includes('Auth0')) return Security;
  if (label.includes('Database')) return Storage;
  return Storage;
};

// Custom Circular Node Component - Made Smaller
const CircularNode = ({ data }: { data: NodeData }) => {
  const itemType = ITEM_TYPES[data.itemType] || ITEM_TYPES.process;
  const isAsset = data.itemType === 'asset';
  
  // Get appropriate icon based on node type and label
  const IconComponent = isAsset 
    ? getAssetIcon(data.label) 
    : getProcessIcon(data.label);
  
  return (
    <Tooltip title={`${data.label} - ${itemType.label}`} arrow>
      <Box
        onClick={() => data.onNodeClick?.(data)}
        sx={{
          width: isAsset ? 80 : 70, // Made smaller (was 110/100)
          height: isAsset ? 80 : 70, // Made smaller (was 110/100)
          borderRadius: '50%',
          backgroundColor: itemType.bgColor,
          border: `3px solid ${itemType.color}`, // Thinner border
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 3px 12px ${itemType.color}40`, // Smaller shadow
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 4px 16px ${itemType.color}60`,
            transform: 'scale(1.05)'
          }
        }}
      >
        {/* Icon */}
        <IconComponent 
          sx={{ 
            fontSize: isAsset ? 22 : 20, // Smaller icons (was 32/28)
            color: itemType.color,
            mb: 0.5
          }} 
        />

        {/* Node Label */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '7px', // Smaller font (was 8px)
            lineHeight: 1,
            color: '#333',
            px: 0.5,
            maxWidth: '85%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {data.label}
        </Typography>

        {/* Status Indicator */}
        {data.status && data.status !== 'active' && (
          <Box
            sx={{
              position: 'absolute',
              top: -3,
              right: -3,
              width: 14, // Smaller indicator (was 18)
              height: 14,
              borderRadius: '50%',
              backgroundColor: data.status === 'warning' ? '#FF9800' : '#F44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '7px', fontWeight: 'bold' }}>
              !
            </Typography>
          </Box>
        )}

        {/* Connection Handles - Smaller */}
        <Handle
          type="target"
          position={Position.Left}
          style={{
            backgroundColor: itemType.color,
            border: '2px solid #ffffff',
            width: 8, // Smaller handles (was 10)
            height: 8,
            left: -4,
            zIndex: 15
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{
            backgroundColor: itemType.color,
            border: '2px solid #ffffff',
            width: 8,
            height: 8,
            right: -4,
            zIndex: 15
          }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{
            backgroundColor: itemType.color,
            border: '2px solid #ffffff',
            width: 8,
            height: 8,
            top: -4,
            zIndex: 15
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            backgroundColor: itemType.color,
            border: '2px solid #ffffff',
            width: 8,
            height: 8,
            bottom: -4,
            zIndex: 15
          }}
        />
      </Box>
    </Tooltip>
  );
};

const nodeTypes: NodeTypes = {
  circularNode: CircularNode,
};

const FinancialProcessAssetGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeClick = useCallback((nodeData: any) => {
    setSelectedNode(nodeData);
  }, []);

  // Same positions as earlier, just changed labels to financial processes/assets
  const { nodes: viewNodes, edges: viewEdges } = useMemo(() => {
    const nodes: Node[] = [
      // Using exact positions from the earlier clean layout
      {
        id: 'atm-process',
        type: 'circularNode',
        position: { x: 200, y: 50 }, // Same as 'mobile-app' position
        data: {
          label: 'ATM PROCESS',
          itemType: 'process',
          status: 'active',
          description: 'Automated teller machine transaction processing',
          onNodeClick: handleNodeClick
        } as NodeData
      },
      {
        id: 'user-auth-process',
        type: 'circularNode',
        position: { x: 100, y: 150 }, // Same as 'web-app' position
        data: {
          label: 'USER AUTHENTICATION',
          itemType: 'process',
          status: 'active',
          description: 'User login and identity verification process',
          onNodeClick: handleNodeClick
        } as NodeData
      },
      {
        id: 'loan-process',
        type: 'circularNode',
        position: { x: 50, y: 280 }, // Same as 'desktop-app' position
        data: {
          label: 'LOAN PROCESS',
          itemType: 'process',
          status: 'warning',
          description: 'Loan application and approval workflow',
          onNodeClick: handleNodeClick
        } as NodeData
      },

      // Assets in middle section
      {
        id: 'snowflake-asset',
        type: 'circularNode',
        position: { x: 350, y: 120 }, // Same as 'wireless-ap' position
        data: {
          label: 'Snowflake',
          itemType: 'asset',
          status: 'active',
          category: 'Data Warehouse',
          description: 'Cloud-based data warehouse platform',
          onNodeClick: handleNodeClick
        } as NodeData
      },
      {
        id: 'salesforce-asset',
        type: 'circularNode',
        position: { x: 400, y: 250 }, // Same as 'mobile-network' position
        data: {
          label: 'Salesforce',
          itemType: 'asset',
          status: 'active',
          category: 'CRM',
          description: 'Customer relationship management platform',
          onNodeClick: handleNodeClick
        } as NodeData
      },

      // Right section assets and processes
      {
        id: 'auth0-asset',
        type: 'circularNode',
        position: { x: 500, y: 180 }, // Same as 'switch' position
        data: {
          label: 'Auth0',
          itemType: 'asset',
          status: 'active',
          category: 'Identity',
          description: 'Identity and access management platform',
          onNodeClick: handleNodeClick
        } as NodeData
      },
      {
        id: 'credit-rating-process',
        type: 'circularNode',
        position: { x: 650, y: 280 }, // Same as 'firewall' position
        data: {
          label: 'CREDIT RATING',
          itemType: 'process',
          status: 'active',
          description: 'Customer credit score evaluation process',
          onNodeClick: handleNodeClick
        } as NodeData
      },

      // Far right - database and sales
      {
        id: 'onprem-database-asset',
        type: 'circularNode',
        position: { x: 750, y: 150 }, // Same as 'database-1' position
        data: {
          label: 'On-Prem Database',
          itemType: 'asset',
          status: 'active',
          category: 'Database',
          description: 'On-premises database system',
          onNodeClick: handleNodeClick
        } as NodeData
      },
      {
        id: 'sales-process',
        type: 'circularNode',
        position: { x: 800, y: 300 }, // Same as 'database-2' position
        data: {
          label: 'SALES PROCESS',
          itemType: 'process',
          status: 'active',
          description: 'Customer acquisition and sales workflow',
          onNodeClick: handleNodeClick
        } as NodeData
      }
    ];

    // Same edge structure but with new node IDs
    const edges: Edge[] = [
      // Process connections
      {
        id: 'atm-to-snowflake',
        source: 'atm-process',
        target: 'snowflake-asset',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 2
        }
      },
      {
        id: 'userauth-to-snowflake',
        source: 'user-auth-process',
        target: 'snowflake-asset',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 2
        }
      },
      {
        id: 'loan-to-salesforce',
        source: 'loan-process',
        target: 'salesforce-asset',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 2
        }
      },

      // Asset flows
      {
        id: 'snowflake-to-auth0',
        source: 'snowflake-asset',
        target: 'auth0-asset',
        type: 'default',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#FF6B35',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#FF6B35',
          strokeWidth: 2
        }
      },
      {
        id: 'salesforce-to-auth0',
        source: 'salesforce-asset',
        target: 'auth0-asset',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#FF6B35',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#FF6B35',
          strokeWidth: 2
        }
      },

      // Final connections
      {
        id: 'auth0-to-credit-rating',
        source: 'auth0-asset',
        target: 'credit-rating-process',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2196F3',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#2196F3',
          strokeWidth: 2
        }
      },
      {
        id: 'auth0-to-onprem-db',
        source: 'auth0-asset',
        target: 'onprem-database-asset',
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#9C27B0',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#9C27B0',
          strokeWidth: 2
        }
      },
      {
        id: 'credit-rating-to-sales',
        source: 'credit-rating-process',
        target: 'sales-process',
        type: 'default',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#9C27B0',
          width: 10,
          height: 10,
        },
        style: {
          stroke: '#9C27B0',
          strokeWidth: 2
        }
      }
    ];

    return { nodes, edges };
  }, [handleNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState(viewNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(viewEdges);

  return (
    <Box sx={{ width: '100%', height: '700px', position: 'relative' }}>
      {/* Header */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          backgroundColor: 'white',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: 320
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <AccountTree color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            Financial Services Architecture
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Clean layout with financial processes and technology assets
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
          Legend:
        </Typography>
        
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#4CAF50',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Financial Process
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#FF6B35',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Technology Asset
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        style={{
          backgroundColor: '#f8fafc',
        }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls 
          style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            const nodeType = (node.data as any)?.itemType;
            return ITEM_TYPES[nodeType as keyof typeof ITEM_TYPES]?.color || '#757575';
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            width: 120,
            height: 80,
          }}
        />
      </ReactFlow>

      {/* Node Details Panel */}
      {selectedNode && (
        <Card
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 10,
            minWidth: 350,
            maxWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.color || '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {React.createElement(
                  selectedNode.itemType === 'asset' 
                    ? getAssetIcon(selectedNode.label)
                    : getProcessIcon(selectedNode.label), 
                  { sx: { color: 'white', fontSize: 18 } }
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedNode.label}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.label || 'Unknown'}
                    size="small"
                    color={selectedNode.itemType === 'process' ? 'primary' : 'secondary'}
                    variant="outlined"
                  />
                  {selectedNode.status && (
                    <Chip
                      label={selectedNode.status}
                      size="small"
                      color={selectedNode.status === 'active' ? 'success' : 'warning'}
                      icon={selectedNode.status === 'active' ? <CheckCircle /> : <Warning />}
                    />
                  )}
                  {selectedNode.category && (
                    <Chip
                      label={selectedNode.category}
                      size="small"
                      sx={{ backgroundColor: '#FF6B3520', color: '#FF6B35' }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>

            {selectedNode.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
                  {selectedNode.description}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FinancialProcessAssetGraph;
