import React, { useMemo } from 'react';
import { Node, Edge, MarkerType, Handle, Position } from '@xyflow/react';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  Security,
  PointOfSale,
  Storage
} from '@mui/icons-material';

interface OrgViewProps {
  onNodeClick: (nodeData: any) => void;
}

interface NodeData {
  [key: string]: any;
  label: string;
  itemType: 'process' | 'asset';
  status: 'active' | 'warning' | 'error';
  description: string;
  category?: string;
  onNodeClick?: (data: any) => void;
}

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

// Icon mapping functions
const getProcessIcon = (label: string) => {
  if (label.includes('ATM')) return AttachMoney;
  if (label.includes('LOAN')) return CreditCard;
  if (label.includes('CREDIT RATING')) return CreditCard;
  if (label.includes('AUTHENTICATION')) return Security;
  if (label.includes('SALES')) return PointOfSale;
  return Security;
};

const getAssetIcon = (label: string) => {
  if (label.includes('Snowflake')) return Storage;
  if (label.includes('Salesforce')) return PointOfSale;
  if (label.includes('Auth0')) return Security;
  if (label.includes('Database')) return Storage;
  return Storage;
};

// Circular Node Component for Org View
export const CircularNode = ({ data }: { data: NodeData }) => {
  const itemType = ITEM_TYPES[data.itemType] || ITEM_TYPES.process;
  const isAsset = data.itemType === 'asset';
  
  const IconComponent = isAsset 
    ? getAssetIcon(data.label) 
    : getProcessIcon(data.label);
  
  return (
    <Tooltip title={`${data.label} - ${itemType.label}`} arrow>
      <Box
        onClick={() => data.onNodeClick?.(data)}
        sx={{
          width: isAsset ? 80 : 70,
          height: isAsset ? 80 : 70,
          borderRadius: '50%',
          backgroundColor: itemType.bgColor,
          border: `3px solid ${itemType.color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 3px 12px ${itemType.color}40`,
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 4px 16px ${itemType.color}60`,
            transform: 'scale(1.05)'
          }
        }}
      >
        <IconComponent 
          sx={{ 
            fontSize: isAsset ? 22 : 20,
            color: itemType.color,
            mb: 0.5
          }} 
        />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '7px',
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

        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Left}
          style={{
            backgroundColor: itemType.color,
            border: '2px solid #ffffff',
            width: 8,
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

export const useOrgViewData = ({ onNodeClick }: OrgViewProps) => {
  return useMemo(() => {
    const nodes: Node[] = [
      // Financial processes and assets with clean positioning
      {
        id: 'atm-process',
        type: 'circularNode',
        position: { x: 200, y: 50 },
        data: {
          label: 'ATM PROCESS',
          itemType: 'process',
          status: 'active',
          description: 'Automated teller machine transaction processing',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'user-auth-process',
        type: 'circularNode',
        position: { x: 100, y: 150 },
        data: {
          label: 'USER AUTHENTICATION',
          itemType: 'process',
          status: 'active',
          description: 'User login and identity verification process',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'loan-process',
        type: 'circularNode',
        position: { x: 50, y: 280 },
        data: {
          label: 'LOAN PROCESS',
          itemType: 'process',
          status: 'warning',
          description: 'Loan application and approval workflow',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'snowflake-asset',
        type: 'circularNode',
        position: { x: 350, y: 120 },
        data: {
          label: 'Snowflake',
          itemType: 'asset',
          status: 'active',
          category: 'Data Warehouse',
          description: 'Cloud-based data warehouse platform',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'salesforce-asset',
        type: 'circularNode',
        position: { x: 400, y: 250 },
        data: {
          label: 'Salesforce',
          itemType: 'asset',
          status: 'active',
          category: 'CRM',
          description: 'Customer relationship management platform',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'auth0-asset',
        type: 'circularNode',
        position: { x: 500, y: 180 },
        data: {
          label: 'Auth0',
          itemType: 'asset',
          status: 'active',
          category: 'Identity',
          description: 'Identity and access management platform',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'credit-rating-process',
        type: 'circularNode',
        position: { x: 650, y: 280 },
        data: {
          label: 'CREDIT RATING',
          itemType: 'process',
          status: 'active',
          description: 'Customer credit score evaluation process',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'onprem-database-asset',
        type: 'circularNode',
        position: { x: 750, y: 150 },
        data: {
          label: 'On-Prem Database',
          itemType: 'asset',
          status: 'active',
          category: 'Database',
          description: 'On-premises database system',
          onNodeClick: onNodeClick
        } as NodeData
      },
      {
        id: 'sales-process',
        type: 'circularNode',
        position: { x: 800, y: 300 },
        data: {
          label: 'SALES PROCESS',
          itemType: 'process',
          status: 'active',
          description: 'Customer acquisition and sales workflow',
          onNodeClick: onNodeClick
        } as NodeData
      }
    ];

    const edges: Edge[] = [
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
  }, [onNodeClick]);
};
