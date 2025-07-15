import { Box, Typography } from '@mui/material'
import React from 'react'

const Header = () => {
  return (
    <Box sx={{textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', color: '#000000'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          RiskGPS
        </Typography>
    </Box>
  )
}

export default Header
