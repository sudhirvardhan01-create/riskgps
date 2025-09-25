import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from "next/image";
import CreateBusinessUnitForm from './CreateBusinessUnitForm';

interface BusinessUnitFormData {
  businessUnitName: string;
  buHead: { name: string; email: string };
  buPocBiso: { name: string; email: string };
  buItPoc: { name: string; email: string };
  buFinanceLead: { name: string; email: string };
  tags: { key: string; value: string }[];
}

const BusinessUnits: React.FC = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCreateBusinessUnit = () => {
    setIsCreateFormOpen(true);
  };

  const handleFormSubmit = (data: BusinessUnitFormData) => {
    // TODO: Implement API call to create business unit
    console.log('Business Unit Data:', data);
    // Here you would typically make an API call to save the business unit
  };

  const handleFormClose = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        py: 2,
      }}
    >
      {/* Placeholder Icon */}
      <Box
        sx={{
          width: 120,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Image
          src={"/create-bu.png"}
          alt="org-image"
          width={120}
          height={120}
        />
      </Box>

      {/* Main message */}
      <Typography
        variant="h6"
        sx={{
          fontSize: '18px',
          fontWeight: 400,
          color: '#484848',
          mb: 2,
          lineHeight: '130%',
          letterSpacing: "0px"
        }}
      >
        Looks like you haven't created any Business Units yet. <br />
        Click on 'Create Business Unit' to start organizing your units and streamline your operations.
      </Typography>

      {/* Create Business Unit Button */}
      <Button
        variant="contained"
        onClick={handleCreateBusinessUnit}
        sx={{
          backgroundColor: '#04139A',
          color: '#F4F4F4',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '100%',
          letterSpacing: '0px',
          textTransform: 'none',
          p: "12px 40px",
          borderRadius: '4px',
          minWidth: '229px',
          height: '40px',
          '&:hover': {
            backgroundColor: '#04139A',
          },
          '&:focus': {
            backgroundColor: '#04139A',
          },
        }}
      >
        Create Business Unit
      </Button>

      {/* Create Business Unit Form Modal */}
      <CreateBusinessUnitForm
        open={isCreateFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default BusinessUnits;
