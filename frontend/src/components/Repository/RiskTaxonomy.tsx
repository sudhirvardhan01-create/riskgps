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
import { getTaxonomies, saveTaxonomies, Taxonomy } from '@/services/organizationService';
import Cookies from 'js-cookie';

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
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState<boolean>(false);
  const [maxRangeFromAPI, setMaxRangeFromAPI] = useState<number>(0);
  const [focusedInput, setFocusedInput] = useState<'min' | 'max' | null>(null);

  // Helper function to map taxonomy name to category ID
  const mapTaxonomyNameToCategoryId = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('financial')) return 'financial';
    if (nameLower.includes('regulatory')) return 'regulatory';
    if (nameLower.includes('operational')) return 'operational';
    if (nameLower.includes('reputational')) return 'reputational';
    return 'financial'; // Default fallback
  };

  // Helper function to parse range values from API (handles "50k", "100k", ">1000k" formats)
  const parseRangeValue = (value: string): number => {
    if (!value || value.trim() === '') return 0;

    // Remove ">" prefix if present
    const cleanedValue = value.replace(/^>/, '').trim();

    // Extract number and multiplier (k, m, etc.)
    const match = cleanedValue.match(/^([\d.]+)([km]?)$/i);
    if (!match) return 0;

    const numValue = parseFloat(match[1]);
    const multiplier = match[2].toLowerCase();

    if (multiplier === 'k') {
      return Math.round(numValue * 1000);
    } else if (multiplier === 'm') {
      return Math.round(numValue * 1000000);
    }

    return Math.round(numValue);
  };

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
      id: 'operational',
      name: 'Operational',
      isSelected: false,
      isEnabled: true,
    },
    {
      id: 'regulatory',
      name: 'Regulatory',
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

  // Fetch taxonomies from API when orgId is available
  useEffect(() => {
    const fetchTaxonomies = async () => {
      if (orgId && typeof orgId === 'string') {
        setLoadingTaxonomies(true);
        try {
          const response = await getTaxonomies(orgId);
          if (response.data && response.data.length > 0) {
            setTaxonomies(response.data);

            // Update impact categories from API data
            setImpactCategories(prevCategories => {
              return prevCategories.map(category => {
                const taxonomy = response.data.find(t =>
                  mapTaxonomyNameToCategoryId(t.name) === category.id
                );
                return taxonomy ? {
                  ...category,
                  name: taxonomy.name.replace(' Risk', ''), // Remove " Risk" suffix
                } : category;
              });
            });

            // Update ranges from API data based on severity levels
            let globalMaxRange = 0;
            response.data.forEach(taxonomy => {
              const categoryId = mapTaxonomyNameToCategoryId(taxonomy.name);
              if (taxonomy.severityLevels && taxonomy.severityLevels.length > 0) {
                // Get the first severity level's minRange and last severity level's maxRange
                const sortedSeverity = [...taxonomy.severityLevels].sort((a, b) => a.order - b.order);
                const minRange = parseRangeValue(sortedSeverity[0].minRange);
                // For maxRange, handle ">1000k" format - use the value after ">"
                const lastSeverity = sortedSeverity[sortedSeverity.length - 1];
                const maxRange = parseRangeValue(lastSeverity.maxRange);

                // Track the maximum range value across all taxonomies
                if (maxRange > globalMaxRange) {
                  globalMaxRange = maxRange;
                }

                // Only update if we have valid ranges
                if (minRange > 0 && maxRange > 0) {
                  switch (categoryId) {
                    case 'financial':
                      setFinancialRange([minRange, maxRange]);
                      break;
                    case 'regulatory':
                      setRegulatoryRange([minRange, maxRange]);
                      break;
                    case 'operational':
                      setOperationalRange([minRange, maxRange]);
                      break;
                    case 'reputational':
                      setReputationalRange([minRange, maxRange]);
                      break;
                  }
                } else {
                  console.warn(`Invalid ranges for ${taxonomy.name}: min=${minRange}, max=${maxRange}`);
                }
              }
            });

            // Set the maximum range from API for slider configuration
            if (globalMaxRange > 0) {
              setMaxRangeFromAPI(globalMaxRange);
            }
          }
        } catch (error) {
          console.error('Error fetching taxonomies:', error);
        } finally {
          setLoadingTaxonomies(false);
        }
      }
    };

    fetchTaxonomies();
  }, [orgId]);

  // Update state when organization data loads
  useEffect(() => {
    if (organization?.details?.annualRevenue && taxonomies.length === 0) {
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
  }, [organization?.details?.annualRevenue, taxonomies.length]);

  // Show loading state until organization data is loaded or taxonomies are loading
  if (!organization?.details?.annualRevenue || loadingTaxonomies) {
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
          {loadingTaxonomies ? 'Loading taxonomies...' : 'Loading organization data...'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#91939A' }}>
          Please wait while we fetch your data
        </Typography>
      </Box>
    );
  }

  // Helper function to calculate slider max value
  const getSliderMax = () => {
    // Use the maximum of annualRevenue and maxRangeFromAPI
    // Add 20% buffer to allow users to adjust beyond the API range
    const baseMax = Math.max(annualRevenue, maxRangeFromAPI);
    const sliderMax = baseMax > 0 ? Math.round(baseMax * 1.2) : 1000000; // Default to 1M if no data
    return sliderMax;
  };

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

  // Helper function to get severity levels for current category
  const getCurrentCategorySeverityLevels = () => {
    const taxonomy = taxonomies.find(t =>
      mapTaxonomyNameToCategoryId(t.name) === selectedCategory
    );
    if (taxonomy && taxonomy.severityLevels) {
      return [...taxonomy.severityLevels].sort((a, b) => a.order - b.order);
    }
    return [];
  };

  // Helper function to calculate Impact Scale range for a severity level
  const calculateSeverityRange = (severityIndex: number, totalSeverities: number) => {
    const currentRange = getCurrentRange();
    if (currentRange[0] <= 0 || currentRange[1] <= 0 || totalSeverities === 0) {
      return { min: 0, max: 0 };
    }

    // Distribute severity levels across 0-100% of the range
    // For n levels, divide into (n-1) equal segments
    // Example for 5 levels: 0-25%, 25-50%, 50-75%, 75-100%, >100%
    const step = 100 / (totalSeverities - 1); // For 5 levels: step = 25

    // Calculate percentage range for this severity level
    let minSliderValue, maxSliderValue;

    if (severityIndex === 0) {
      // First level (Very Low): starts at 0% to first step
      minSliderValue = 0;
      maxSliderValue = step; // e.g., 0 to 25
    } else if (severityIndex === totalSeverities - 1) {
      // Last level (Critical): starts from previous step to 100%
      minSliderValue = (severityIndex - 1) * step; // e.g., 75
      maxSliderValue = 100; // Extends to 100%
    } else {
      // Middle levels: each level starts where the previous ended
      // e.g., index 1: 25% to 50%, index 2: 50% to 75%
      minSliderValue = severityIndex * step; // e.g., 25, 50, 75 (where previous ended)
      maxSliderValue = (severityIndex + 1) * step; // e.g., 50, 75, 100 (next step)
    }

    // Apply gradient type to calculate actual dollar values
    // For first level, min is always the actual min range
    const minValue = severityIndex === 0 ? currentRange[0] : calculateImpact(minSliderValue, gradientType);

    // For Critical (last level), maxValue should be the actual max range
    // For other levels, calculate based on gradient type
    let maxValue;
    if (severityIndex === totalSeverities - 1) {
      // Critical level: use the actual max range value
      maxValue = currentRange[1];
    } else {
      // Other levels: calculate based on gradient type
      maxValue = calculateImpact(maxSliderValue, gradientType);
    }

    return { min: minValue, max: maxValue };
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
      newRange[index] = 0;
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

    // Remove all non-digit characters to get raw number
    const cleanedValue = value.replace(/[^0-9]/g, '');
    
    // If cleaned value is empty, set to 0
    if (cleanedValue === '') {
      const newRange = [...currentRange];
      newRange[index] = 0;
      setCurrentRange(newRange);
      return;
    }

    const numValue = parseInt(cleanedValue, 10);

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

  // Format currency with K (thousand), M (million), and B (billion) abbreviations
  // K = 1,000 (for values 1,000 to 999,999)
  // M = 1,000,000 (for values 1,000,000 to 999,999,999)
  // B = 1,000,000,000 (for values >= 1,000,000,000)
  // Examples: 5,000 = $5K, 10,000 = $10K, 500,000 = $500K, 1,000,000 = $1M, 5,000,000 = $5M, 1,000,000,000 = $1B
  const formatCurrencyCompact = (value: number): string => {
    if (value >= 1000000000) {
      // For values >= 1,000,000,000, use B (Billions) where 1B = 1,000,000,000
      const billions = value / 1000000000;
      // Round to 1 decimal place if needed, otherwise show as whole number
      const formattedBillions = billions % 1 === 0 ? Math.round(billions).toString() : billions.toFixed(1);
      return `$${formattedBillions}B`;
    } else if (value >= 1000000) {
      // For values >= 1,000,000 and < 1,000,000,000, use M (Millions) where 1M = 1,000,000
      const millions = value / 1000000;
      // Round to 1 decimal place if needed, otherwise show as whole number
      const formattedMillions = millions % 1 === 0 ? Math.round(millions).toString() : millions.toFixed(1);
      return `$${formattedMillions}M`;
    } else if (value >= 1000) {
      // For values >= 1,000 and < 1,000,000, use K (Thousands) where 1K = 1,000
      const thousands = value / 1000;
      // Round to 1 decimal place if needed, otherwise show as whole number
      const formattedThousands = thousands % 1 === 0 ? Math.round(thousands).toString() : thousands.toFixed(1);
      return `$${formattedThousands}K`;
    }
    // For values < 1,000, show as is
    return `$${Math.round(value)}`;
  };

  const handleSaveImpactScale = async (categoryId: string) => {
    if (!orgId || typeof orgId !== 'string') {
      console.error('Organization ID is required');
      return;
    }

    setSavingStates(prev => ({ ...prev, [categoryId]: true }));

    try {
      // Get current user ID from cookies
      const user = JSON.parse(Cookies.get("user") ?? "{}");
      const userId = user.id;

      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      // Get current range for the category
      const currentRange = getCurrentRange();

      if (currentRange[0] <= 0 || currentRange[1] <= 0) {
        throw new Error("Please set valid minimum and maximum values");
      }

      // Find the existing taxonomy for this category
      const existingTaxonomy = taxonomies.find(t =>
        mapTaxonomyNameToCategoryId(t.name) === categoryId
      );

      // Get severity levels for current category
      const severityLevels = getCurrentCategorySeverityLevels();

      if (severityLevels.length === 0) {
        throw new Error("No severity levels found for this category");
      }

      // Calculate ranges for each severity level
      const totalSeverities = severityLevels.length;
      const updatedSeverityLevels = severityLevels.map((severity, index) => {
        const severityRange = calculateSeverityRange(index, totalSeverities);
        const isLast = index === totalSeverities - 1;

        // Convert raw numeric values to strings (no formatting)
        let minRangeStr: string;
        let maxRangeStr: string;

        if (index === 0) {
          // First level: minRange is the actual min value (raw number as string)
          minRangeStr = Math.round(severityRange.min).toString();
        } else {
          // Other levels: minRange is the previous level's max (raw number as string)
          const prevRange = calculateSeverityRange(index - 1, totalSeverities);
          minRangeStr = Math.round(prevRange.max).toString();
        }

        if (isLast) {
          // Last level: maxRange is the actual max value (raw number as string)
          maxRangeStr = Math.round(severityRange.max).toString();
        } else {
          // Other levels: maxRange is the calculated max (raw number as string)
          maxRangeStr = Math.round(severityRange.max).toString();
        }

        return {
          severityId: severity.severityId, // Include for update
          name: severity.name,
          minRange: minRangeStr,
          maxRange: maxRangeStr,
          color: severity.color,
          order: severity.order,
          createdBy: userId,
        };
      });

      // Get category name (with " Risk" suffix if needed)
      const categoryName = impactCategories.find(cat => cat.id === categoryId)?.name || '';
      const taxonomyName = categoryName.includes(' Risk') ? categoryName : `${categoryName} Risk`;

      // Prepare taxonomy data for API
      const taxonomyData = {
        taxonomyId: existingTaxonomy?.taxonomyId, // Include for update
        name: taxonomyName,
        weightage: existingTaxonomy?.weightage || 0,
        order: existingTaxonomy?.order || 0,
        createdBy: userId,
        severityLevels: updatedSeverityLevels,
      };

      // Call the API to save/update taxonomy
      await saveTaxonomies(orgId, [taxonomyData]);

      // Update saved state
      setSavedStates(prev => ({ ...prev, [categoryId]: true }));

      // Optionally refresh taxonomies to get updated data
      try {
        const response = await getTaxonomies(orgId);
        if (response.data && response.data.length > 0) {
          setTaxonomies(response.data);
        }
      } catch (refreshError) {
        console.warn('Failed to refresh taxonomies after save:', refreshError);
      }

      // Reset saving state
      setSavingStates(prev => ({ ...prev, [categoryId]: false }));

    } catch (error) {
      console.error('Error saving Impact Scale:', error);
      setSavingStates(prev => ({ ...prev, [categoryId]: false }));

      // You might want to show an error toast here
      // For now, we'll just log the error
      alert(error instanceof Error ? error.message : 'Failed to save impact scale');
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

  // Get severity level labels for X-axis from API
  const severityLevels = getCurrentCategorySeverityLevels();
  const firstSeverityLabel = severityLevels.length > 0 ? severityLevels[0].name : 'Very Low';
  const lastSeverityLabel = severityLevels.length > 0 ? severityLevels[severityLevels.length - 1].name : 'Critical';

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
                    value={focusedInput === 'min' 
                      ? (getCurrentRange()[0] > 0 ? getCurrentRange()[0].toString() : '')
                      : (getCurrentRange()[0] > 0 ? formatCurrency(getCurrentRange()[0]) : '')
                    }
                    onChange={(e) => handleDollarInputChange(0, e.target.value)}
                    onFocus={() => setFocusedInput('min')}
                    onBlur={() => setFocusedInput(null)}
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
                    max={getSliderMax()}       // Maximum is the higher of annualRevenue or maxRangeFromAPI (with 20% buffer)
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
                    value={focusedInput === 'max' 
                      ? (getCurrentRange()[1] > 0 ? getCurrentRange()[1].toString() : '')
                      : (getCurrentRange()[1] > 0 ? formatCurrency(getCurrentRange()[1]) : '')
                    }
                    onChange={(e) => handleDollarInputChange(1, e.target.value)}
                    onFocus={() => setFocusedInput('max')}
                    onBlur={() => setFocusedInput(null)}
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

                          {/* X-axis labels (First and Last severity levels from API) */}
                          <text x="40" y="150" fontSize="12" fill="#91939A" textAnchor="start">{firstSeverityLabel}</text>
                          <text x="360" y="150" fontSize="12" fill="#91939A" textAnchor="end">{lastSeverityLabel}</text>
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
                {getCurrentCategorySeverityLevels().length > 0 ? (
                  getCurrentCategorySeverityLevels().map((severity, index) => (
                    <Box
                      key={severity.severityId}
                      sx={{
                        flex: 1,
                        backgroundColor: severity.color,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                        borderRight: index < getCurrentCategorySeverityLevels().length - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                        '&:first-of-type': {
                          borderTopLeftRadius: '8px',
                          borderBottomLeftRadius: '8px',
                        },
                        '&:last-of-type': {
                          borderTopRightRadius: '8px',
                          borderBottomRightRadius: '8px',
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                        {severity.name}
                      </Typography>
                      {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (() => {
                        const totalSeverities = getCurrentCategorySeverityLevels().length;
                        const severityRange = calculateSeverityRange(index, totalSeverities);
                        const isLast = index === totalSeverities - 1;

                        return (
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                            {isLast ? (
                              <>&gt; {formatCurrencyCompact(severityRange.max)}</>
                            ) : (
                              <>{formatCurrencyCompact(severityRange.min)} - {formatCurrencyCompact(severityRange.max)}</>
                            )}
                          </Typography>
                        );
                      })()}
                    </Box>
                  ))
                ) : (
                  // Fallback to default severity levels if no API data
                  <>
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
                      {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                          {formatCurrencyCompact(getCurrentRange()[0])} - {formatCurrencyCompact(calculateImpact(25, gradientType))}
                        </Typography>
                      )}
                    </Box>
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
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                          {formatCurrencyCompact(calculateImpact(25, gradientType))} - {formatCurrencyCompact(calculateImpact(50, gradientType))}
                        </Typography>
                      )}
                    </Box>
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
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                          {formatCurrencyCompact(calculateImpact(50, gradientType))} - {formatCurrencyCompact(calculateImpact(75, gradientType))}
                        </Typography>
                      )}
                    </Box>
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
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                          {formatCurrencyCompact(calculateImpact(75, gradientType))} - {formatCurrencyCompact(calculateImpact(100, gradientType))}
                        </Typography>
                      )}
                    </Box>
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
                      {getCurrentRange()[0] > 0 && getCurrentRange()[1] > 0 && (
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', mt: 0.5, textAlign: 'center', px: 0.5 }}>
                          &gt; {formatCurrencyCompact(calculateImpact(100, gradientType))}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
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
