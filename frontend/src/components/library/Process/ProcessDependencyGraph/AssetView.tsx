import React, { useMemo } from 'react';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { NodeData } from './types';

interface AssetViewProps {
  onNodeClick: (nodeData: any) => void;
}

export const useAssetViewData = ({ onNodeClick }: AssetViewProps) => {
  return useMemo(() => {
    const nodes: Node[] = [
      // Asset Headers
      {
        id: 'asset-a-header',
        type: 'processAsset',
        position: { x: 500, y: 50 },
        data: {
          label: 'Asset A',
          itemType: 'asset',
          status: 'active',
          description: 'Database System',
          isAssetHeader: true,
          viewType: 'asset',
          onNodeClick
        } as NodeData
      },
      {
        id: 'asset-b-header',
        type: 'processAsset',
        position: { x: 800, y: 50 },
        data: {
          label: 'Asset B',
          itemType: 'asset',
          status: 'active',
          description: 'API Gateway',
          isAssetHeader: true,
          viewType: 'asset',
          onNodeClick
        } as NodeData
      },
      {
        id: 'asset-c-header',
        type: 'processAsset',
        position: { x: 1100, y: 50 },
        data: {
          label: 'Asset C',
          itemType: 'asset',
          status: 'active',
          description: 'Notification Service',
          isAssetHeader: true,
          viewType: 'asset',
          onNodeClick
        } as NodeData
      },
      // Dependent Process
      {
        id: 'process-login-a',
        type: 'processAsset',
        position: { x: 400, y: 200 },
        data: {
          label: 'Login Process',
          itemType: 'process',
          status: 'active',
          description: 'Depends on Asset A for user authentication',
          dependsOn: ['asset-a-header'],
          viewType: 'asset',
          onNodeClick
        } as NodeData
      },
      {
        id: 'atm-process-a',
        type: 'processAsset',
        position: { x: 500, y: 200 },
        data: {
          label: 'ATM Process',
          itemType: 'process',
          status: 'active',
          description: 'Depends on Asset A for user authentication',
          dependsOn: ['asset-a-header'],
          viewType: 'asset',
          onNodeClick
        } as NodeData
      },
      {
        id: 'credit-rating-process-a',
        type: 'processAsset',
        position: { x: 600, y: 200 },
        data: {
          label: 'Credit Rating Process',
          itemType: 'process',
          status: 'active',
          description: 'Depends on Asset A for user authentication',
          dependsOn: ['asset-a-header'],
          viewType: 'asset',
          onNodeClick
        } as NodeData
      }

    ];

    const edges: Edge[] = [
      {
        id: 'asset-a-to-login',
        source: 'asset-a-header',
        target: 'process-login-a',
        type: 'straight',
        label: 'uses',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#9C27B0',
          width: 14,
          height: 14,
        },
        style: {
          stroke: '#9C27B0',
          strokeWidth: 1,
          strokeDasharray: '6,3'
        },
        labelStyle: {
          fontSize: 9,
          fill: '#9C27B0',
          fontWeight: 'bold'
        }
      },
      {
        id: 'asset-a-to-atm-process',
        source: 'asset-a-header',
        target: 'atm-process-a',
        type: 'straight',
        label: 'uses',
        animated: false,
        markerEnd: {
          type: MarkerType.Arrow,
          color: '#9C27B0',
          width: 14,
          height: 14,
        },
        style: {
          stroke: '#9C27B0',
          strokeWidth: 1,
          strokeDasharray: '6,3'
        },
        labelStyle: {
          fontSize: 9,
          fill: '#9C27B0',
          fontWeight: 'bold'
        }
      },
      {
        id: 'asset-a-to-credit-rating-process',
        source: 'asset-a-header',
        target: 'credit-rating-process-a',
        type: 'straight',
        label: 'uses',
        animated: false,
        markerEnd: {
          type: MarkerType.Arrow,
          color: '#9C27B0',
          width: 14,
          height: 14,
        },
        style: {
          stroke: '#9C27B0',
          strokeWidth: 1,
          strokeDasharray: '6,3'
        },
        labelStyle: {
          fontSize: 9,
          fill: '#9C27B0',
          fontWeight: 'bold'
        }
      },
    ];

    return { nodes, edges };
  }, [onNodeClick]);
};
