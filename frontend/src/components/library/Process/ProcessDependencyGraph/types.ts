export interface ProcessDependencyGraphProps {
  businessUnit?: string;
}


export const ITEM_TYPES = {
  process: {
    color: '#4CAF50',
    icon: 'AccountBalance',
    label: 'Process',
    bgColor: '#ffffff'
  },
  asset: {
    color: '#9C27B0',
    icon: 'Storage',
    label: 'Asset/System',
    bgColor: '#ffffff'
  }
};


export interface NodeData {
  [key: string]: any;
  label: string;
  itemType: 'process' | 'asset';
  status: 'active' | 'warning' | 'error';
  description: string;
  isMain?: boolean;
  isAssetHeader?: boolean;
  viewType: 'process' | 'asset';
  dependsOn?: string[];
  dependencies?: string[];
  onNodeClick?: (data: any) => void;
}
