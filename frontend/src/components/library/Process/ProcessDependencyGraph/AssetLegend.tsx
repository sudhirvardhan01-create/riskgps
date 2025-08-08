import React from 'react';
import { Stack, Box, Typography } from '@mui/material';

const AssetLegend: React.FC = () => (
  <Stack spacing={1.5}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ 
        width: 20, 
        height: 3, 
        backgroundColor: '#9C27B0',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 4px)',
        borderRadius: 1
      }} />
      <Typography variant="caption" sx={{ color: '#666' }}>
        Single Asset Dependency
      </Typography>
    </Stack>
    
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ 
        width: 20, 
        height: 3, 
        backgroundColor: '#FF6B35',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 3px)',
        borderRadius: 1
      }} />
      <Typography variant="caption" sx={{ color: '#666' }}>
        Multi-Asset Dependency
      </Typography>
    </Stack>

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
        Process
      </Typography>
    </Stack>

    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ 
        width: 16, 
        height: 16, 
        borderRadius: '50%', 
        backgroundColor: '#9C27B0',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }} />
      <Typography variant="caption" sx={{ color: '#666' }}>
        Asset/System
      </Typography>
    </Stack>
  </Stack>
);

export default AssetLegend;
