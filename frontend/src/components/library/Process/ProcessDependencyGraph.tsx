import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Chip, 
  IconButton, 
  Tooltip,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  ZoomIn, 
  ZoomOut, 
  CenterFocusStrong,
  Warning,
  CheckCircle,
  Error,
  Storage
} from '@mui/icons-material';
import * as d3 from 'd3';
import { ProcessData } from '@/types/process';

interface ProcessDependencyGraphProps {
  processesData: ProcessData[] | undefined;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'process' | 'asset';
  status: 'active' | 'inactive' | 'warning' | 'critical';
  dependencies: string[];
  assets?: string[];
  processType?: 'core' | 'support' | 'external';
  description?: string;
  impactLevel?: 'high' | 'medium' | 'low';
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'dependency' | 'uses_asset' | 'data_flow';
  label?: string;
}

const ProcessDependencyGraph: React.FC<ProcessDependencyGraphProps> = ({ processesData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<string[]>([]);

  // Enhanced sample data structure representing financial services processes
  const graphData = React.useMemo(() => {
    const nodes: GraphNode[] = [
      // Core Business Processes
      {
        id: 'loan-management',
        name: 'Loan Management',
        type: 'process',
        status: 'active',
        dependencies: ['credit-rating', 'customer-verification'],
        assets: ['salesforce', 'oracle-db', 'docusign'],
        processType: 'core',
        description: 'End-to-end loan processing and management',
        impactLevel: 'high'
      },
      {
        id: 'credit-rating',
        name: 'Credit Rating',
        type: 'process',
        status: 'active',
        dependencies: ['data-analytics'],
        assets: ['experian-api', 'snowflake', 'risk-engine'],
        processType: 'core',
        description: 'Credit assessment and risk evaluation',
        impactLevel: 'high'
      },
      {
        id: 'atm-process',
        name: 'ATM Processing',
        type: 'process',
        status: 'active',
        dependencies: ['account-management', 'fraud-detection'],
        assets: ['atm-network', 'core-banking', 'monitoring-system'],
        processType: 'core',
        description: 'ATM transaction processing and management',
        impactLevel: 'medium'
      },
      {
        id: 'loan-processing',
        name: 'Loan Processing',
        type: 'process',
        status: 'warning',
        dependencies: ['loan-management', 'document-verification'],
        assets: ['workflow-engine', 'document-store', 'notification-service'],
        processType: 'core',
        description: 'Automated loan application processing',
        impactLevel: 'high'
      },
      {
        id: 'customer-verification',
        name: 'Customer Verification',
        type: 'process',
        status: 'active',
        dependencies: ['kyc-process'],
        assets: ['identity-service', 'document-scanner', 'compliance-db'],
        processType: 'support',
        description: 'Customer identity and document verification',
        impactLevel: 'medium'
      },
      {
        id: 'fraud-detection',
        name: 'Fraud Detection',
        type: 'process',
        status: 'active',
        dependencies: ['data-analytics', 'transaction-monitoring'],
        assets: ['ml-engine', 'real-time-db', 'alert-system'],
        processType: 'support',
        description: 'Real-time fraud detection and prevention',
        impactLevel: 'high'
      },
      {
        id: 'account-management',
        name: 'Account Management',
        type: 'process',
        status: 'active',
        dependencies: ['customer-verification'],
        assets: ['core-banking', 'customer-portal', 'notification-service'],
        processType: 'core',
        description: 'Customer account lifecycle management',
        impactLevel: 'high'
      },
      {
        id: 'data-analytics',
        name: 'Data Analytics',
        type: 'process',
        status: 'active',
        dependencies: [],
        assets: ['snowflake', 'tableau', 'spark-cluster'],
        processType: 'support',
        description: 'Business intelligence and analytics',
        impactLevel: 'medium'
      },
      {
        id: 'kyc-process',
        name: 'KYC Process',
        type: 'process',
        status: 'active',
        dependencies: [],
        assets: ['kyc-platform', 'document-store', 'compliance-db'],
        processType: 'support',
        description: 'Know Your Customer compliance process',
        impactLevel: 'medium'
      },
      {
        id: 'document-verification',
        name: 'Document Verification',
        type: 'process',
        status: 'active',
        dependencies: [],
        assets: ['ocr-service', 'document-store', 'verification-api'],
        processType: 'support',
        description: 'Automated document verification',
        impactLevel: 'low'
      },
      {
        id: 'transaction-monitoring',
        name: 'Transaction Monitoring',
        type: 'process',
        status: 'active',
        dependencies: [],
        assets: ['real-time-db', 'monitoring-system', 'alert-system'],
        processType: 'support',
        description: 'Real-time transaction monitoring',
        impactLevel: 'medium'
      },

      // Assets
      {
        id: 'salesforce',
        name: 'Salesforce',
        type: 'asset',
        status: 'active',
        dependencies: [],
        processType: 'external',
        description: 'CRM and customer management platform'
      },
      {
        id: 'snowflake',
        name: 'Snowflake',
        type: 'asset',
        status: 'active',
        dependencies: [],
        processType: 'external',
        description: 'Data warehouse and analytics platform'
      },
      {
        id: 'oracle-db',
        name: 'Oracle Database',
        type: 'asset',
        status: 'active',
        dependencies: [],
        processType: 'external',
        description: 'Primary database system'
      },
      {
        id: 'core-banking',
        name: 'Core Banking System',
        type: 'asset',
        status: 'active',
        dependencies: [],
        processType: 'external',
        description: 'Central banking operations system'
      },
      {
        id: 'ml-engine',
        name: 'ML Engine',
        type: 'asset',
        status: 'active',
        dependencies: [],
        processType: 'external',
        description: 'Machine learning processing engine'
      }
    ];

    const links: GraphLink[] = [
      // Process Dependencies (Process A follows Process B)
      { source: 'loan-management', target: 'credit-rating', type: 'dependency', label: 'depends on' },
      { source: 'loan-management', target: 'customer-verification', type: 'dependency', label: 'depends on' },
      { source: 'loan-processing', target: 'loan-management', type: 'dependency', label: 'depends on' },
      { source: 'loan-processing', target: 'document-verification', type: 'dependency', label: 'depends on' },
      { source: 'credit-rating', target: 'data-analytics', type: 'dependency', label: 'depends on' },
      { source: 'customer-verification', target: 'kyc-process', type: 'dependency', label: 'depends on' },
      { source: 'atm-process', target: 'account-management', type: 'dependency', label: 'depends on' },
      { source: 'atm-process', target: 'fraud-detection', type: 'dependency', label: 'depends on' },
      { source: 'fraud-detection', target: 'data-analytics', type: 'dependency', label: 'depends on' },
      { source: 'fraud-detection', target: 'transaction-monitoring', type: 'dependency', label: 'depends on' },
      { source: 'account-management', target: 'customer-verification', type: 'dependency', label: 'depends on' },

      // Asset Usage Links
      { source: 'loan-management', target: 'salesforce', type: 'uses_asset', label: 'uses' },
      { source: 'loan-management', target: 'oracle-db', type: 'uses_asset', label: 'uses' },
      { source: 'credit-rating', target: 'snowflake', type: 'uses_asset', label: 'uses' },
      { source: 'credit-rating', target: 'ml-engine', type: 'uses_asset', label: 'uses' },
      { source: 'atm-process', target: 'core-banking', type: 'uses_asset', label: 'uses' },
      { source: 'account-management', target: 'core-banking', type: 'uses_asset', label: 'uses' },
      { source: 'fraud-detection', target: 'ml-engine', type: 'uses_asset', label: 'uses' },
      { source: 'data-analytics', target: 'snowflake', type: 'uses_asset', label: 'uses' },
    ];

    return { nodes, links };
  }, [processesData]);

  // Calculate impact analysis when a node is selected
  const calculateImpactAnalysis = (nodeId: string) => {
    const impactedProcesses: string[] = [];
    
    const findDependents = (processId: string) => {
      graphData.links.forEach(link => {
        if (typeof link.target === 'string' && link.target === processId && link.type === 'dependency') {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          if (!impactedProcesses.includes(sourceId)) {
            impactedProcesses.push(sourceId);
            findDependents(sourceId);
          }
        }
      });
    };

    findDependents(nodeId);
    setImpactAnalysis(impactedProcesses);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 700;

    const container = svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fafafa");

    const g = container.append("g");

    // Define arrow markers for dependency links
    const defs = svg.append("defs");
    
    defs.append("marker")
      .attr("id", "dependency-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

    defs.append("marker")
      .attr("id", "asset-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#2196F3");

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create force simulation with proper typing
    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(graphData.links).id(d => d.id).distance((d: GraphLink) => {
        return d.type === 'dependency' ? 200 : 150;
      }))
      .force("charge", d3.forceManyBody<GraphNode>().strength((d: GraphNode) => {
        return d.type === 'process' ? -400 : -200;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d: GraphNode) => {
        return d.type === 'process' ? 60 : 40;
      }));

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke", (d: GraphLink) => {
        if (d.type === 'dependency') return "#FF5722";
        if (d.type === 'uses_asset') return "#2196F3";
        return "#999";
      })
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", (d: GraphLink) => d.type === 'dependency' ? 3 : 2)
      .style("stroke-dasharray", (d: GraphLink) => {
        if (d.type === 'dependency') return "none";
        if (d.type === 'uses_asset') return "8,4";
        return "none";
      })
      .attr("marker-end", (d: GraphLink) => {
        if (d.type === 'dependency') return "url(#dependency-arrow)";
        if (d.type === 'uses_asset') return "url(#asset-arrow)";
        return "none";
      });

    // Create nodes
    const node = g.append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer");

    // Node circles
    // Node circles - make them much smaller
    // Node circles - white background with colored borders
    node.append("circle")
    .attr("r", (d: GraphNode) => {
        if (d.type === 'process') {
        if (d.impactLevel === 'high') return 25;
        if (d.impactLevel === 'medium') return 22;
        return 20;
        }
        return 18; // Assets
    })
    .attr("fill", "white") // White background for all circles
    .attr("stroke", (d: GraphNode) => {
        if (d.type === 'process') {
        if (d.status === 'critical') return "#F44336";
        if (d.status === 'warning') return "#FF9800";
        if (d.processType === 'core') return "#4CAF50";
        return "#2196F3";
        }
        return "#9C27B0"; // Assets
    })
  .attr("stroke-width", 3) // Thicker border for better visibility
  .style("filter", "drop-shadow(0 2px 6px rgba(0,0,0,0.15))") // Subtle shadow
  .on("click", (event, d: GraphNode) => {
    setSelectedNode(d);
    if (d.type === 'process') {
      calculateImpactAnalysis(d.id);
    }
  });



    // Node icons
// Node icons - smaller to fit in smaller circles
node.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .attr("fill", "white")
  .attr("font-size", (d: GraphNode) => d.type === 'process' ? "12px" : "10px") // Reduced from 16px and 12px
  .text((d: GraphNode) => {
    if (d.type === 'process') {
      if (d.processType === 'core') return "🏦";
      if (d.processType === 'support') return "⚙️";
      return "🔧";
    }
    return "💾"; // Assets
  });


    // Node labels
// Node labels - positioned below the circles like in your reference
    // Node labels - positioned below the smaller circles
node.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", (d: GraphNode) => {
    if (d.type === 'process') {
      let radius = 20; // default
      if (d.impactLevel === 'high') radius = 25;
      else if (d.impactLevel === 'medium') radius = 22;
      
      return `${radius + 18}px`; // Position text below the circle
    } else {
      return "38px"; // 18px radius + 20px spacing
    }
  })
  .attr("font-size", "12px") // Slightly smaller font
  .attr("font-weight", "600")
  .attr("fill", "#333")
  .style("text-shadow", "1px 1px 2px rgba(255,255,255,0.8)")
  .text((d: GraphNode) => d.name);


    // Status indicators for processes
    // Status indicators - adjust position for smaller circles
node.filter((d: GraphNode) => d.type === 'process' && (d.status === 'warning' || d.status === 'critical'))
  .append("circle")
  .attr("r", 5) // Smaller indicator
  .attr("cx", 18) // Closer to the smaller circle
  .attr("cy", -18)
  .attr("fill", (d: GraphNode) => d.status === 'critical' ? "#F44336" : "#FF9800")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);

node.filter((d: GraphNode) => d.type === 'process' && (d.status === 'warning' || d.status === 'critical'))
  .append("text")
  .attr("text-anchor", "middle")
  .attr("x", 18)
  .attr("y", -18)
  .attr("dy", "0.35em")
  .attr("font-size", "8px")
  .attr("font-weight", "bold")
  .attr("fill", "white")
  .text("!");

// Impact level indicators - adjust position
node.filter((d: GraphNode) => d.type === 'process' && d.impactLevel === 'high')
  .append("circle")
  .attr("r", 4) // Smaller indicator
  .attr("cx", -18) // Closer to the smaller circle
  .attr("cy", -18)
  .attr("fill", "#FF5722")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);

node.filter((d: GraphNode) => d.type === 'process' && d.impactLevel === 'high')
  .append("text")
  .attr("text-anchor", "middle")
  .attr("x", -18)
  .attr("y", -18)
  .attr("dy", "0.35em")
  .attr("font-size", "7px")
  .attr("fill", "white")
  .attr("font-weight", "bold")
  .text("H");


    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on("start", (event, d: GraphNode) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d: GraphNode) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d: GraphNode) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: GraphNode) => `translate(${d.x},${d.y})`);
    });

  }, [graphData]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.2
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.8
    );
  };

  const handleCenter = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '700px' }}>
      {/* Impact Analysis Alert */}
      {impactAnalysis.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 15,
            maxWidth: '80%'
          }}
          onClose={() => setImpactAnalysis([])}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Impact Analysis: {impactAnalysis.length} processes would be affected
          </Typography>
          <Typography variant="body2">
            {impactAnalysis.map(id => graphData.nodes.find(n => n.id === id)?.name).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* Controls */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: 'white',
          borderRadius: 1,
          p: 1,
          boxShadow: 1,
        }}
      >
        <Tooltip title="Zoom In">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomIn />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip title="Center">
          <IconButton size="small" onClick={handleCenter}>
            <CenterFocusStrong />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Enhanced Legend */}
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          p: 2,
          zIndex: 10,
          minWidth: 280,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Process Dependency Map
        </Typography>
        
        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
          Process Types:
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
            <Typography variant="caption">Core Business Process</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2196F3' }} />
            <Typography variant="caption">Support Process</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#9C27B0' }} />
            <Typography variant="caption">Asset/System</Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
          Relationships:
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 20, height: 2, backgroundColor: '#FF5722' }} />
            <Typography variant="caption">Process Dependency</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ 
              width: 20, 
              height: 2, 
              backgroundColor: '#2196F3',
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 6px)'
            }} />
            <Typography variant="caption">Uses Asset</Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Main SVG */}
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      />

      {/* Enhanced Node Details Panel */}
      {selectedNode && (
        <Card
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 10,
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {selectedNode.name}
              </Typography>
              {selectedNode.status === 'warning' && <Warning color="warning" />}
              {selectedNode.status === 'critical' && <Error color="error" />}
              {selectedNode.status === 'active' && <CheckCircle color="success" />}
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={selectedNode.type}
                  size="small"
                  color={selectedNode.type === 'process' ? 'primary' : 'secondary'}
                />
                {selectedNode.processType && (
                  <Chip
                    label={selectedNode.processType}
                    size="small"
                    variant="outlined"
                  />
                )}
                {selectedNode.impactLevel && (
                  <Chip
                    label={`${selectedNode.impactLevel} impact`}
                    size="small"
                    color={selectedNode.impactLevel === 'high' ? 'error' : selectedNode.impactLevel === 'medium' ? 'warning' : 'default'}
                  />
                )}
              </Stack>

              {selectedNode.description && (
                <Typography variant="body2" color="textSecondary">
                  {selectedNode.description}
                </Typography>
              )}

              {selectedNode.assets && selectedNode.assets.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Storage fontSize="small" />
                      Associated Assets:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedNode.assets.map((asset, index) => (
                        <Chip
                          key={index}
                          label={asset.replace('-', ' ')}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                    </Stack>
                  </Box>
                </>
              )}

              {selectedNode.dependencies && selectedNode.dependencies.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Dependencies:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Depends on: {selectedNode.dependencies.join(', ')}
                    </Typography>
                  </Box>
                </>
              )}

              {impactAnalysis.length > 0 && selectedNode.type === 'process' && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'warning.main' }}>
                      ⚠️ Impact Analysis:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      If this process fails, {impactAnalysis.length} other process(es) will be affected.
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProcessDependencyGraph;
