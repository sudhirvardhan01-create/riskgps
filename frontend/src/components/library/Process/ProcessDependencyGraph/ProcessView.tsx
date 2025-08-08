import React, { useMemo } from 'react';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { NodeData } from './types';

interface ProcessViewProps {
  onNodeClick: (nodeData: any) => void;
}

export const useProcessViewData = ({ onNodeClick }: ProcessViewProps) => {
  return useMemo(() => {
    const nodes: Node[] = [
      {
        id: 'process-1',
        type: 'processAsset',
        position: { x: 100, y: 200 },
        data: {
          label: 'Login Process',
          itemType: 'process',
          status: 'active',
          description: 'User authentication and login',
          isMain: false,
          viewType: 'process',
          onNodeClick
        } as NodeData
      },
      {
        id: 'process-2',
        type: 'processAsset',
        position: { x: 400, y: 200 },
        data: {
          label: 'Verification Process',
          itemType: 'process',
          status: 'active',
          description: 'Document and identity verification',
          isMain: false,
          viewType: 'process',
          onNodeClick
        } as NodeData
      },
      {
        id: 'process-3',
        type: 'processAsset',
        position: { x: 700, y: 200 },
        data: {
          label: 'Transaction Process',
          itemType: 'process',
          status: 'active',
          description: 'Financial transaction processing',
          isMain: false,
          viewType: 'process',
          onNodeClick
        } as NodeData
      },
      {
        id: 'process-4',
        type: 'processAsset',
        position: { x: 1000, y: 200 },
        data: {
          label: 'Approval Process',
          itemType: 'process',
          status: 'warning',
          description: 'Transaction approval workflow',
          isMain: false,
          viewType: 'process',
          onNodeClick
        } as NodeData
      },
      {
        id: 'process-5',
        type: 'processAsset',
        position: { x: 1300, y: 200 },
        data: {
          label: 'Notification Process',
          itemType: 'process',
          status: 'active',
          description: 'User notification and alerts',
          isMain: false,
          viewType: 'process',
          onNodeClick
        } as NodeData
      }
    ];

    const edges: Edge[] = [
      {
        id: 'process-1-to-2',
        source: 'process-1',
        target: 'process-2',
        type: 'default',
        label: 'follows',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 12,
          height: 12,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 1
        },
        labelStyle: {
          fontSize: 10,
          fill: '#4CAF50',
          fontWeight: 'bold'
        }
      },
      {
        id: 'process-2-to-3',
        source: 'process-2',
        target: 'process-3',
        type: 'default',
        label: 'follows',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 12,
          height: 12,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 1
        },
        labelStyle: {
          fontSize: 10,
          fill: '#4CAF50',
          fontWeight: 'bold'
        }
      },
      {
        id: 'process-3-to-4',
        source: 'process-3',
        target: 'process-4',
        type: 'default',
        label: 'follows',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 12,
          height: 12,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 1
        },
        labelStyle: {
          fontSize: 10,
          fill: '#4CAF50',
          fontWeight: 'bold'
        }
      },
      {
        id: 'process-4-to-5',
        source: 'process-4',
        target: 'process-5',
        type: 'default',
        label: 'follows',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4CAF50',
          width: 12,
          height: 12,
        },
        style: {
          stroke: '#4CAF50',
          strokeWidth: 1
        },
        labelStyle: {
          fontSize: 10,
          fill: '#4CAF50',
          fontWeight: 'bold'
        }
      }
    ];

    return { nodes, edges };
  }, [onNodeClick]);
};
