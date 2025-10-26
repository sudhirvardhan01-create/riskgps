import React, { useState } from 'react';
import { Box, Chip, Typography, Stack, Divider, FormControlLabel, Switch } from '@mui/material';
import Image from "next/image";
import DisableConfirmationModal from './DisableConfirmationModal';
import { BusinessUnitData } from '@/types/business-unit';

interface BusinessUnitCardProps {
  businessUnit: BusinessUnitData;
  onEdit: (businessUnit: BusinessUnitData) => void;
  onStatusChange: (id: string, status: 'active' | 'disable') => void;
  onClick: (businessUnit: BusinessUnitData) => void;
}

const BusinessUnitCard: React.FC<BusinessUnitCardProps> = ({
  businessUnit,
  onEdit,
  onStatusChange,
  onClick,
}) => {
  const [showDisableModal, setShowDisableModal] = useState(false);
  
  const formattedDate = businessUnit.lastUpdated
    ? new Date(businessUnit.lastUpdated).toISOString().split('T')[0]
    : '';

  const handleCardClick = () => {
    onClick(businessUnit);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(businessUnit);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newStatus = e.target.checked ? 'active' : 'disable';
    
    // If trying to disable, show confirmation modal
    if (newStatus === 'disable') {
      setShowDisableModal(true);
    } else {
      // If enabling, proceed directly
      onStatusChange(businessUnit.id, newStatus);
    }
  };

  const handleDisableConfirm = () => {
    onStatusChange(businessUnit.id, 'disable');
    setShowDisableModal(false);
  };

  const handleDisableCancel = () => {
    setShowDisableModal(false);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 4px 0px #D9D9D98F',
        border: '1px solid #E7E7E8',
        backgroundColor: '#FFFFFF',
        // height: "137px",
        p: "12px 24px",
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 4px 8px 0px #D9D9D98F',
        },
      }}
    >
      {/* Header */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#484848' }}>
            {businessUnit.businessUnitName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={businessUnit.status === 'active'}
                  onChange={handleStatusChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#147A50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#147A50',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: businessUnit.status === 'active' ? '#147A50' : '#9E9E9E', fontWeight: 400 }}>
                  {businessUnit.status === 'active' ? 'Active' : 'Disable'}
                </Typography>
              }
              sx={{ m: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
            <Box
              onClick={handleEditClick}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <Image
                src={"/edit-icon.png"}
                alt="edit-icon"
                width={16}
                height={16}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Details */}
      <Box>
        <Typography
          variant="body2"
          color="#484848"
          sx={{
            mb: 1.5,
            fontWeight: 400,
          }}
        >
          <Box component="span" sx={{ mr: 1 }}>
            {businessUnit.buCode}
          </Box>
          •
          <Box component="span" sx={{ ml: 1, mr: 1 }}>
            BU Size: {businessUnit.buSize}
          </Box>
          •
          <Box component="span" sx={{ ml: 1 }}>
            Assessments: {businessUnit.assessments}
          </Box>
        </Typography>
      </Box>

      {businessUnit.tags && businessUnit.tags.length > 0 && <Divider sx={{ mb: 1.5 }} />}

      {/* Tags */}
      {businessUnit.tags && businessUnit.tags.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'flex-start',
          }}
        >
          {businessUnit.tags.map((tag, index) => (
            <Chip
              key={index}
              label={`${tag.key} - ${tag.value}`}
              variant="outlined"
              sx={{
                borderRadius: "4px",
                border: '1px solid #E7E7E8',
                backgroundColor: '#F5F5F5',
                color: '#484848',
                fontWeight: 400,
                height: '26px',
                padding: "4px 12px",
                boxShadow: '0px 1px 2px 0px #E7E7E84D',
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      )}
      
      <DisableConfirmationModal
        open={showDisableModal}
        onClose={handleDisableCancel}
        onConfirm={handleDisableConfirm}
        businessUnitName={businessUnit.businessUnitName}
      />
    </Box>
  );
};

export default BusinessUnitCard;