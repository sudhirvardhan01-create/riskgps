import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MiniMap
} from '@xyflow/react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  AccountTree,
  ViewList,
  AccountTreeOutlined,
  Storage,
  CheckCircle,
  Warning,
  Business
} from '@mui/icons-material';
import '@xyflow/react/dist/style.css';

import ProcessAssetNode from './ProcessAssetNode';
import { useProcessViewData } from './ProcessView';
import { useAssetViewData } from './AssetView';
import ProcessLegend from './ProcessLegend';
import AssetLegend from './AssetLegend';
import { ProcessDependencyGraphProps, ITEM_TYPES } from './types';

// Import the circular node component from the financial graph
import { CircularNode, useOrgViewData } from './OrgView'; // You'll need to create this

const nodeTypes: NodeTypes = {
  processAsset: ProcessAssetNode,
  circularNode: CircularNode, // Add the circular node type
};

const ProcessDependencyGraph: React.FC<ProcessDependencyGraphProps> = () => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('financial-services');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [viewType, setViewType] = useState<'process' | 'asset' | 'org'>('process'); // Add 'org' type

  const handleNodeClick = useCallback((nodeData: any) => {
    setSelectedNode(nodeData);
  }, []);

  // Get data based on current view
  const processData = useProcessViewData({ onNodeClick: handleNodeClick });
  const assetData = useAssetViewData({ onNodeClick: handleNodeClick });
  const orgData = useOrgViewData({ onNodeClick: handleNodeClick }); // Add org data
  
  // Determine current data based on view type
  const getCurrentData = () => {
    switch (viewType) {
      case 'process':
        return processData;
      case 'asset':
        return assetData;
      case 'org':
        return orgData;
      default:
        return processData;
    }
  };

  const currentData = getCurrentData();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(currentData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentData.edges);

  // Update nodes and edges when view type changes
  React.useEffect(() => {
    setNodes(currentData.nodes);
    setEdges(currentData.edges);
    setSelectedNode(null);
  }, [currentData, setNodes, setEdges]);

  // Legend component for org view
  const OrgLegend = () => (
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
  );

  // Get appropriate legend based on view type
  const getLegend = () => {
    switch (viewType) {
      case 'process':
        return <ProcessLegend />;
      case 'asset':
        return <AssetLegend />;
      case 'org':
        return <OrgLegend />;
      default:
        return <ProcessLegend />;
    }
  };

  return (
    <Box sx={{ width: '100%', height: '700px', position: 'relative' }}>
      {/* Left Panel - Business Unit Selector */}
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
          minWidth: 300
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <AccountTree color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            Process & Asset Dependencies
          </Typography>
        </Stack>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Business Unit</InputLabel>
          <Select
            value={selectedBusinessUnit}
            label="Business Unit"
            onChange={(e) => setSelectedBusinessUnit(e.target.value)}
          >
            <MenuItem value="financial-services">Business Unit - A</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
          Legend:
        </Typography>
        
        {getLegend()}
      </Paper>

      {/* Right Panel - View Selector */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: 'white',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: 200
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ViewList color="primary" sx={{ fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
            View Type
          </Typography>
        </Stack>

        <FormControl fullWidth size="small">
          <InputLabel>View</InputLabel>
          <Select
            value={viewType}
            label="View"
            onChange={(e) => setViewType(e.target.value as 'process' | 'asset' | 'org')}
          >
            <MenuItem value="process">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountTreeOutlined sx={{ fontSize: 16 }} />
                <Typography variant="body2">Process Level View</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="asset">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Storage sx={{ fontSize: 16 }} />
                <Typography variant="body2">Asset Level View</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="org">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Business sx={{ fontSize: 16 }} />
                <Typography variant="body2">Org View</Typography>
              </Stack>
            </MenuItem>
          </Select>
        </FormControl>

        <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1, fontSize: '10px' }}>
          {viewType === 'process' 
            ? 'Shows process flow relationships' 
            : viewType === 'asset'
            ? 'Shows asset-to-process dependencies'
            : 'Shows organizational architecture'}
        </Typography>
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
                  ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.icon || Storage, 
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
                  {selectedNode.isMain && (
                    <Chip
                      label="Main"
                      size="small"
                      sx={{ backgroundColor: '#FFD700', color: '#333' }}
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

            {selectedNode.dependsOn && selectedNode.dependsOn.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Depends On:
                </Typography>
                <Stack spacing={0.5}>
                  {selectedNode.dependsOn.map((dep: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                      • {dep.replace('-header', '').replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProcessDependencyGraph;

// import React, { useState, useCallback } from 'react';
// import {
//   ReactFlow,
//   Controls,
//   Background,
//   NodeTypes,
//   useNodesState,
//   useEdgesState,
//   MiniMap
// } from '@xyflow/react';
// import {
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Card,
//   CardContent,
//   Stack,
//   Chip,
//   Divider,
//   Paper
// } from '@mui/material';
// import {
//   AccountTree,
//   ViewList,
//   AccountTreeOutlined,
//   Storage,
//   CheckCircle,
//   Warning
// } from '@mui/icons-material';
// import '@xyflow/react/dist/style.css';

// import ProcessAssetNode from './ProcessAssetNode';
// import { useProcessViewData } from './ProcessView';
// import { useAssetViewData } from './AssetView';
// import ProcessLegend from './ProcessLegend';
// import AssetLegend from './AssetLegend';
// import { ProcessDependencyGraphProps, ITEM_TYPES } from './types';

// const nodeTypes: NodeTypes = {
//   processAsset: ProcessAssetNode,
// };

// const ProcessDependencyGraph: React.FC<ProcessDependencyGraphProps> = () => {
//   const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('financial-services');
//   const [selectedNode, setSelectedNode] = useState<any>(null);
//   const [viewType, setViewType] = useState<'process' | 'asset'>('process');

//   const handleNodeClick = useCallback((nodeData: any) => {
//     setSelectedNode(nodeData);
//   }, []);

//   // Get data based on current view
//   const processData = useProcessViewData({ onNodeClick: handleNodeClick });
//   const assetData = useAssetViewData({ onNodeClick: handleNodeClick });
  
//   const currentData = viewType === 'process' ? processData : assetData;
  
//   const [nodes, setNodes, onNodesChange] = useNodesState(currentData.nodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(currentData.edges);

//   // Update nodes and edges when view type changes
//   React.useEffect(() => {
//     setNodes(currentData.nodes);
//     setEdges(currentData.edges);
//     setSelectedNode(null);
//   }, [currentData, setNodes, setEdges]);

//   return (
//     <Box sx={{ width: '100%', height: '700px', position: 'relative' }}>
//       {/* Left Panel - Business Unit Selector */}
//       <Paper
//         sx={{
//           position: 'absolute',
//           top: 16,
//           left: 16,
//           zIndex: 10,
//           backgroundColor: 'white',
//           borderRadius: 2,
//           p: 2,
//           boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//           minWidth: 300
//         }}
//       >
//         <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//           <AccountTree color="primary" sx={{ fontSize: 20 }} />
//           <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
//             Process & Asset Dependencies
//           </Typography>
//         </Stack>

//         <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//           <InputLabel>Business Unit</InputLabel>
//           <Select
//             value={selectedBusinessUnit}
//             label="Business Unit"
//             onChange={(e) => setSelectedBusinessUnit(e.target.value)}
//           >
//             <MenuItem value="financial-services">Financial Services</MenuItem>
//           </Select>
//         </FormControl>

//         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
//           Legend:
//         </Typography>
        
//         {viewType === 'process' ? <ProcessLegend /> : <AssetLegend />}
//       </Paper>

//       {/* Right Panel - View Selector */}
//       <Paper
//         sx={{
//           position: 'absolute',
//           top: 16,
//           right: 16,
//           zIndex: 10,
//           backgroundColor: 'white',
//           borderRadius: 2,
//           p: 2,
//           boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//           minWidth: 200
//         }}
//       >
//         <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//           <ViewList color="primary" sx={{ fontSize: 18 }} />
//           <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
//             View Type
//           </Typography>
//         </Stack>

//         <FormControl fullWidth size="small">
//           <InputLabel>View</InputLabel>
//           <Select
//             value={viewType}
//             label="View"
//             onChange={(e) => setViewType(e.target.value as 'process' | 'asset')}
//           >
//             <MenuItem value="process">
//               <Stack direction="row" alignItems="center" spacing={1}>
//                 <AccountTreeOutlined sx={{ fontSize: 16 }} />
//                 <Typography variant="body2">Process Level View</Typography>
//               </Stack>
//             </MenuItem>
//             <MenuItem value="asset">
//               <Stack direction="row" alignItems="center" spacing={1}>
//                 <Storage sx={{ fontSize: 16 }} />
//                 <Typography variant="body2">Asset Level View</Typography>
//               </Stack>
//             </MenuItem>
//           </Select>
//         </FormControl>

//         <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1, fontSize: '10px' }}>
//           {viewType === 'process' 
//             ? 'Shows process flow relationships' 
//             : 'Shows asset-to-process dependencies'}
//         </Typography>
//       </Paper>

//       {/* React Flow */}
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         nodeTypes={nodeTypes}
//         fitView
//         fitViewOptions={{ padding: 0.2 }}
//         minZoom={0.5}
//         maxZoom={2}
//         defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
//         style={{
//           backgroundColor: '#f8fafc',
//         }}
//       >
//         <Background color="#e2e8f0" gap={20} size={1} />
//         <Controls 
//           style={{
//             backgroundColor: 'white',
//             border: '1px solid #e2e8f0',
//             borderRadius: '8px'
//           }}
//         />
//         <MiniMap
//           nodeColor={(node) => {
//             const nodeType = (node.data as any)?.itemType;
//             return ITEM_TYPES[nodeType as keyof typeof ITEM_TYPES]?.color || '#757575';
//           }}
//           nodeStrokeWidth={2}
//           zoomable
//           pannable
//           style={{
//             backgroundColor: '#f8f9fa',
//             border: '1px solid #e0e0e0',
//             borderRadius: '6px',
//             width: 120,
//             height: 80,
//           }}
//         />
//       </ReactFlow>

//       {/* Node Details Panel */}
//       {selectedNode && (
//         <Card
//           sx={{
//             position: 'absolute',
//             bottom: 16,
//             right: 16,
//             zIndex: 10,
//             minWidth: 350,
//             maxWidth: 400,
//             boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
//           }}
//         >
//           <CardContent>
//             <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
//               <Box sx={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: '50%',
//                 backgroundColor: ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.color || '#666',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 {React.createElement(
//                   ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.icon || Storage, 
//                   { sx: { color: 'white', fontSize: 18 } }
//                 )}
//               </Box>
//               <Box sx={{ flexGrow: 1 }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   {selectedNode.label}
//                 </Typography>
//                 <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
//                   <Chip
//                     label={ITEM_TYPES[selectedNode.itemType as keyof typeof ITEM_TYPES]?.label || 'Unknown'}
//                     size="small"
//                     color={selectedNode.itemType === 'process' ? 'primary' : 'secondary'}
//                     variant="outlined"
//                   />
//                   {selectedNode.status && (
//                     <Chip
//                       label={selectedNode.status}
//                       size="small"
//                       color={selectedNode.status === 'active' ? 'success' : 'warning'}
//                       icon={selectedNode.status === 'active' ? <CheckCircle /> : <Warning />}
//                     />
//                   )}
//                   {selectedNode.isMain && (
//                     <Chip
//                       label="Main"
//                       size="small"
//                       sx={{ backgroundColor: '#FFD700', color: '#333' }}
//                     />
//                   )}
//                 </Stack>
//               </Box>
//             </Stack>

//             {selectedNode.description && (
//               <>
//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
//                   {selectedNode.description}
//                 </Typography>
//               </>
//             )}

//             {selectedNode.dependsOn && selectedNode.dependsOn.length > 0 && (
//               <>
//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//                   Depends On:
//                 </Typography>
//                 <Stack spacing={0.5}>
//                   {selectedNode.dependsOn.map((dep: string, index: number) => (
//                     <Typography key={index} variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
//                       • {dep.replace('-header', '').replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
//                     </Typography>
//                   ))}
//                 </Stack>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default ProcessDependencyGraph;
