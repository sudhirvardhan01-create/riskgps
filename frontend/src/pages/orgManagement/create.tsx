import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { ArrowBack, CameraAlt, Add, Check } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import BusinessContextForm from "@/components/OrgManagement/BusinessContextForm";
import { createOrganization, CreateOrganizationRequest, saveTaxonomies } from "@/services/organizationService";
import ToastComponent from "@/components/ToastComponent";
import Image from "next/image";
import Cookies from "js-cookie";
import { getRawNumericValue } from "@/utils/utility";

interface Tag {
  key: string;
  value: string;
}

interface BusinessContextData {
  industryVertical: string;
  regionOfOperation: string[];
  numberOfEmployees: string;
  cisoName: string;
  cisoEmail: string;
  annualRevenue: string;
  riskAppetite: string;
  cybersecurityBudget: string;
  insuranceCoverage: string;
  insuranceCarrier: string;
  numberOfClaims: string;
  claimsValue: string;
  regulators: string;
  regulatoryRequirements: string;
  additionalInformation: string;
  recordTypes: string[];
  piiRecordsCount: string;
  pfiRecordsCount: string;
  phiRecordsCount: string;
  governmentRecordsCount: string;
  certifications: string[];
  intellectualPropertyPercentage: string;
}

// Configuration for mandatory fields - easily customizable
// To make a field optional, simply change its value from true to false
// Example: numberOfEmployees: false (makes this field optional)
const MANDATORY_FIELDS = {
  // Basic Details
  orgName: true,
  // tags: true, // At least one tag is mandatory
  tags: false, // Tags section is commented out, so tags are optional

  // Business Context - Step 1
  industryVertical: true,
  regionOfOperation: true,
  numberOfEmployees: true,
  cisoName: true,
  cisoEmail: true,
  annualRevenue: true,
  riskAppetite: true,
  cybersecurityBudget: true,
  insuranceCoverage: true,
  insuranceCarrier: true,
  numberOfClaims: true,
  claimsValue: true,
  regulators: true,
  regulatoryRequirements: true,
  additionalInformation: true,

  // Business Context - Step 2
  recordTypes: true,
  piiRecordsCount: true,
  pfiRecordsCount: true,
  phiRecordsCount: true,
  governmentRecordsCount: true,
  certifications: true,
  intellectualPropertyPercentage: true,
} as const;

function CreateNewOrgPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<Tag>({ key: "", value: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "warning" | "info" | "success"
  });
  const [businessContext, setBusinessContext] = useState<BusinessContextData>({
    industryVertical: "",
    regionOfOperation: [],
    numberOfEmployees: "",
    cisoName: "",
    cisoEmail: "",
    annualRevenue: "",
    riskAppetite: "",
    cybersecurityBudget: "",
    insuranceCoverage: "",
    insuranceCarrier: "",
    numberOfClaims: "",
    claimsValue: "",
    regulators: "",
    regulatoryRequirements: "",
    additionalInformation: "",
    recordTypes: [],
    piiRecordsCount: "",
    pfiRecordsCount: "",
    phiRecordsCount: "",
    governmentRecordsCount: "",
    certifications: [],
    intellectualPropertyPercentage: ""
  });

  // Reset loading state when component unmounts or route changes
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleBackClick = () => {
    router.push('/orgManagement');
  };

  const handleAddTag = () => {
    if (currentTag.key && currentTag.value) {
      const newTags = [...tags, currentTag];
      setTags(newTags);
      // Clear the current tag inputs after adding
      setCurrentTag({ key: "", value: "" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
    setCurrentTag({ key: "", value: "" });
  };

  // Generic validation function for any field
  const isFieldValid = (fieldName: keyof BusinessContextData, value: string | string[]): boolean => {
    if (!MANDATORY_FIELDS[fieldName as keyof typeof MANDATORY_FIELDS]) {
      return true; // Field is not mandatory
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === 'string' && value.trim() !== "";
  };

  // Validation for tags (special case)
  const isTagsValid = (): boolean => {
    if (!MANDATORY_FIELDS.tags) {
      return true; // Tags are not mandatory
    }
    return tags.length > 0;
  };

  // Validation for step 1 (Business Context Page 1)
  const isStep1Valid = () => {
    const step1Fields: (keyof BusinessContextData)[] = [
      'industryVertical', 'regionOfOperation', 'numberOfEmployees', 'cisoName',
      'cisoEmail', 'annualRevenue', 'riskAppetite', 'cybersecurityBudget',
      'insuranceCoverage', 'insuranceCarrier', 'numberOfClaims', 'claimsValue',
      'regulators', 'regulatoryRequirements', 'additionalInformation'
    ];

    return step1Fields.every(field => isFieldValid(field, businessContext[field]));
  };

  // Validation for step 2 (Business Context Page 2)
  const isStep2Valid = () => {
    const step2Fields: (keyof BusinessContextData)[] = [
      'recordTypes', 'piiRecordsCount', 'pfiRecordsCount', 'phiRecordsCount',
      'governmentRecordsCount', 'certifications', 'intellectualPropertyPercentage'
    ];

    return step2Fields.every(field => isFieldValid(field, businessContext[field]));
  };

  const handleContinue = async (event?: React.MouseEvent) => {
    // Prevent multiple clicks during loading
    if (isLoading) {
      event?.preventDefault();
      event?.stopPropagation();
      return;
    }

    // Set loading state for all steps
    setIsLoading(true);
    setToast(prev => ({ ...prev, open: false }));

    try {
      if (currentStep === 0) {
        // Simulate a small delay for step transition
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Simulate a small delay for step transition
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
        setCurrentStep(2);
      } else {
        // Submit form data to API
        // Prepare the organization data for API
        const organizationData: CreateOrganizationRequest = {
          orgName: orgName,
          desc: businessContext.additionalInformation || "Organization created via RiskGPS",
          tags: tags,
          businessContext: {
            industryVertical: businessContext.industryVertical,
            regionOfOperation: businessContext.regionOfOperation.join(", "),
            numberOfEmployees: getRawNumericValue(businessContext.numberOfEmployees),
            cisoName: businessContext.cisoName,
            cisoEmail: businessContext.cisoEmail,
            annualRevenue: businessContext.annualRevenue,
            riskAppetite: businessContext.riskAppetite,
            cybersecurityBudget: businessContext.cybersecurityBudget,
            insuranceCoverage: businessContext.insuranceCoverage,
            insuranceCarrier: businessContext.insuranceCarrier,
            numberOfClaims: businessContext.numberOfClaims,
            claimsValue: businessContext.claimsValue,
            regulators: businessContext.regulators,
            regulatoryRequirements: businessContext.regulatoryRequirements,
            additionalInformation: businessContext.additionalInformation,
            recordTypes: businessContext.recordTypes,
            piiRecordsCount: businessContext.piiRecordsCount,
            pfiRecordsCount: businessContext.pfiRecordsCount,
            phiRecordsCount: businessContext.phiRecordsCount,
            governmentRecordsCount: businessContext.governmentRecordsCount,
            certifications: businessContext.certifications,
            intellectualPropertyPercentage: businessContext.intellectualPropertyPercentage
          }
        };

        // Call the API to create organization
        const response = await createOrganization(organizationData);

        if (response.success && response.data.organizationId) {
          // Get user ID from cookies for createdBy
          const userCookie = Cookies.get("user");
          const user = userCookie ? JSON.parse(userCookie) : null;
          const userId = user?.userId || user?.id || response.data.createdBy || null;

          // Extract numeric value from annualRevenue (remove any formatting) - same as RiskTaxonomy.tsx
          const annualRevenueValue = businessContext.annualRevenue
            ? parseInt(businessContext.annualRevenue.replace(/[^0-9]/g, ''))
            : 0;

          // Set default dollar range to 25% and 75% of annual revenue (same as RiskTaxonomy.tsx)
          const defaultMin = annualRevenueValue > 0 ? Math.round(annualRevenueValue * 0.25) : 0;
          const defaultMax = annualRevenueValue > 0 ? Math.round(annualRevenueValue * 0.75) : 0;
          const range = defaultMax - defaultMin;

          // Calculate impact based on percentage (same formula as RiskTaxonomy.tsx calculateImpact)
          // Using linear calculation: userMin + (normalizedValue * range)
          const calculateImpact = (percentage: number): number => {
            if (defaultMin > 0 && defaultMax > 0) {
              const normalizedValue = percentage / 100;
              return defaultMin + (normalizedValue * range);
            }
            return 0;
          };

          // Compute severity ranges same as RiskTaxonomy.tsx:
          // Very Low: defaultMin to calculateImpact(25)
          // Low: calculateImpact(25) to calculateImpact(50)
          // Medium: calculateImpact(50) to calculateImpact(75)
          // High: calculateImpact(75) to calculateImpact(100) = defaultMax
          // Critical: calculateImpact(100) = defaultMax, and since RiskTaxonomy.tsx shows "> calculateImpact(100)",
          // we extend Critical beyond defaultMax. The maxRange extends proportionally beyond the defaultMax.
          // Extending Critical from defaultMax (75%) to a value that maintains the range proportion.
          const formatRange = (value: number): string => {
            return Math.round(value).toString();
          };

          // Calculate Low, Medium, and High values based on defaultMin (Very Low) and defaultMax (Critical)
          // Low: 25% of the range from defaultMin to defaultMax
          // Medium: 50% of the range from defaultMin to defaultMax  
          // High: 75% of the range from defaultMin to defaultMax
          const lowValue = calculateImpact(25);   // 25% point between defaultMin and defaultMax
          const mediumValue = calculateImpact(50); // 50% point between defaultMin and defaultMax
          const highValue = calculateImpact(75);   // 75% point between defaultMin and defaultMax

          // Create taxonomies payload with severity levels
          const taxonomiesPayload = [
            {
              name: "Financial Risk",
              weightage: 40,
              order: 1,
              createdBy: userId || "",
              severityLevels: [
                {
                  name: "Very Low",
                  minRange: formatRange(defaultMin),
                  maxRange: formatRange(lowValue),
                  color: "#3BB966",
                  order: 1,
                  createdBy: userId || ""
                },
                {
                  name: "Low",
                  minRange: formatRange(lowValue),
                  maxRange: formatRange(mediumValue),
                  color: "#3366CC",
                  order: 2,
                  createdBy: userId || ""
                },
                {
                  name: "Moderate",
                  minRange: formatRange(mediumValue),
                  maxRange: formatRange(highValue),
                  color: "#E3B52A",
                  order: 3,
                  createdBy: userId || ""
                },
                {
                  name: "High",
                  minRange: formatRange(highValue),
                  maxRange: formatRange(defaultMax),
                  color: "#DA7706",
                  order: 4,
                  createdBy: userId || ""
                },
                {
                  name: "Critical",
                  minRange: "",
                  maxRange: formatRange(defaultMax),
                  color: "#B90D0D",
                  order: 5,
                  createdBy: userId || ""
                }
              ]
            },
            {
              name: "Regulatory Risk",
              weightage: 30,
              order: 2,
              createdBy: userId || "",
              severityLevels: [
                {
                  name: "Very Low",
                  minRange: formatRange(defaultMin),
                  maxRange: formatRange(lowValue),
                  color: "#3BB966",
                  order: 1,
                  createdBy: userId || ""
                },
                {
                  name: "Low",
                  minRange: formatRange(lowValue),
                  maxRange: formatRange(mediumValue),
                  color: "#3366CC",
                  order: 2,
                  createdBy: userId || ""
                },
                {
                  name: "Moderate",
                  minRange: formatRange(mediumValue),
                  maxRange: formatRange(highValue),
                  color: "#E3B52A",
                  order: 3,
                  createdBy: userId || ""
                },
                {
                  name: "High",
                  minRange: formatRange(highValue),
                  maxRange: formatRange(defaultMax),
                  color: "#DA7706",
                  order: 4,
                  createdBy: userId || ""
                },
                {
                  name: "Critical",
                  minRange: "",
                  maxRange: formatRange(defaultMax),
                  color: "#B90D0D",
                  order: 5,
                  createdBy: userId || ""
                }
              ]
            },
            {
              name: "Operational Risk",
              weightage: 20,
              order: 3,
              createdBy: userId || "",
              severityLevels: [
                {
                  name: "Very Low",
                  minRange: formatRange(defaultMin),
                  maxRange: formatRange(lowValue),
                  color: "#3BB966",
                  order: 1,
                  createdBy: userId || ""
                },
                {
                  name: "Low",
                  minRange: formatRange(lowValue),
                  maxRange: formatRange(mediumValue),
                  color: "#3366CC",
                  order: 2,
                  createdBy: userId || ""
                },
                {
                  name: "Moderate",
                  minRange: formatRange(mediumValue),
                  maxRange: formatRange(highValue),
                  color: "#E3B52A",
                  order: 3,
                  createdBy: userId || ""
                },
                {
                  name: "High",
                  minRange: formatRange(highValue),
                  maxRange: formatRange(defaultMax),
                  color: "#DA7706",
                  order: 4,
                  createdBy: userId || ""
                },
                {
                  name: "Critical",
                  minRange: "",
                  maxRange: formatRange(defaultMax),
                  color: "#B90D0D",
                  order: 5,
                  createdBy: userId || ""
                }
              ]
            },
            {
              name: "Reputational Risk",
              weightage: 10,
              order: 4,
              createdBy: userId || "",
              severityLevels: [
                {
                  name: "Very Low",
                  minRange: formatRange(defaultMin),
                  maxRange: formatRange(lowValue),
                  color: "#3BB966",
                  order: 1,
                  createdBy: userId || ""
                },
                {
                  name: "Low",
                  minRange: formatRange(lowValue),
                  maxRange: formatRange(mediumValue),
                  color: "#3366CC",
                  order: 2,
                  createdBy: userId || ""
                },
                {
                  name: "Moderate",
                  minRange: formatRange(mediumValue),
                  maxRange: formatRange(highValue),
                  color: "#E3B52A",
                  order: 3,
                  createdBy: userId || ""
                },
                {
                  name: "High",
                  minRange: formatRange(highValue),
                  maxRange: formatRange(defaultMax),
                  color: "#DA7706",
                  order: 4,
                  createdBy: userId || ""
                },
                {
                  name: "Critical",
                  minRange: "",
                  maxRange: formatRange(defaultMax),
                  color: "#B90D0D",
                  order: 5,
                  createdBy: userId || ""
                }
              ]
            }
          ];

          // Save taxonomies for the organization
          try {
            await saveTaxonomies(response.data.organizationId, taxonomiesPayload);
          } catch (taxonomyError) {
            // Log error but don't block navigation if taxonomy save fails
            console.error("Failed to save taxonomies:", taxonomyError);
            // Optionally show a warning toast
            setToast({
              open: true,
              message: "Organization created successfully, but failed to save taxonomies. You can configure them later.",
              severity: "warning"
            });
          }

          // Encode form data as URL parameters
          const queryParams = new URLSearchParams({
            showSuccess: 'true',
            orgName: orgName,
            tags: JSON.stringify(tags),
            businessContext: JSON.stringify(businessContext)
          });

          const navigationUrl = `/orgManagement/${response.data.organizationId}?${queryParams.toString()}`;

          // Navigate to the organization details page with the actual organizationId from API
          router.push(navigationUrl);
        } else {
          setToast({
            open: true,
            message: "Failed to create organization. Please try again.",
            severity: "error"
          });
          setIsLoading(false);
        }
      }
    } catch (err) {
      setToast({
        open: true,
        message: err instanceof Error ? err.message : "Failed to create organization. Please try again.",
        severity: "error"
      });
      setIsLoading(false);
    }
  };

  const handleBusinessContextChange = (field: keyof BusinessContextData, value: string | string[]) => {
    setBusinessContext(prev => ({ ...prev, [field]: value }));
  };

  const handleBackToStep1 = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handleCancel = () => {
    router.push('/orgManagement');
  };


  return (
    <Box sx={{
      height: "calc(100vh - 72px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* Breadcrumb */}
      <Box sx={{
        pt: 1.5,
        display: "flex",
        flexDirection: "column"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, pl: 2 }}>
          <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848"
              }}
            >
              Org Management/
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#04139A"
              }}
            >
              Create New Org
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 1,
        // Hide scrollbar but keep scrolling functionality
        "&::-webkit-scrollbar": {
          display: "none"
        },
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none" // IE and Edge
      }}>
        <Box
          sx={{
            width: "880px",
            borderRadius: "8px",
            border: "1px solid #E7E7E8",
            p: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            backgroundColor: "#FFFFFF",
            mb: 5
          }}
        >
          {/* Step Indicator */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Step 1 */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: currentStep === 0 ? "#04139A" : "#4CAF50",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "0%"
                  }}
                >
                  {currentStep === 0 ? "1" : <Check sx={{ fontSize: 20 }} />}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1,
                    color: currentStep === 0 ? "#04139A" : "#4CAF50"
                  }}
                >
                  Basic Details
                </Typography>
              </Box>

              {/* Connector Line */}
              <Box
                sx={{
                  width: 157,
                  height: 2,
                  backgroundColor: "#9E9FA5",
                  borderRadius: "2px",
                }}
              />

              {/* Step 2 */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: (currentStep === 1 || currentStep === 2) ? "#04139A" : "#FFFFFF",
                    color: (currentStep === 1 || currentStep === 2) ? "#FFFFFF" : "#9E9FA5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                    border: (currentStep === 1 || currentStep === 2) ? "none" : "1px solid #9E9FA5",
                    lineHeight: "150%",
                    letterSpacing: "0%"
                  }}
                >
                  2
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1,
                    color: (currentStep === 1 || currentStep === 2) ? "#04139A" : "#9E9FA5"
                  }}
                >
                  Business Context
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Page Indicator */}
          {currentStep > 0 && <Typography
            variant="body1"
            sx={{
              color: "#9E9FA5",
              mb: 2
            }}
          >
            Page {currentStep} of 2
          </Typography>}


          <Box sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {currentStep === 0 ? (
              <>
                {/* Org Logo Upload */}
                <Box sx={{ position: "relative", mb: 4, opacity: 0.5, pointerEvents: "none" }}>
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      backgroundColor: "#F2F0F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Image
                        src={"/org-image-icon.png"}
                        alt="org-image"
                        width={32}
                        height={32}
                      />
                    </Box>
                  </Avatar>
                  <IconButton
                    disabled
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#04139A",
                      color: "#FFFFFF",
                      width: 24,
                      height: 24,
                      "&:hover": {
                        backgroundColor: "#04139A",
                        opacity: 0.9
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#E0E0E0",
                        color: "#9E9E9E"
                      }
                    }}
                  >
                    <CameraAlt sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>

                {/* Form Fields */}
                <Box sx={{ width: "100%", mb: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    label={
                      <span>
                        Org Name <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    placeholder="Enter first name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        height: "48px",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#CECFD2",
                          borderWidth: "1px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#04139A",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#04139A",
                        },
                        "& input": {
                          padding: "16px 20px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#484848",
                        fontSize: "14px",
                        fontWeight: 500,
                        "&.Mui-focused": {
                          color: "#04139A",
                        },
                      },
                    }}
                  />

                  {/* Tags Section */}
                  {/* <Box sx={{ mb: 2, mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#121212",
                        mb: 1
                      }}
                    >
                      Tags <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9E9FA5",
                        mb: 1,
                        fontSize: "12px"
                      }}
                    >
                      At least one tag is required
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      <FormControl variant="outlined" sx={{ flex: 1 }}>
                        <InputLabel
                          sx={{
                            color: "#484848",
                            fontSize: "14px",
                            fontWeight: 500,
                            "&.Mui-focused": { color: "#04139A" },
                          }}
                        >
                          Key
                        </InputLabel>
                        <Select
                          value={currentTag.key}
                          onChange={(e) => setCurrentTag({ ...currentTag, key: e.target.value })}
                          input={<OutlinedInput label="Key" />}
                          sx={{
                            height: "48px",
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#CECFD2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#04139A",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#04139A",
                            },
                            "& .MuiSelect-select": {
                              padding: "16px 20px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                        >
                          <MenuItem value="industry">Industry</MenuItem>
                          <MenuItem value="size">Size</MenuItem>
                          <MenuItem value="region">Region</MenuItem>
                          <MenuItem value="type">Type</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Value"
                        placeholder="Enter Value"
                        value={currentTag.value}
                        onChange={(e) => setCurrentTag({ ...currentTag, value: e.target.value })}
                        onKeyDown={handleKeyDown}
                        sx={{
                          flex: 1,
                          "& .MuiOutlinedInput-root": {
                            height: "48px",
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                            "& fieldset": {
                              borderColor: "#CECFD2",
                            },
                            "&:hover fieldset": {
                              borderColor: "#04139A",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#04139A",
                            },
                            "& input": {
                              padding: "16px 20px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#484848",
                            fontSize: "14px",
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#04139A",
                            },
                          },
                        }}
                      />
                    </Stack>

                    <Button
                      startIcon={<Add sx={{ fontSize: "16px" }} />}
                      onClick={handleAddTag}
                      sx={{
                        color: "#04139A",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        letterSpacing: "0px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#04139A",
                          opacity: 0.8
                        }
                      }}
                    >
                      Add New Key
                    </Button>

                    {tags.length > 0 ? (
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={`${tag.key.charAt(0).toUpperCase() + tag.key.slice(1).toLowerCase()}: ${tag.value}`}
                            onDelete={() => handleRemoveTag(index)}
                            sx={{
                              backgroundColor: "#F5F5F5",
                              border: "1px solid #E0E0E0",
                              "& .MuiChip-deleteIcon": {
                                color: "#9E9E9E",
                                "&:hover": {
                                  color: "#04139A"
                                }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#CD0303",
                          mt: 1,
                          fontSize: "12px",
                          fontStyle: "italic"
                        }}
                      >
                        No tags added yet. Please add at least one tag to continue.
                      </Typography>
                    )}
                  </Box> */}
                </Box>
              </>
            ) : (
              /* Business Context Form */
              <BusinessContextForm
                businessContext={businessContext}
                currentStep={currentStep}
                onFieldChange={handleBusinessContextChange}
                mandatoryFields={MANDATORY_FIELDS}
              />
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              width: "100%",
              pt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #E0E0E0",
            }}
          >
            {/* Left side (Prev) */}
            <Box>
              {(currentStep === 1 || currentStep === 2) && (
                <Button
                  variant="text"
                  onClick={handleBackToStep1}
                  startIcon={<ArrowBack sx={{ fontSize: "16px" }} />}
                  sx={{
                    color: "#04139A",
                    fontSize: "16px",
                    fontWeight: 400,
                    textTransform: "none",
                    padding: "12px 0px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#04139A",
                      opacity: 0.8,
                    },
                  }}
                >
                  Prev
                </Button>
              )}
            </Box>

            {/* Right side (Cancel + Continue) */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexGrow: 1 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: "#CD0303",
                  color: "#CD0303",
                  fontSize: "16px",
                  fontWeight: 400,
                  textTransform: "none",
                  padding: "12px 32px",
                  borderRadius: "4px",
                  "&:hover": {
                    borderColor: "#CD0303",
                    color: "#CD0303",
                  },
                }}
              >
                Cancel
              </Button>

              <Tooltip
                title={
                  currentStep === 0 ? (!orgName.trim() || !isTagsValid() ? "Fill All Organization mandatory fields" : "") :
                    currentStep === 1 ? (!isStep1Valid() ? "Fill All Organization mandatory fields" : "") :
                      currentStep === 2 ? (!isStep2Valid() ? "Fill All Organization mandatory fields" : "") :
                        ""
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "#CD0303",
                      color: "#FFFFFF",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "6px",
                      boxShadow: 2,
                    },
                  },
                  arrow: {
                    sx: {
                      color: "#CD0303",
                    },
                  },
                }}
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={(event) => handleContinue(event)}
                    disabled={
                      isLoading ||
                      (currentStep === 0 ? !orgName.trim() || !isTagsValid() :
                        currentStep === 1 ? !isStep1Valid() :
                          currentStep === 2 ? !isStep2Valid() : false)
                    }
                    sx={{
                      backgroundColor: "#04139A",
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: 400,
                      textTransform: "none",
                      padding: "12px 40px",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#04139A",
                        opacity: 0.9,
                      },
                      "&:disabled": {
                        backgroundColor: "#E0E0E0",
                        color: "#9E9E9E",
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={32}
                        thickness={4}
                        sx={{
                          color: "inherit",
                          animation: "spin 1s linear infinite",
                          "@keyframes spin": {
                            "0%": {
                              transform: "rotate(0deg)",
                            },
                            "100%": {
                              transform: "rotate(360deg)",
                            },
                          },
                        }}
                      />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        message={toast.message}
        toastSeverity={toast.severity}
      />
    </Box>
  );
}

export default withAuth(CreateNewOrgPage);