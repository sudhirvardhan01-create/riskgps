import React from 'react';
import { Stack, Box, Typography } from '@mui/material';

const ProcessLegend: React.FC = () => (
  <Stack spacing={1.5}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ 
        width: 20, 
        height: 3, 
        backgroundColor: '#4CAF50',
        borderRadius: 1
      }} />
      <Typography variant="caption" sx={{ color: '#666' }}>
        Process Flow
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
  </Stack>
);

export default ProcessLegend;
