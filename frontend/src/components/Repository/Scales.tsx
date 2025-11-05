import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextFieldStyled from '../TextFieldStyled';
import ToastComponent from '../ToastComponent';

interface BusinessImpact {
  financial: number;
  regulatory: number;
  reputational: number;
  operational: number;
}

interface ImpactScale { 
  id: number;
  label: string;
  value: number;
  color: string;
}

const Scales: React.FC = () => {
  const [businessImpacts, setBusinessImpacts] = useState<BusinessImpact>({
    financial: 40,
    regulatory: 30,
    operational: 20,
    reputational: 10,
  });

  const [isWeightageModalOpen, setIsWeightageModalOpen] = useState(false);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [weightageInputs, setWeightageInputs] = useState<BusinessImpact>({
    financial: 40,
    regulatory: 30,
    operational: 20,
    reputational: 10,
  });
  const [labelsInputs, setLabelsInputs] = useState<ImpactScale[]>([
    { id: 1, label: 'Very Low', value: 1, color: '#3BB966' },
    { id: 2, label: 'Low', value: 2, color: '#3366CC' },
    { id: 3, label: 'Moderate', value: 3, color: '#E3B52A' },
    { id: 4, label: 'High', value: 4, color: '#DA7706' },
    { id: 5, label: 'Critical', value: 5, color: '#B90D0D' },
  ]);

  const [impactScales, setImpactScales] = useState<ImpactScale[]>([
    { id: 1, label: 'Very Low', value: 1, color: '#3BB966' }, // Green
    { id: 2, label: 'Low', value: 2, color: '#3366CC' }, // Blue
    { id: 3, label: 'Moderate', value: 3, color: '#E3B52A' }, // Yellow
    { id: 4, label: 'High', value: 4, color: '#DA7706' }, // Orange
    { id: 5, label: 'Critical', value: 5, color: '#B90D0D' }, // Red
  ]);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleBusinessImpactChange = (field: keyof BusinessImpact, value: string) => {
    // Allow empty string for better UX
    if (value === '') {
      setBusinessImpacts(prev => ({
        ...prev,
        [field]: 0
      }));
    } else {
      const numValue = parseInt(value) || 0;
      setBusinessImpacts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleScaleLabelChange = (id: number, newLabel: string) => {
    setImpactScales(prev => 
      prev.map(scale => 
        scale.id === id ? { ...scale, label: newLabel } : scale
      )
    );
  };

  const handleAddWeightage = () => {
    // Prefill with existing values if they exist, otherwise reset to empty state
    setWeightageInputs({
      financial: businessImpacts.financial || 0,
      regulatory: businessImpacts.regulatory || 0,
      reputational: businessImpacts.reputational || 0,
      operational: businessImpacts.operational || 0,
    });
    setIsWeightageModalOpen(true);
  };

  const handleWeightageInputChange = (field: keyof BusinessImpact, value: string) => {
    const numValue = parseInt(value) || 0;
    setWeightageInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Validation function to check if all weightage inputs are filled
  const isAllWeightageInputsFilled = () => {
    return Object.values(weightageInputs).every(value => value > 0);
  };

  // Validation function to check if all label inputs are filled
  const isAllLabelInputsFilled = () => {
    return labelsInputs.every(scale => scale.label.trim() !== '');
  };

  // Helper function to check if weightage values exist
  const hasWeightageValues = () => {
    return Object.values(businessImpacts).some(value => value > 0);
  };

  // Helper function to check if label values exist
  const hasLabelValues = () => {
    return impactScales.some(scale => scale.label.trim() !== '');
  };

  const handleSaveWeightage = () => {
    const total = Object.values(weightageInputs).reduce((sum, value) => sum + value, 0);
    if (total === 100) {
      setBusinessImpacts(weightageInputs);
      setIsWeightageModalOpen(false);
      setToast({
        open: true,
        message: 'Business Impact weightage added successfully',
        severity: 'success',
      });
    } else {
      setToast({
        open: true,
        message: 'Please ensure that the total sum of all fields equals 100',
        severity: 'error',
      });
    }
  };

  const handleCancelWeightage = () => {
    setIsWeightageModalOpen(false);
    setWeightageInputs({
      financial: 0,
      regulatory: 0,
      reputational: 0,
      operational: 0,
    });
  };

  const handleAddLabels = () => {
    // Prefill with existing values if they exist, otherwise reset to empty state
    setLabelsInputs(impactScales.map(scale => ({
      ...scale,
      label: scale.label || ''
    })));
    setIsLabelsModalOpen(true);
  };

  const handleLabelsInputChange = (id: number, newLabel: string) => {
    setLabelsInputs(prev => 
      prev.map(scale => 
        scale.id === id ? { ...scale, label: newLabel } : scale
      )
    );
  };

  const handleSaveLabels = () => {
    setImpactScales(labelsInputs);
    setIsLabelsModalOpen(false);
    setToast({
      open: true,
      message: 'Impact scale labels updated successfully',
      severity: 'success',
    });
  };

  const handleCancelLabels = () => {
    setIsLabelsModalOpen(false);
    setLabelsInputs(impactScales);
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mb:6 }}>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Business Impacts Section */}
        <Box sx={{ flex: 1 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%',
              border: '1px solid #E4E4E4',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Business Impacts Header */}
            <Box
              sx={{
                backgroundColor: '#EDF3FCA3',
                px: 2,
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #E4E4E4'
              }}
            >
              <Typography variant="h6" fontWeight={600} color="#484848">
                Business Impacts
              </Typography>
              <Button
                variant="text"
                onClick={handleAddWeightage}
                sx={{
                  color: '#04139A',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(4, 19, 154, 0.1)'
                  }
                }}
              >
                {hasWeightageValues() ? 'Edit weightage' : 'Add weightage'}
              </Button>
            </Box>

            {/* Business Impacts Content */}
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="#91939A" sx={{ mb: 3 }}>
                Add weightage for different types of business Impact:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 7 }}>
                {[
                  { key: 'financial', label: 'Financial' },
                  { key: 'regulatory', label: 'Regulatory' },
                  { key: 'operational', label: 'Operational' },
                  { key: 'reputational', label: 'Reputational' }
                ].map(({ key, label }) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="#484848" sx={{ minWidth: 'fit-content', fontWeight: 400 }}>
                      {label}:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#91939A',
                        fontWeight: 400,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                      }}
                    >
                      {businessImpacts[key as keyof BusinessImpact] || '00'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Impact Scale Section */}
        <Box sx={{ flex: 1 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%',
              border: '1px solid #E4E4E4',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Impact Scale Header */}
            <Box
              sx={{
                backgroundColor: '#EDF3FCA3',
                px: 2,
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #E4E4E4'
              }}
            >
              <Typography variant="h6" fontWeight={600} color="#484848">
                Impact Scale
              </Typography>
              <Button
                variant="text"
                onClick={handleAddLabels}
                sx={{
                  color: '#04139A',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(4, 19, 154, 0.1)'
                  }
                }}
              >
                {hasLabelValues() ? 'Edit labels' : 'Add labels'}
              </Button>
            </Box>

            {/* Impact Scale Content */}
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="#91939A" sx={{ mb: 3 }}>
                Add labels for impact scale
              </Typography>
              
              {/* Horizontal Impact Scale Bar */}
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: 80,
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #E4E4E4'
                }}
              >
                {impactScales.map((scale, index) => (
                  <Box
                    key={scale.id}
                    sx={{
                      flex: 1,
                      backgroundColor: scale.color,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      // Rounded corners for first and last segments
                      borderRadius: index === 0 ? '4px 0 0 4px' : index === impactScales.length - 1 ? '0 4px 4px 0' : '0',
                      // Remove border between segments
                      borderRight: index < impactScales.length - 1 ? 'none' : 'none',
                    }}
                  >
                    {/* Label Input */}
                    <TextField
                      value={scale.label}
                      onChange={(e) => handleScaleLabelChange(scale.id, e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-root': {
                          '&:before': {
                            borderBottom: 'none',
                          },
                          '&:after': {
                            borderBottom: 'none',
                          },
                          '&:hover:not(.Mui-disabled):before': {
                            borderBottom: 'none',
                          },
                        },
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          padding: '4px 8px',
                          '&::placeholder': {
                            color: '#FFFFFF',
                            opacity: 0.8,
                          }
                        }
                      }}
                      placeholder="Label"
                      inputProps={{
                        style: { 
                          textAlign: 'center',
                          minWidth: '60px',
                          maxWidth: '80px'
                        }
                      }}
                    />
                    {/* Number Display */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        mt: 0.5
                      }}
                    >
                      {scale.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Weightage Modal */}
      <Modal
        open={isWeightageModalOpen}
        onClose={handleCancelWeightage}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            outline: 'none',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              borderBottom: '1px solid #E4E4E4',
            }}
          >
            <Typography variant="h6" fontWeight={600} color="#484848">
              {hasWeightageValues() ? 'Edit weightage for Business Impact' : 'Add weightage for Business Impact'}
            </Typography>
            <IconButton
              onClick={handleCancelWeightage}
              sx={{
                color: '#04139A',
                '&::hover': {
                  backgroundColor: 'rgba(92, 120, 246, 0.1)',   
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ pt: 2 }}>
            <Typography 
              variant="body2" 
              color="#91939A" 
              sx={{ mb: 3, fontSize: '0.875rem' }}
            >
              Please ensure that the total sum of all fields equals 100
            </Typography>

            {/* Input Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { key: 'financial', label: 'Financial' },
                { key: 'regulatory', label: 'Regulatory' },
                { key: 'reputational', label: 'Reputational' },
                { key: 'operational', label: 'Operational' }
              ].map(({ key, label }) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography 
                    variant="body1" 
                    color="#484848" 
                    sx={{ width: "120px", fontWeight: 400 }}
                  >
                    {label}:
                  </Typography>
                  <TextField
                    value={weightageInputs[key as keyof BusinessImpact] === 0 ? '' : weightageInputs[key as keyof BusinessImpact]}
                    onChange={(e) => handleWeightageInputChange(key as keyof BusinessImpact, e.target.value)}
                    type="number"
                    variant="outlined"
                    size="small"
                    placeholder="00"
                    inputProps={{ 
                      min: 0, 
                      max: 100,
                      style: { textAlign: 'center' }
                    }}
                    sx={{
                      width: "200px",
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        height: "40px",
                        '& fieldset': {
                          borderColor: '#E4E4E4',
                        },
                        '&:hover fieldset': {
                          borderColor: '#04139A',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#04139A',
                        },
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Modal Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleCancelWeightage}
                sx={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  textTransform: 'none',
                  fontWeight: 500,
                  p: "12px 32px",
                  '&:hover': {
                    borderColor: '#B91C1C',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveWeightage}
                disabled={!isAllWeightageInputsFilled()}
                sx={{
                  backgroundColor: isAllWeightageInputsFilled() ? '#04139A' : '#9BA1D7',
                  color: isAllWeightageInputsFilled() ? '#FFFFFF' : '#F4F4F4',
                  textTransform: 'none',
                  fontWeight: 500,
                  p: "12px 40px",
                  '&:hover': {
                    backgroundColor: isAllWeightageInputsFilled() ? '#04139A' : '#9BA1D7',
                  },
                  '&:disabled': {
                    backgroundColor: '#9BA1D7',
                    color: '#F4F4F4',
                  },
                }}
              >
                {hasWeightageValues() ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Labels Modal */}
      <Modal
        open={isLabelsModalOpen}
        onClose={handleCancelLabels}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            outline: 'none',
            width: '960px',
            maxWidth: '960px',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              borderBottom: '1px solid #E4E4E4',
            }}
          >
            <Typography variant="h6" fontWeight={600} color="#484848">
              {hasLabelValues() ? 'Edit labels for Impact Scale' : 'Add labels for Impact Scale'}
            </Typography>
            <IconButton
              onClick={handleCancelLabels}
              sx={{
                color: '#04139A',
                '&:hover': {
                  backgroundColor: 'rgba(4, 19, 154, 0.1)',   
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ pt: 2 }}>
            {/* Impact Scale Inputs */}
            <Box 
              sx={{ 
                display: 'flex', 
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                border: '8px #E4E4E4',
                mb: 3
              }}
            >
              {labelsInputs.map((scale, index) => (
                <Box
                  key={scale.id}
                  sx={{
                    flex: 1,
                    backgroundColor: scale.color,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    position: 'relative',
                    paddingTop: '8px',
                    // Rounded corners for first and last segments
                    borderRadius: index === 0 ? '4px 0 0 4px' : index === labelsInputs.length - 1 ? '0 4px 4px 0' : '0',
                  }}
                >
                  {/* Input Field */}
                  <TextField
                    value={scale.label}
                    onChange={(e) => handleLabelsInputChange(scale.id, e.target.value)}
                    variant="outlined"
                    placeholder="Enter lable"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        height: '32px',
                        width: '161px',
                        '& fieldset': {
                          border: '1px solid #E4E4E4',
                        },
                        '&:hover fieldset': {
                          borderColor: '#04139A',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#04139A',
                        },
                      },
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        color: '#484848',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        '&::placeholder': {
                          color: '#91939A',
                          opacity: 1,
                        }
                      }
                    }}
                    inputProps={{
                      style: { 
                        textAlign: 'center',
                        minWidth: '140px',
                        maxWidth: '161px'
                      }
                    }}
                  />
                  {/* Number Display */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      marginTop: '8px',
                    }}
                  >
                    {scale.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Modal Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleCancelLabels}
                sx={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  textTransform: 'none',
                  fontWeight: 500,
                  p: "12px 32px",
                  '&:hover': {
                    borderColor: '#B91C1C',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveLabels}
                disabled={!isAllLabelInputsFilled()}
                sx={{
                  backgroundColor: isAllLabelInputsFilled() ? '#04139A' : '#9BA1D7',
                  color: isAllLabelInputsFilled() ? '#FFFFFF' : '#F4F4F4',
                  textTransform: 'none',
                  fontWeight: 500,
                  p: "12px 40px",
                  '&:hover': {
                    backgroundColor: isAllLabelInputsFilled() ? '#04139A' : '#9BA1D7',
                  },
                  '&:disabled': {
                    backgroundColor: '#9BA1D7',
                    color: '#F4F4F4',
                  },
                }}
              >
                {hasLabelValues() ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        toastBorder={
          toast.severity === "error" ? "1px solid #DC2626" : undefined
        }
        toastColor={toast.severity === "error" ? "#DC2626" : undefined}
        toastBackgroundColor={
          toast.severity === "error" ? "#FEF2F2" : undefined
        }
        toastSeverity={toast.severity}
      />
    </Box>
  );
};

export default Scales;