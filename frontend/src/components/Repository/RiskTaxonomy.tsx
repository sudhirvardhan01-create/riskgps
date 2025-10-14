import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Stack,
  Divider,
  Slider,
  Button,
  ButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import { CheckCircle, TrendingUp, ShowChart } from '@mui/icons-material';
import { useOrganization } from "@/hooks/useOrganization";
import { useRouter } from 'next/router';

interface ImpactCategory {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
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
  const [dollarRange, setDollarRange] = useState<number[]>([0, 0]);
  const [gradientType, setGradientType] = useState<'linear' | 'quadratic'>('linear');

  // Get annual revenue from organization data
  const annualRevenue = organization?.details?.annualRevenue
    ? parseInt(organization.details.annualRevenue.replace(/[^0-9]/g, ''))
    : 1000000; // Default fallback

  // Fixed impact levels with default values (absolute min/max)
  const [impactLevels, setImpactLevels] = useState({
    veryLow: 0,       // Absolute minimum (Very Low)
    low: 0,           // Low threshold (will be set by user)
    medium: 0,        // Medium threshold (calculated as midpoint)
    high: 0,          // High threshold (will be set by user)
    critical: annualRevenue // Absolute maximum (Critical) - from organization data
  });

  // User-defined thresholds for calculations (points within the full range)
  const [userThresholds, setUserThresholds] = useState({
    low: 0,           // User's low threshold (will be set by user)
    high: 0           // User's high threshold (will be set by user)
  });
  const [impactCategories, setImpactCategories] = useState<ImpactCategory[]>([
    {
      id: 'financial',
      name: 'Financial',
      description: 'Financial losses, or damage to operational assets',
      isSelected: true,
    },
    {
      id: 'regulatory',
      name: 'Regulatory',
      description: 'Regulatory compliance issues',
      isSelected: false,
    },
    {
      id: 'reputational',
      name: 'Reputational',
      description: 'Reputational damage',
      isSelected: false,
    },
    {
      id: 'operational',
      name: 'Operational',
      description: 'Operational disruptions',
      isSelected: false,
    },
  ]);

  const [categoryDetails, setCategoryDetails] = useState<ImpactCategoryDetails>({
    name: 'Financial',
    description: 'Financial losses, or damage to operational assets',
    thresholds: {
      minimum: undefined,
      maximum: undefined,
    },
  });

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
        description: selectedCategoryData.description,
        thresholds: categoryId === 'financial' ? {
          minimum: undefined,
          maximum: undefined,
        } : undefined,
      });
    }
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

        // Update user-defined thresholds (these are points within the full range)
        if (field === 'minimum') {
          setUserThresholds(prev => ({
            ...prev,
            low: numValue,
          }));
        } else if (field === 'maximum') {
          setUserThresholds(prev => ({
            ...prev,
            high: numValue,
          }));
        }

        return {
          ...prev,
          thresholds: newThresholds,
        };
      });
    }
  };

  const handleDollarRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setDollarRange([min, max]);

    // Update user-defined thresholds when slider changes (these are points within the full range)
    if (selectedCategory === 'financial') {
      setUserThresholds({
        low: min,
        high: max
      });

      setCategoryDetails(prev => ({
        ...prev,
        thresholds: {
          ...prev.thresholds,
          minimum: min,
          maximum: max,
        },
      }));
    }
  };

  const handleDollarInputChange = (index: number, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const newRange = [...dollarRange];
    newRange[index] = numValue;
    setDollarRange(newRange);

    // Update user-defined thresholds when dollar input changes (these are points within the full range)
    if (selectedCategory === 'financial') {
      const [min, max] = newRange;
      setUserThresholds({
        low: min,
        high: max
      });

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


  // Update medium value when low or high changes
  const updateMediumValue = (lowValue: number, highValue: number) => {
    const mediumValue = lowValue + (highValue - lowValue) / 2;
    setImpactLevels(prev => ({
      ...prev,
      medium: mediumValue
    }));
  };

  const calculateGraphValue = (sliderValue: number, type: 'linear' | 'quadratic') => {
    const normalizedValue = sliderValue / 100; // Convert to 0-1 range
    if (type === 'linear') {
      return normalizedValue;
    } else {
      return normalizedValue * normalizedValue; // Quadratic function
    }
  };

  const calculateFinancialImpact = (sliderValue: number, type: 'linear' | 'quadratic') => {
    if (selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0) {
      const userMin = dollarRange[0];    // User's minimum
      const userMax = dollarRange[1];    // User's maximum
      const range = userMax - userMin;
      const normalizedValue = sliderValue / 100;
      const impactValue = type === 'linear'
        ? userMin + (normalizedValue * range)
        : userMin + (normalizedValue * normalizedValue * range);
      return impactValue;
    }
    return 0;
  };

  // Calculate which impact level the slider value corresponds to
  const getImpactLevel = (value: number) => {
    const userMin = dollarRange[0];    // User's minimum (Very Low)
    const userMax = dollarRange[1];    // User's maximum (Critical)
    const range = userMax - userMin;

    // Calculate the 5 levels based on user input
    const veryLow = userMin;
    const low = userMin + range * 0.25;
    const medium = userMin + range * 0.5;
    const high = userMin + range * 0.75;
    const critical = userMax;

    if (value <= veryLow) return { level: 'Very Low', color: '#3BB966', value: veryLow };
    if (value <= low) return { level: 'Low', color: '#3366CC', value: low };
    if (value <= medium) return { level: 'Medium', color: '#E3B52A', value: medium };
    if (value <= high) return { level: 'High', color: '#DA7706', value: high };
    return { level: 'Critical', color: '#B90D0D', value: critical };
  };

  // Calculate the current impact value based on slider position
  const getCurrentImpactValue = (sliderValue: number) => {
    const userMin = dollarRange[0];    // User's minimum
    const userMax = dollarRange[1];    // User's maximum
    const range = userMax - userMin;
    const normalizedValue = sliderValue / 100;
    return userMin + (normalizedValue * range);
  };


  const generateGraphData = (type: 'linear' | 'quadratic') => {
    const points = [];
    for (let i = 0; i <= 100; i += 5) {
      const normalizedValue = i / 100;
      const y = type === 'linear' ? normalizedValue : normalizedValue * normalizedValue;
      points.push({ x: i, y: y * 100 }); // Scale y to 0-100 for display
    }
    return points;
  };

  // Generate graph data with proper financial scaling
  const generateFinancialGraphData = (type: 'linear' | 'quadratic') => {
    if (selectedCategory !== 'financial' || dollarRange[0] === 0 || dollarRange[1] === 0) {
      return generateGraphData(type);
    }

    const points = [];
    const userMin = dollarRange[0];
    const userMax = dollarRange[1];
    const range = userMax - userMin;

    for (let i = 0; i <= 100; i += 5) {
      const normalizedValue = i / 100;
      const impactValue = type === 'linear'
        ? userMin + (normalizedValue * range)
        : userMin + (normalizedValue * normalizedValue * range);

      // Scale the financial value to 0-100 for display
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
                  <CheckCircle sx={{ color: '#B3B3B3', fontSize: 16 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Panel - Category Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {categoryDetails.name}
            </Typography>

            {/* Right Panel - Gradient Linear & Quadratic */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                border: '1px solid #1363DF',
                borderRadius: 2,
                boxShadow: "#0000000A",
                mb: 3
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
                  Define Financial threshold:
                </Typography>
              </Box>
              {/* Only show Impact dollar value when both min and max are set */}
              {selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 && (
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
                  Impact dollar value: <span style={{
                    fontWeight: 400,
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#91939A'
                  }}>
                    {formatCurrency(dollarRange[0])} - {formatCurrency(dollarRange[1])}
                    {dollarRange[0] > 0 && dollarRange[1] > 0 && (
                      <span style={{ marginLeft: '8px', color: '#04139A', fontWeight: 600 }}>
                        (Mid: {formatCurrency(dollarRange[0] + (dollarRange[1] - dollarRange[0]) / 2)})
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
                    value={dollarRange[0] > 0 ? formatCurrency(dollarRange[0]) : ''}
                    onChange={(e) => handleDollarInputChange(0, e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Enter minimum value"
                    sx={{
                      width: '120px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderColor: '#E4E4E4',
                        color: dollarRange[0] > 0 ? '#000000' : '#000000',
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
                    value={dollarRange}
                    onChange={handleDollarRangeChange}
                    valueLabelDisplay="off"
                    min={0}                    // Minimum is 0
                    max={annualRevenue}        // Maximum is annual revenue from organization
                    step={1000}
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
                    value={dollarRange[1] > 0 ? formatCurrency(dollarRange[1]) : ''}
                    onChange={(e) => handleDollarInputChange(1, e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Enter maximum value"
                    sx={{
                      width: '120px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderColor: '#E4E4E4',
                        color: dollarRange[1] > 0 ? '#000000' : '#000000',
                      },
                      '& .MuiInputBase-input': {
                        color: '#000000',
                      }
                    }}
                  />
                </Box>
              </Box>


              {/* Current Impact Level Display */}
              {selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 && (
                <Box sx={{
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#6C757D', fontWeight: 500 }}>
                    Current Impact Level:
                  </Typography>
                  <Box sx={{
                    backgroundColor: getImpactLevel(getCurrentImpactValue(50)).color,
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {getImpactLevel(getCurrentImpactValue(50)).level}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6C757D' }}>
                    ({formatCurrency(getCurrentImpactValue(50))})
                  </Typography>
                </Box>
              )}

              {selectedCategory === 'financial' && (dollarRange[0] === 0 || dollarRange[1] === 0) && (
                <Box sx={{
                  backgroundColor: '#F8F9FA',
                  border: '1px solid #E4E4E4',
                  borderRadius: '4px',
                  p: 2,
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#6C757D', textAlign: 'center' }}>
                    Set minimum and maximum thresholds from input field or slider
                  </Typography>
                </Box>
              )}
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  letterSpacing: '0%',
                  color: '#484848'
                }}
              >
                Gradient Configuration
                {selectedCategory === 'financial' && (dollarRange[0] === 0 || dollarRange[1] === 0) && (
                  <Typography variant="body2" sx={{ color: '#91939A', fontWeight: 400, mt: 1 }}>
                    Set financial thresholds to see gradient calculations
                  </Typography>
                )}
              </Typography>

              {/* Gradient Type Selection */}
              <Box sx={{ mb: 3 }}>
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

              {/* Graph Visualization */}
              <Card sx={{ mb: 3, backgroundColor: '#FAFAFA' }}>
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontWeight: 500,
                      color: '#484848'
                    }}
                  >
                    {gradientType === 'linear' ? 'Linear' : 'Quadratic'} Function Graph
                  </Typography>

                  {/* Simple SVG Graph */}
                  <Box sx={{ position: 'relative', height: 220, width: '100%' }}>
                    <svg width="100%" height="220" style={{ border: '1px solid #E4E4E4', borderRadius: '4px' }}>
                      {/* Main border lines */}
                      <line
                        x1="40"
                        y1="40"
                        x2="360"
                        y2="40"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="40"
                        y1="40"
                        x2="40"
                        y2="160"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="40"
                        y1="160"
                        x2="360"
                        y2="160"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="360"
                        y1="40"
                        x2="360"
                        y2="160"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />

                      {/* 3 vertical grid lines inside the box */}
                      {Array.from({ length: 3 }, (_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={40 + (i + 1) * 80}
                          y1="40"
                          x2={40 + (i + 1) * 80}
                          y2="160"
                          stroke="#F0F0F0"
                          strokeWidth="1"
                        />
                      ))}

                      {/* 2 vertical lines at Very Low and Critical nodes */}
                      <line
                        x1="40"
                        y1="40"
                        x2="40"
                        y2="160"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />
                      <line
                        x1="360"
                        y1="40"
                        x2="360"
                        y2="160"
                        stroke="#E4E4E4"
                        strokeWidth="1"
                      />

                      {/* Graph line - properly aligned with Very Low and Critical nodes */}
                      <polyline
                        points={generateFinancialGraphData(gradientType).map((point, index) => {
                          const x = 40 + (point.x / 100) * (360 - 40); // Start at 40, end at 360
                          const y = 160 - (point.y / 100) * 120;
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#04139A"
                        strokeWidth="3"
                      />

                      {/* Current slider position indicator */}
                      <circle
                        cx={selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0
                          ? 40 + (50 / 100) * (360 - 40)
                          : 40}
                        cy={160 - (selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0
                          ? ((calculateFinancialImpact(50, gradientType) - dollarRange[0]) / (dollarRange[1] - dollarRange[0])) * 120
                          : 0)}
                        r="6"
                        fill="#FF6B6B"
                        stroke="white"
                        strokeWidth="2"
                      />

                      {/* Financial impact value display */}
                      {selectedCategory === 'financial' && categoryDetails.thresholds && (
                        <text
                          x={selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0
                            ? 40 + (50 / 100) * (360 - 40)
                            : 40}
                          y={160 - (selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0
                            ? ((calculateFinancialImpact(50, gradientType) - dollarRange[0]) / (dollarRange[1] - dollarRange[0])) * 120
                            : 0) - 15}
                          fontSize="12"
                          fill="#04139A"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {formatCurrency(calculateFinancialImpact(50, gradientType))}
                        </text>
                      )}


                      {/* Y-axis labels (Min and Max only) - properly aligned */}
                      <text x="15" y="165" fontSize="12" fill="#91939A" textAnchor="middle">Min</text>
                      <text x="15" y="45" fontSize="12" fill="#91939A" textAnchor="middle">Max</text>

                      {/* X-axis labels (Very Low and Critical only) */}
                      <text x="40" y="180" fontSize="12" fill="#91939A" textAnchor="start">Very Low</text>
                      <text x="360" y="180" fontSize="12" fill="#91939A" textAnchor="end">Critical</text>
                    </svg>
                  </Box>
                </CardContent>
              </Card>

            </Paper>


            {/* Right Panel - Impact Scale */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                border: '1px solid #1363DF',
                borderRadius: 2,
                boxShadow: "#0000000A",
                mb: 3
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  letterSpacing: '0%',
                  color: '#484848'
                }}
              >
                Impact Scale
                {selectedCategory === 'financial' && (dollarRange[0] === 0 || dollarRange[1] === 0) && (
                  <Typography variant="body2" sx={{ color: '#91939A', fontWeight: 400, mt: 1 }}>
                    Set financial thresholds above to see dollar values
                  </Typography>
                )}
              </Typography>

              {/* Segmented Impact Scale Bar */}
              <Box sx={{
                display: 'flex',
                width: '100%',
                height: selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 ? '80px' : '60px',
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
                  {/* <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '16px', mt: 0.5 }}>
                    1
                  </Typography> */}
                  {selectedCategory === 'financial' && dollarRange[0] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(dollarRange[0])}
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
                  {/* <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '16px', mt: 0.5 }}>
                    2
                  </Typography> */}
                  {selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(dollarRange[0] + (dollarRange[1] - dollarRange[0]) * 0.25)}
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
                  {/* <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '16px', mt: 0.5 }}>
                    3
                  </Typography> */}
                  {selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(dollarRange[0] + (dollarRange[1] - dollarRange[0]) * 0.5)}
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
                  {/* <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '16px', mt: 0.5 }}>
                    4
                  </Typography> */}
                  {selectedCategory === 'financial' && dollarRange[0] > 0 && dollarRange[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(dollarRange[0] + (dollarRange[1] - dollarRange[0]) * 0.75)}
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
                  {/* <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '16px', mt: 0.5 }}>
                    5
                  </Typography> */}
                  {selectedCategory === 'financial' && dollarRange[1] > 0 && (
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', mt: 0.5 }}>
                      {formatCurrency(dollarRange[1])}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskTaxonomy;
