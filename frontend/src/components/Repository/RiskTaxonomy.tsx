import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Stack,
  Slider,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { CheckCircle, TrendingUp, ShowChart, Save } from '@mui/icons-material';
import { useOrganization } from "@/hooks/useOrganization";
import { useRouter } from 'next/router';

interface ImpactCategory {
  id: string;
  name: string;
  isSelected: boolean;
  isEnabled: boolean;
}

interface ImpactCategoryDetails {
  name: string;
  description: string;
  thresholds?: {
    minimum?: number;
    maximum?: number;
  };
}

const RiskTaxonomy: React.FC = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const { organization } = useOrganization(orgId);

  const [selectedCategory, setSelectedCategory] = useState<string>('financial');
  const [gradientType, setGradientType] = useState<'linear' | 'quadratic'>('linear');
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});
  const [saveStates, setSaveStates] = useState<Record<string, boolean>>({});

  // Get annual revenue from organization data (with fallback for calculations)
  const annualRevenue = organization?.details?.annualRevenue
    ? parseInt(organization.details.annualRevenue.replace(/[^0-9]/g, ''))
    : 0;

  // Set default dollar range to 25% and 75% of annual revenue (only if we have data)
  const defaultMin = annualRevenue > 0 ? Math.round(annualRevenue * 0.25) : 0;
  const defaultMax = annualRevenue > 0 ? Math.round(annualRevenue * 0.75) : 0;

  const [financialRange, setFinancialRange] = useState<number[]>([defaultMin, defaultMax]);
  
  // Separate ranges for each category
  const [regulatoryRange, setRegulatoryRange] = useState<number[]>([defaultMin, defaultMax]);
  const [reputationalRange, setReputationalRange] = useState<number[]>([defaultMin, defaultMax]);
  const [operationalRange, setOperationalRange] = useState<number[]>([defaultMin, defaultMax]);

  const [impactCategories, setImpactCategories] = useState<ImpactCategory[]>([
    {
      id: 'financial',
      name: 'Financial',
      isSelected: true,
      isEnabled: true,
    },
    {
      id: 'regulatory',
      name: 'Regulatory',
      isSelected: false,
      isEnabled: true,
    },
    {
      id: 'operational',
      name: 'Operational',
      isSelected: false,
      isEnabled: true,
    },
    {
      id: 'reputational',
      name: 'Reputational',
      isSelected: false,
      isEnabled: true,
    },
  ]);

  const [categoryDetails, setCategoryDetails] = useState<ImpactCategoryDetails>({
    name: 'Financial',
    description: 'Financial losses, or damage to operational assets',
    thresholds: {
      minimum: defaultMin,
      maximum: defaultMax,
    },
  });

  // Update state when organization data loads
  useEffect(() => {
    if (organization?.details?.annualRevenue) {
      const newAnnualRevenue = parseInt(organization.details.annualRevenue.replace(/[^0-9]/g, ''));
      const newDefaultMin = Math.round(newAnnualRevenue * 0.25);
      const newDefaultMax = Math.round(newAnnualRevenue * 0.75);

      setFinancialRange([newDefaultMin, newDefaultMax]);
      setRegulatoryRange([newDefaultMin, newDefaultMax]);
      setReputationalRange([newDefaultMin, newDefaultMax]);
      setOperationalRange([newDefaultMin, newDefaultMax]);
      setCategoryDetails(prev => ({
        ...prev,
        thresholds: {
          minimum: newDefaultMin,
          maximum: newDefaultMax,
        },
      }));
    }
  }, [organization?.details?.annualRevenue]);

  // Show loading state until organization data is loaded
  if (!organization?.details?.annualRevenue) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ color: '#484848' }}>
          Loading organization data...
        </Typography>
        <Typography variant="body2" sx={{ color: '#91939A' }}>
          Please wait while we fetch your organization details
        </Typography>
      </Box>
    );
  }

  // Helper functions to get current range based on selected category
  const getCurrentRange = () => {
    switch (selectedCategory) {
      case 'financial':
        return financialRange;
      case 'regulatory':
        return regulatoryRange;
      case 'reputational':
        return reputationalRange;
      case 'operational':
        return operationalRange;
      default:
        return financialRange;
    }
  };

  const setCurrentRange = (newRange: number[]) => {
    switch (selectedCategory) {
      case 'financial':
        setFinancialRange(newRange);
        break;
      case 'regulatory':
        setRegulatoryRange(newRange);
        break;
      case 'reputational':
        setReputationalRange(newRange);
        break;
      case 'operational':
        setOperationalRange(newRange);
        break;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // Update selection state
    setImpactCategories(prev =>
      prev.map(category => ({
        ...category,
        isSelected: category.id === categoryId,
      }))
    );

    // Update category details
    const selectedCategoryData = impactCategories.find(cat => cat.id === categoryId);
    if (selectedCategoryData) {
      setCategoryDetails({
        name: selectedCategoryData.name,
        description: selectedCategoryData.name, // Using name as description since description field is removed
        thresholds: {
          minimum: undefined,
          maximum: undefined,
        },
      });
    }
  };

  const handleSwitchToggle = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent category selection when toggling switch
    
    setImpactCategories(prev =>
      prev.map(category => ({
        ...category,
        isEnabled: category.id === categoryId ? event.target.checked : category.isEnabled,
      }))
    );
  };

  // Helper function to check if current category is enabled
  const isCurrentCategoryEnabled = () => {
    return impactCategories.find(cat => cat.id === selectedCategory)?.isEnabled || false;
  };

  const handleThresholdChange = (field: 'minimum' | 'maximum', value: string) => {
    // Allow empty string for user to clear and input new values
    if (value === '') {
      setCategoryDetails(prev => ({
        ...prev,
        thresholds: {
          ...prev.thresholds,
          [field]: undefined,
        },
      }));
      return;
    }

    const numValue = parseInt(value.replace(/[^0-9]/g, ''));

    // Only update if we have a valid number
    if (!isNaN(numValue) && numValue >= 0) {
      setCategoryDetails(prev => {
        const newThresholds = {
          ...prev.thresholds,
          [field]: numValue,
        };

        return {
          ...prev,
          thresholds: newThresholds,
        };
      });
    }
  };

  const handleDollarRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setCurrentRange([min, max]);

    setCategoryDetails(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        minimum: min,
        maximum: max,
      },
    }));
  };

  const handleDollarInputChange = (index: number, value: string) => {
    const currentRange = getCurrentRange();
    
    // Allow empty string for user to clear and input new values
    if (value === '') {
      const newRange = [...currentRange];
      newRange[index] = -1; // Use -1 to indicate empty/cleared state
      setCurrentRange(newRange);
      
      setCategoryDetails(prev => ({
        ...prev,
        thresholds: {
          ...prev.thresholds,
          minimum: index === 0 ? undefined : prev.thresholds?.minimum,
          maximum: index === 1 ? undefined : prev.thresholds?.maximum,
        },
      }));
      return;
    }

    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    
    // Only update if we have a valid number (including 0)
    if (!isNaN(numValue) && numValue >= 0) {
      const newRange = [...currentRange];
      newRange[index] = numValue;
      setCurrentRange(newRange);

      setCategoryDetails(prev => ({
        ...prev,
        thresholds: {
          ...prev.thresholds,
          minimum: index === 0 ? numValue : prev.thresholds?.minimum,
          maximum: index === 1 ? numValue : prev.thresholds?.maximum,
        },
      }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSaveImpactScale = async (categoryId: string) => {
    setSavingStates(prev => ({ ...prev, [categoryId]: true }));
    
    try {
      // Get current range for the category
      const currentRange = getCurrentRange();
      
      // Prepare the data to save
      const impactScaleData = {
        categoryId,
        range: currentRange,
        gradientType,
        thresholds: {
          minimum: currentRange[0],
          maximum: currentRange[1],
        },
        timestamp: new Date().toISOString(),
      };

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update saved state
      setSavedStates(prev => ({ ...prev, [categoryId]: true }));
      
      // Reset saving state
      setSavingStates(prev => ({ ...prev, [categoryId]: false }));
      
      console.log('Impact Scale saved for category:', categoryId, impactScaleData);
      
    } catch (error) {
      console.error('Error saving Impact Scale:', error);
      setSavingStates(prev => ({ ...prev, [categoryId]: false }));
    }
  };





  const calculateImpact = (sliderValue: number, type: 'linear' | 'quadratic') => {
    const currentRange = getCurrentRange();
    if (currentRange[0] > 0 && currentRange[1] > 0) {
      const userMin = currentRange[0];    // User's minimum
      const userMax = currentRange[1];    // User's maximum
      const range = userMax - userMin;
      const normalizedValue = sliderValue / 100;
      const impactValue = type === 'linear'
        ? userMin + (normalizedValue * range)
        : userMin + (normalizedValue * normalizedValue * range);
      return impactValue;
    }
    return 0;
  };





  // Generate graph data with proper scaling for all categories
  const generateGraphData = (type: 'linear' | 'quadratic') => {
    const currentRange = getCurrentRange();
    if (currentRange[0] <= 0 || currentRange[1] <= 0) {
      // Return empty array if no range set
      return [];
    }

    const points = [];
    const userMin = currentRange[0];
    const userMax = currentRange[1];
    const range = userMax - userMin;

    for (let i = 0; i <= 100; i += 5) {
      const normalizedValue = i / 100;
      const impactValue = type === 'linear'
        ? userMin + (normalizedValue * range)
        : userMin + (normalizedValue * normalizedValue * range);

      // Scale the value to 0-100 for display
      const scaledY = ((impactValue - userMin) / range) * 100;
      points.push({ x: i, y: scaledY });
    }
    return points;
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Left Panel - Impact Categories */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={1}
            sx={{
              border: '1px solid #9E9FA540',
              borderRadius: "4px",
              boxShadow: "#0000000A"
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, p: 2 }}>
              Impact Categories
            </Typography>

            <Stack>
              {impactCategories.map((category) => (
                <Box
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: category.isSelected ? '#EDF3FCA3' : 'white',
                    borderColor: category.isSelected ? '#04139A' : '#E4E4E4',
                    '&:hover': {
                      backgroundColor: category.isSelected ? '#EDF3FCA3' : '#F5F5F5',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: "48px"
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 400,
                      color: '#484848',
                    }}
                  >
                    {category.name}
                  </Typography>
                  <CheckCircle sx={{ color: savedStates[category.id] ? '#0CA512' : '#B3B3B3', fontSize: 16 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Panel - Category Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {categoryDetails.name}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={impactCategories.find(cat => cat.id === selectedCategory)?.isEnabled || false}
                    onChange={(e) => handleSwitchToggle(selectedCategory, e)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#04139A',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#04139A',
                        },
                      },
                    }}
                  />
                }
                label={impactCategories.find(cat => cat.id === selectedCategory)?.isEnabled ? "ON" : "OFF"}
                sx={{ 
                  margin: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px',
                    fontWeight: 500,
                    color: impactCategories.find(cat => cat.id === selectedCategory)?.isEnabled ? '#04139A' : '#91939A',
                    marginLeft: 1
                  }
                }}
              />
            </Box>

            {/* Right Panel - Gradient Linear & Quadratic */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                border: '1px solid #1363DF',
                borderRadius: 2,
                boxShadow: "#0000000A",
                mb: 3,
                opacity: isCurrentCategoryEnabled() ? 1 : 0.5,
                pointerEvents: isCurrentCategoryEnabled() ? 'auto' : 'none',
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#91939A',
                    minWidth: '200px'
                  }}
                >
                  Define {categoryDetails.name} threshold:
                </Typography>
              </Box>
              {/* Only show Impact value when both min and max are set */}
              {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontWeight: 500,
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#484848'
                  }}
                >
                  Impact {selectedCategory === 'financial' ? 'dollar' : ''} value: <span style={{
                    fontWeight: 400,
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#91939A'
                  }}>
                    {formatCurrency(getCurrentRange()[0])} - {formatCurrency(getCurrentRange()[1])}
                    {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                      <span style={{ marginLeft: '8px', color: '#04139A', fontWeight: 600 }}>
                        (Mid: {formatCurrency(calculateImpact(50, gradientType))})
                      </span>
                    )}
                  </span>
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, mb: 2 }}>
                {/* Left input field - Minimum */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label="Minimum"
                    value={getCurrentRange()[0] > 0 ? formatCurrency(getCurrentRange()[0]) : ''}
                    onChange={(e) => handleDollarInputChange(0, e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Enter minimum value"
                    sx={{
                      width: '120px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderColor: '#E4E4E4',
                        color: getCurrentRange()[0] > 0 ? '#000000' : '#000000',
                      },
                      '& .MuiInputBase-input': {
                        color: '#000000',
                      }
                    }}
                  />
                </Box>

                {/* Range slider */}
                <Box sx={{ flex: 1, px: 2 }}>
                  <Slider
                    value={getCurrentRange()}
                    onChange={handleDollarRangeChange}
                    valueLabelDisplay="off"
                    min={0}                    // Minimum is 0
                    max={annualRevenue}        // Maximum is annual revenue from organization
                    step={1}
                    sx={{
                      color: '#04139A',
                      '& .MuiSlider-track': {
                        backgroundColor: '#04139A',
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        backgroundColor: 'white',
                        border: '2px solid #04139A',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          boxShadow: '0px 0px 0px 8px rgba(4, 19, 154, 0.16)',
                        },
                        '&.Mui-focusVisible': {
                          boxShadow: '0px 0px 0px 8px rgba(4, 19, 154, 0.16)',
                        },
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#E4E4E4',
                        opacity: 1,
                      },
                    }}
                  />
                </Box>

                {/* Right input field - Maximum */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label="Maximum"
                    value={getCurrentRange()[1] > 0 ? formatCurrency(getCurrentRange()[1]) : ''}
                    onChange={(e) => handleDollarInputChange(1, e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Enter maximum value"
                    sx={{
                      width: '120px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderColor: '#E4E4E4',
                        color: getCurrentRange()[1] > 0 ? '#000000' : '#000000',
                      },
                      '& .MuiInputBase-input': {
                        color: '#000000',
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Gradient Configuration Row */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {/* Left side - Gradient Configuration */}
                <Box sx={{ flex: 0.4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      letterSpacing: '0%',
                      color: '#484848'
                    }}
                  >
                    Gradient Configuration
                  </Typography>

                  {/* Gradient Type Selection */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        fontWeight: 500,
                        color: '#484848'
                      }}
                    >
                      Select Gradient Type:
                    </Typography>
                    <ButtonGroup variant="outlined" size="small">
                      <Button
                        variant={gradientType === 'linear' ? 'contained' : 'outlined'}
                        onClick={() => setGradientType('linear')}
                        startIcon={<TrendingUp />}
                        sx={{
                          backgroundColor: gradientType === 'linear' ? '#04139A' : 'white',
                          color: gradientType === 'linear' ? 'white' : '#04139A',
                          borderColor: '#04139A',
                          '&:hover': {
                            backgroundColor: gradientType === 'linear' ? '#04139A' : '#EDF3FCA3',
                            borderColor: '#04139A',
                          }
                        }}
                      >
                        Linear
                      </Button>
                      <Button
                        variant={gradientType === 'quadratic' ? 'contained' : 'outlined'}
                        onClick={() => setGradientType('quadratic')}
                        startIcon={<ShowChart />}
                        sx={{
                          backgroundColor: gradientType === 'quadratic' ? '#04139A' : 'white',
                          color: gradientType === 'quadratic' ? 'white' : '#04139A',
                          borderColor: '#04139A',
                          '&:hover': {
                            backgroundColor: gradientType === 'quadratic' ? '#04139A' : '#EDF3FCA3',
                            borderColor: '#04139A',
                          }
                        }}
                      >
                        Quadratic
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>

                {/* Right side - Graph Visualization */}
                <Box sx={{ flex: 0.6 }}>
                  <Card sx={{ backgroundColor: '#FAFAFA' }}>
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          fontWeight: 500,
                          color: '#484848'
                        }}
                      >
                        {gradientType === 'linear' ? 'Linear' : 'Quadratic'} Function Graph
                      </Typography>

                  {/* Simple SVG Graph */}
                  <Box sx={{ position: 'relative', height: 180, width: '100%' }}>
                    <svg width="100%" height="180" style={{ border: '1px solid #E4E4E4', borderRadius: '4px' }}>
                      {/* Main border lines */}
                      <line
                        x1="40"
                        y1="30"
                        x2="360"
                        y2="30"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="40"
                        y1="30"
                        x2="40"
                        y2="130"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="40"
                        y1="130"
                        x2="360"
                        y2="130"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="360"
                        y1="30"
                        x2="360"
                        y2="130"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />

                      {/* 3 vertical grid lines inside the box */}
                      {Array.from({ length: 3 }, (_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={40 + (i + 1) * 80}
                          y1="30"
                          x2={40 + (i + 1) * 80}
                          y2="130"
                          stroke="#F0F0F0"
                          strokeWidth="1"
                        />
                      ))}

                      {/* 2 vertical lines at Very Low and Critical nodes */}
                      <line
                        x1="40"
                        y1="30"
                        x2="40"
                        y2="130"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="360"
                        y1="30"
                        x2="360"
                        y2="130"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />

                      {/* Graph line - properly aligned with Very Low and Critical nodes */}
                      <polyline
                        points={generateGraphData(gradientType).map((point, index) => {
                          const x = 40 + (point.x / 100) * (360 - 40); // Start at 40, end at 360
                          const y = 130 - (point.y / 100) * 100;
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#04139A"
                        strokeWidth="3"
                      />

                      {/* Current slider position indicator */}
                      <circle
                        cx={getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0
                          ? 40 + (50 / 100) * (360 - 40)
                          : 40}
                        cy={130 - (getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0
                          ? ((calculateImpact(50, gradientType) - getCurrentRange()[0]) / (getCurrentRange()[1] - getCurrentRange()[0])) * 100
                          : 0)}
                        r="6"
                        fill="#FF6B6B"
                        stroke="white"
                        strokeWidth="2"
                      />

                      {/* Impact value display */}
                      {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                        <text
                          x={getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0
                            ? 40 + (50 / 100) * (360 - 40)
                            : 40}
                          y={130 - (getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0
                            ? ((calculateImpact(50, gradientType) - getCurrentRange()[0]) / (getCurrentRange()[1] - getCurrentRange()[0])) * 100
                            : 0) - 15}
                          fontSize="12"
                          fill="#04139A"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {formatCurrency(calculateImpact(50, gradientType))}
                        </text>
                      )}


                      {/* Y-axis labels (Min and Max only) - properly aligned */}
                      <text x="15" y="135" fontSize="12" fill="#91939A" textAnchor="middle">Min</text>
                      <text x="15" y="35" fontSize="12" fill="#91939A" textAnchor="middle">Max</text>

                      {/* X-axis labels (Very Low and Critical only) */}
                      <text x="40" y="150" fontSize="12" fill="#91939A" textAnchor="start">Very Low</text>
                      <text x="360" y="150" fontSize="12" fill="#91939A" textAnchor="end">Critical</text>
                    </svg>
                  </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

            </Paper>


            {/* Right Panel - Impact Scale */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                border: '1px solid #1363DF',
                borderRadius: 2,
                boxShadow: "#0000000A",
                mb: 2,
                opacity: isCurrentCategoryEnabled() ? 1 : 0.5,
                pointerEvents: isCurrentCategoryEnabled() ? 'auto' : 'none',
                transition: 'opacity 0.3s ease',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  letterSpacing: '0%',
                  color: '#484848'
                }}
              >
                Impact Scale
              </Typography>

              {/* Segmented Impact Scale Bar */}
              <Box sx={{
                display: 'flex',
                width: '100%',
                height: getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 ? '80px' : '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #E4E4E4'
              }}>
                {/* Very Low - Green */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#3BB966',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:first-of-type': {
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                  }
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    Very Low
                  </Typography>
                  {getCurrentRange()[0] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(getCurrentRange()[0])}
                    </Typography>
                  )}
                </Box>

                {/* Low - Blue-purple */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#3366CC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    Low
                  </Typography>
                  {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(calculateImpact(25, gradientType))}
                    </Typography>
                  )}
                </Box>

                {/* Medium - Gold/Yellow */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#E3B52A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    Medium
                  </Typography>
                  {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(calculateImpact(50, gradientType))}
                    </Typography>
                  )}
                </Box>

                {/* High - Orange */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#DA7706',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    High
                  </Typography>
                  {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(calculateImpact(75, gradientType))}
                    </Typography>
                  )}
                </Box>

                {/* Critical - Red */}
                <Box sx={{
                  flex: 1,
                  backgroundColor: '#B90D0D',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  '&:last-of-type': {
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    Critical
                  </Typography>
                  {getCurrentRange()[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(getCurrentRange()[1])}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Save Button for Impact Scale */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveImpactScale(selectedCategory)}
                disabled={savingStates[selectedCategory] || !isCurrentCategoryEnabled()}
                sx={{
                  backgroundColor: '#04139A',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#04139A',
                    opacity: 0.9,
                  },
                  '&:disabled': {
                    backgroundColor: '#E4E4E4',
                    color: '#91939A',
                  },
                }}
              >
                {savingStates[selectedCategory] ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskTaxonomy;
