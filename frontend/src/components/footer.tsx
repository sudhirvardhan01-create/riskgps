import Image from 'next/image'
import React from 'react'
import styles from "@/styles/Home.module.css";
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', color: '#000000', position: 'absolute', bottom: 0, width: '100%' }}>
        <Typography>
            @copyright 2025 RiskGPS. All rights reserved.
        </Typography>
    </Box>
  )
}

export default Footer
