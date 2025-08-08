import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, Tooltip } from '@mui/material';
import { AccountBalance, Storage } from '@mui/icons-material';
import { ITEM_TYPES, NodeData } from './types';

interface ProcessAssetNodeProps {
  data: NodeData;
}

const ProcessAssetNode: React.FC<ProcessAssetNodeProps> = ({ data }) => {
  const itemType = ITEM_TYPES[data.itemType] || ITEM_TYPES.process;
  const IconComponent = data.itemType === 'process' ? AccountBalance : Storage;
  
  const isMainItem = data.isMain;
  const isAssetHeader = data.isAssetHeader;
  
  return (
    <Tooltip title={`${data.label} - ${itemType.label}`} arrow>
      <Box
        onClick={() => data.onNodeClick?.(data)}
        sx={{
          width: isAssetHeader ? 120 : (isMainItem ? 100 : 80),
          height: isAssetHeader ? 60 : (isMainItem ? 80 : 70),
          borderRadius: isAssetHeader ? 2 : 3,
          backgroundColor: isAssetHeader ? itemType.color : itemType.bgColor,
          border: isAssetHeader ? 'none' : `3px solid ${itemType.color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isAssetHeader
            ? '0 3px 10px rgba(0,0,0,0.15)'
            : (isMainItem ? '0 6px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.15)'),
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isAssetHeader
              ? '0 4px 12px rgba(0,0,0,0.2)'
              : (isMainItem ? '0 8px 25px rgba(0,0,0,0.25)' : '0 6px 16px rgba(0,0,0,0.2)'),
            transform: 'translateY(-2px)'
          }
        }}
      >
        {/* Icon and Label Content */}
        {!isAssetHeader && (
          <Box
            sx={{
              width: isMainItem ? 30 : 26,
              height: isMainItem ? 30 : 26,
              borderRadius: '50%',
              backgroundColor: itemType.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <IconComponent sx={{ fontSize: isMainItem ? 14 : 10, color: 'white' }} />
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            fontSize: isAssetHeader ? '12px' : (isMainItem ? '8px' : '6px'),
            lineHeight: 1.2,
            color: isAssetHeader ? '#ffffff' : '#333',
            px: 1,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {data.label}
        </Typography>

        {isAssetHeader && (
          <Storage sx={{ fontSize: 16, color: '#ffffff', mt: 0.5 }} />
        )}

        {/* Status and Main Indicators */}
        {!isAssetHeader && data.status && data.status !== 'active' && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: data.status === 'warning' ? '#FF9800' : '#F44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
              !
            </Typography>
          </Box>
        )}

        {!isAssetHeader && isMainItem && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: -8,
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <Typography sx={{ color: '#333', fontSize: '10px', fontWeight: 'bold' }}>
              M
            </Typography>
          </Box>
        )}

        {/* Connection Handles */}
        {isAssetHeader ? (
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #9C27B0',
              width: 10,
              height: 10,
              bottom: -5
            }}
          />
        ) : (
          <>
            {data.viewType === 'process' && (
              <>
                <Handle
                  type="target"
                  position={Position.Left}
                  style={{
                    backgroundColor: itemType.color,
                    border: '2px solid #ffffff',
                    width: 8,
                    height: 8,
                    left: -4
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
                    right: -4
                  }}
                />
              </>
            )}
            
            {data.viewType === 'asset' && (
              <>
                {/* <Handle  type="target" id={""} position={Position.Left} style={{ backgroundColor: "#c58c8cff", border: '2px solid #ffffff', width: 8, height: 8, left: -4, zIndex: 15}} /> */}
                {/* <Handle type="source" position={Position.Right} style={{ backgroundColor: itemType.color, border: '2px solid #ffffff', width: 8, height: 8, right: -4 }} /> */}
                <Handle type="target" position={Position.Top} style={{ backgroundColor: itemType.color, border: '2px solid #ffffff', width: 8, height: 8, top: -4 }} />
                {/* <Handle type="source" position={Position.Bottom} style={{ backgroundColor: itemType.color, border: '2px solid #ffffff', width: 8, height: 8, bottom: -4 }} /> */}
              </>
            )}
          </>
        )}
      </Box>
    </Tooltip>
  );
};

export default ProcessAssetNode;
