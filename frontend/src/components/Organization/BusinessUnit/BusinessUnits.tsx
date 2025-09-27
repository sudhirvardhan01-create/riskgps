import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import Image from "next/image";
import CreateBusinessUnitForm from './CreateBusinessUnitForm';
import BusinessUnitCard from './BusinessUnitCard';
import BusinessUnitDetailsModal from './BusinessUnitDetailsModal';
import { Add as AddIcon } from '@mui/icons-material';

interface BusinessUnitFormData {
  businessUnitName: string;
  buHead: { name: string; email: string };
  buPocBiso: { name: string; email: string };
  buItPoc: { name: string; email: string };
  buFinanceLead: { name: string; email: string };
  tags: { key: string; value: string }[];
}

interface BusinessUnitData {
  id: string;
  businessUnitName: string;
  buCode: string;
  buSize: number;
  assessments: number;
  tags: { key: string; value: string }[];
  status: 'active' | 'inactive';
  lastUpdated?: string;
}

const BusinessUnits: React.FC = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<BusinessUnitData | null>(null);

  // Mock data for business units - replace with actual API call
  // To test empty state, change this to an empty array: []
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([
    {
      id: '1',
      businessUnitName: 'Inpatient Services',
      buCode: 'BU283692',
      buSize: 33,
      assessments: 0,
      tags: [
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' }
      ],
      status: 'active',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      businessUnitName: 'Critical care Services',
      buCode: 'BU283692',
      buSize: 33,
      assessments: 0,
      tags: [
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' }
      ],
      status: 'active',
      lastUpdated: '2024-01-15'
    },
    {
      id: '3',
      businessUnitName: 'Outpatient Services',
      buCode: 'BU283692',
      buSize: 33,
      assessments: 0,
      tags: [
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' },
        { key: 'key', value: 'Value' }
      ],
      status: 'active',
      lastUpdated: '2024-01-15'
    }
  ]);

  const handleCreateBusinessUnit = () => {
    setIsCreateFormOpen(true);
  };

  const handleFormSubmit = (data: BusinessUnitFormData) => {
    // TODO: Implement API call to create business unit
    console.log('Business Unit Data:', data);

    // Create new business unit from form data
    const newBusinessUnit: BusinessUnitData = {
      id: Date.now().toString(),
      businessUnitName: data.businessUnitName,
      buCode: `BU${Math.floor(Math.random() * 1000000)}`,
      buSize: 0, // This would come from the form or be calculated
      assessments: 0,
      tags: data.tags,
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setBusinessUnits(prev => [...prev, newBusinessUnit]);
    setIsCreateFormOpen(false);
  };

  const handleFormClose = () => {
    setIsCreateFormOpen(false);
  };

  const handleEditBusinessUnit = (businessUnit: BusinessUnitData) => {
    // TODO: Implement edit functionality
    console.log('Edit business unit:', businessUnit);
  };

  const handleBusinessUnitClick = (businessUnit: BusinessUnitData) => {
    setSelectedBusinessUnit(businessUnit);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedBusinessUnit(null);
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setBusinessUnits(prev =>
      prev.map(bu => bu.id === id ? { ...bu, status } : bu)
    );
  };

  return (
    <Box sx={{ pt:2, pl: 3, pr: 3, pb: 3 }}>
      {businessUnits.length === 0 ? (
        // Empty state when no business units exist
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
        </Box>
      ) : (
        // Display business unit cards when business units exist
        <Box>
          {/* Header with Create Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#04139A",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={handleCreateBusinessUnit}
            >
              <AddIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "inherit", lineHeight: "130%", letterSpacing: "0%" }}>
                Create Business Unit
              </Typography>
            </Box>
          </Box>

          {/* Business Unit Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {businessUnits.map((businessUnit) => (
              <BusinessUnitCard
                key={businessUnit.id}
                businessUnit={businessUnit}
                onEdit={handleEditBusinessUnit}
                onStatusChange={handleStatusChange}
                onClick={handleBusinessUnitClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Create Business Unit Form Modal */}
      <CreateBusinessUnitForm
        open={isCreateFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Business Unit Details Modal */}
      <BusinessUnitDetailsModal
        open={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        businessUnit={selectedBusinessUnit}
        onEdit={handleEditBusinessUnit}
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
};

export default BusinessUnits;
