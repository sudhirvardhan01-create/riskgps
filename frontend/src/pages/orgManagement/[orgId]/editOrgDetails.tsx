import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  OutlinedInput,
  Grid,
  CircularProgress
} from "@mui/material";
import { ArrowBack, ExpandLess, Add, CameraAlt } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { Organization } from "@/types/organization";
import Image from "next/image";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import ToastComponent from "@/components/ToastComponent";
import { getOrganizationById, updateOrganization } from "@/services/organizationService";
import Cookies from "js-cookie";
import { COUNTRIES } from "@/constants/constant";


interface Tag {
  key: string;
  value: string;
}

function EditOrgDetailsPage() {
  const router = useRouter();
  const { orgId, orgName, tags, businessContext } = router.query;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "warning" | "info" | "success"
  });
  const [formData, setFormData] = useState({
    orgName: "",
    industryVertical: "",
    regionOfOperation: "",
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
    recordTypes: [] as string[],
    piiRecordsCount: "",
    pfiRecordsCount: "",
    phiRecordsCount: "",
    governmentRecordsCount: "",
    certifications: [] as string[],
    intellectualPropertyPercentage: "",
    tags: [] as Tag[]
  });

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId) return;

      try {
        // First try to fetch from API
        const apiResponse = await getOrganizationById(orgId as string);

        // Transform API response to match Organization interface
        const transformedOrg: Organization = {
          id: apiResponse.data.organizationId,
          name: apiResponse.data.name,
          orgId: apiResponse.data.organizationId,
          orgCode: apiResponse.data.orgCode || apiResponse.data.organizationId, // Use orgCode from API or fallback to orgId
          orgImage: "/orgImage.png", // Default image since API doesn't provide this
          tags: (() => {
            // Convert API tags array to object format
            const tagsObject: { [key: string]: string } = {};
            if (apiResponse.data.tags && Array.isArray(apiResponse.data.tags)) {
              apiResponse.data.tags.forEach((tag: any) => {
                if (tag.key && tag.value) {
                  // Normalize the key to lowercase for consistent checking
                  const normalizedKey = tag.key.toLowerCase();
                  tagsObject[normalizedKey] = tag.value;
                }
              });
            }

            // Add size calculation based on employee count if not provided in tags
            if (!tagsObject.size && apiResponse.data.numberOfEmployees) {
              tagsObject.size = apiResponse.data.numberOfEmployees < 500 ? "Small (< 500 Employees)" :
                apiResponse.data.numberOfEmployees < 2000 ? "Medium (500-2000 Employees)" :
                  "Large (> 2000 Employees)";
            }

            // Add industry from industryVertical if not in tags
            if (!tagsObject.industry && apiResponse.data.industryVertical) {
              tagsObject.industry = apiResponse.data.industryVertical;
            }

            // Ensure required properties exist with defaults
            const result: { industry: string; size: string;[key: string]: string } = {
              industry: tagsObject.industry || "Healthcare",
              size: tagsObject.size || "Small (< 500 Employees)",
              ...tagsObject // Spread all other tags
            };
            return result;
          })(),
          members: {
            avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
            additionalCount: 3
          },
          businessUnits: apiResponse.data.businessUnits && apiResponse.data.businessUnits.length > 0
            ? apiResponse.data.businessUnits
            : [], // Use API data or default
          status: "active", // Default since API doesn't provide this
          lastUpdated: apiResponse.data.modifiedDate ?
            new Date(apiResponse.data.modifiedDate).toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0],
          createdDate: apiResponse.data.createdDate || "-",
          modifiedDate: apiResponse.data.modifiedDate || "-",
          createdBy: apiResponse.data.createdBy || "-",
          details: {
            industryVertical: apiResponse.data.industryVertical || "-",
            regionOfOperation: apiResponse.data.regionOfOperation || "-",
            employeeCount: apiResponse.data.numberOfEmployees || "-",
            cisoName: apiResponse.data.cisoName || "-",
            cisoEmail: apiResponse.data.cisoEmail || "-",
            annualRevenue: apiResponse.data.annualRevenue ? `$ ${parseInt(apiResponse.data.annualRevenue).toLocaleString()}` : "-",
            riskAppetite: apiResponse.data.riskAppetite ? `$ ${parseInt(apiResponse.data.riskAppetite).toLocaleString()}` : "-",
            cybersecurityBudget: apiResponse.data.cybersecurityBudget ? `$ ${parseInt(apiResponse.data.cybersecurityBudget).toLocaleString()}` : "-",
            insuranceCoverage: apiResponse.data.insuranceCoverage ? `$ ${parseInt(apiResponse.data.insuranceCoverage).toLocaleString()}` : "-",
            insuranceCarrier: apiResponse.data.insuranceCarrier || "-",
            claimsCount: apiResponse.data.numberOfClaims?.toString() || "-",
            claimsValue: apiResponse.data.claimsValue ? `$ ${parseInt(apiResponse.data.claimsValue).toLocaleString()}` : "-",
            regulators: apiResponse.data.regulators || "-",
            regulatoryRequirements: apiResponse.data.regulatoryRequirements || "-",
            additionalInformation: apiResponse.data.additionalInformation || "-",
            recordTypes: apiResponse.data.recordTypes || ["-", "-", "-"],
            piiRecordsCount: apiResponse.data.piiRecordsCount?.toString() || "-",
            pfiRecordsCount: apiResponse.data.pfiRecordsCount?.toString() || "-",
            phiRecordsCount: apiResponse.data.phiRecordsCount?.toString() || "-",
            governmentRecordsCount: apiResponse.data.governmentRecordsCount?.toString() || "-",
            certifications: apiResponse.data.certifications || ["-"],
            intellectualPropertyPercentage: apiResponse.data.intellectualPropertyPercentage?.toString() || "-"
          }
        };

        setOrganization(transformedOrg);

        // Set form data based on the organization data
        // Convert country name to country code if needed
        const getCountryCode = (countryName: string): string => {
          if (!countryName) return "";
          const country = COUNTRIES.find(c => c.label === countryName);
          return country ? country.value : countryName;
        };

        const newFormData = {
          orgName: transformedOrg.name,
          industryVertical: transformedOrg.details?.industryVertical || "",
          regionOfOperation: getCountryCode(transformedOrg.details?.regionOfOperation || ""),
          numberOfEmployees: transformedOrg.details?.employeeCount?.toString() || "",
          cisoName: transformedOrg.details?.cisoName || "",
          cisoEmail: transformedOrg.details?.cisoEmail || "",
          annualRevenue: transformedOrg.details?.annualRevenue || "",
          riskAppetite: transformedOrg.details?.riskAppetite || "",
          cybersecurityBudget: transformedOrg.details?.cybersecurityBudget || "",
          insuranceCoverage: transformedOrg.details?.insuranceCoverage || "",
          insuranceCarrier: transformedOrg.details?.insuranceCarrier || "",
          numberOfClaims: transformedOrg.details?.claimsCount || "",
          claimsValue: transformedOrg.details?.claimsValue || "",
          regulators: transformedOrg.details?.regulators || "",
          regulatoryRequirements: transformedOrg.details?.regulatoryRequirements || "",
          additionalInformation: transformedOrg.details?.additionalInformation || "",
          recordTypes: transformedOrg.details?.recordTypes || [],
          piiRecordsCount: transformedOrg.details?.piiRecordsCount || "",
          pfiRecordsCount: transformedOrg.details?.pfiRecordsCount || "",
          phiRecordsCount: transformedOrg.details?.phiRecordsCount || "",
          governmentRecordsCount: transformedOrg.details?.governmentRecordsCount || "",
          certifications: transformedOrg.details?.certifications || [],
          intellectualPropertyPercentage: transformedOrg.details?.intellectualPropertyPercentage || "",
          tags: Object.entries(transformedOrg.tags).map(([key, value]) => ({
            key: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
            value: value
          }))
        };
        setFormData(newFormData);
        setIsFormReady(true);
      } catch (apiError) {
        setToast({
          open: true,
          message: "Failed to load organization. Please try again.",
          severity: "error"
        });
        // Redirect back to org management on error
        router.push('/orgManagement');
      }
    };

    fetchOrganization();
  }, [orgId, router, orgName, tags, businessContext]);

  const handleBackClick = () => {
    router.push(`/orgManagement/${orgId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) =>
        i === index ? { ...tag, [field]: value } : tag
      )
    }));
  };

  const addNewTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: "", value: "" }]
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Helper function to remove dollar signs and clean financial values
  const cleanFinancialValue = (value: string): string => {
    if (!value) return value;
    // Remove dollar signs, commas, and any whitespace
    return value.replace(/[$,\s]/g, '');
  };

  const handleSave = async () => {
    if (!orgId) return;

    // Validate required fields
    const requiredFields = [
      { key: 'orgName', label: 'Organization Name' },
      { key: 'industryVertical', label: 'Industry Vertical' },
      { key: 'regionOfOperation', label: 'Region of Operation' },
      { key: 'numberOfEmployees', label: 'Number of employees globally' },
      { key: 'cisoName', label: 'CISO Name' },
      { key: 'cisoEmail', label: 'CISO Email' },
      { key: 'annualRevenue', label: 'Estimated Annual Revenue' },
      { key: 'riskAppetite', label: 'Risk Appetite' },
      { key: 'cybersecurityBudget', label: 'Allocated budget for cybersecurity operations' },
      { key: 'insuranceCoverage', label: 'Insurance - Current Coverage' },
      { key: 'insuranceCarrier', label: 'Insurance - Current Carrier' },
      { key: 'numberOfClaims', label: 'No. of claims' },
      { key: 'claimsValue', label: 'Claims Value' },
      { key: 'regulators', label: 'Regulators' },
      { key: 'regulatoryRequirements', label: 'Regulatory Requirements' },
      { key: 'piiRecordsCount', label: 'PII Records Count' },
      { key: 'pfiRecordsCount', label: 'PFI Records Count' },
      { key: 'phiRecordsCount', label: 'PHI Records Count' },
      { key: 'governmentRecordsCount', label: 'Government Records Count' },
      { key: 'intellectualPropertyPercentage', label: 'Intellectual Property Percentage' },
      { key: 'additionalInformation', label: 'Additional Information' }
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field.key as keyof typeof formData];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    // Validate that at least one record type is selected
    if (!formData.recordTypes || formData.recordTypes.length === 0) {
      setToast({
        open: true,
        message: 'Please select at least one record type (PHI, PII, Intellectual Property, Government Records)',
        severity: "error"
      });
      return;
    }

    // Validate that at least one certification is selected
    if (!formData.certifications || formData.certifications.length === 0) {
      setToast({
        open: true,
        message: 'Please select at least one certification (PCI DSS, ISO 27001, or SOC 2)',
        severity: "error"
      });
      return;
    }

    if (missingFields.length > 0) {
      setToast({
        open: true,
        message: `Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`,
        severity: "error"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get current user ID from cookies
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        setToast({
          open: true,
          message: "User not found. Please login again.",
          severity: "error"
        });
        setIsSaving(false);
        return;
      }

      const user = JSON.parse(userCookie);
      const modifiedBy = user.id;

      // Prepare the data in the format expected by the API
      // Convert country code to country name for API
      const getCountryName = (countryCode: string): string => {
        if (!countryCode) return "";
        const country = COUNTRIES.find(c => c.value === countryCode);
        return country ? country.label : countryCode;
      };

      const updateData = {
        name: formData.orgName,
        desc: formData.additionalInformation || "",
        tags: formData.tags.filter(tag => tag.key && tag.value), // Filter out empty tags
        modifiedBy: modifiedBy, // Add the modifiedBy field
        businessContext: {
          industryVertical: formData.industryVertical,
          regionOfOperation: getCountryName(formData.regionOfOperation),
          numberOfEmployees: formData.numberOfEmployees,
          cisoName: formData.cisoName,
          cisoEmail: formData.cisoEmail,
          annualRevenue: cleanFinancialValue(formData.annualRevenue),
          riskAppetite: cleanFinancialValue(formData.riskAppetite),
          cybersecurityBudget: cleanFinancialValue(formData.cybersecurityBudget),
          insuranceCoverage: cleanFinancialValue(formData.insuranceCoverage),
          insuranceCarrier: formData.insuranceCarrier,
          numberOfClaims: formData.numberOfClaims,
          claimsValue: cleanFinancialValue(formData.claimsValue),
          regulators: formData.regulators,
          regulatoryRequirements: formData.regulatoryRequirements,
          additionalInformation: formData.additionalInformation,
          recordTypes: formData.recordTypes,
          piiRecordsCount: formData.piiRecordsCount,
          pfiRecordsCount: formData.pfiRecordsCount,
          phiRecordsCount: formData.phiRecordsCount,
          governmentRecordsCount: formData.governmentRecordsCount,
          certifications: formData.certifications,
          intellectualPropertyPercentage: formData.intellectualPropertyPercentage
        }
      };

      // Call the update API
      const response = await updateOrganization(orgId as string, updateData);

      // Show success toast
      setToast({
        open: true,
        message: "Organization updated successfully!",
        severity: "success"
      });

      // Redirect back to the organization details page after a short delay
      setTimeout(() => {
        router.push(`/orgManagement/${orgId}`);
      }, 1500);

    } catch (error) {
      setIsSaving(false);
      setToast({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to update organization',
        severity: "error"
      });
    }
  };

  if (!organization || !isFormReady) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading Org Edit Form...</Typography>
      </Box>
    );
  }


  return (
    <Box sx={{
      height: "calc(100vh - 72px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "#F0F2FB"
    }}>
      {/* Breadcrumb */}
      <Stack sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 2 }}>
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
                color: "#484848"
              }}
            >
              {organization.name}/
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
              Edit Org Details
            </Box>
          </Typography>
        </Box>
      </Stack>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Box sx={{ maxWidth: "880px", mx: "auto" }}>
          {/* Basic Details Section */}
          <Accordion
            defaultExpanded
            sx={{
              mb: 3,
              border: "1px solid #E7E7E8",
              borderRadius: "8px",
              overflow: "hidden",
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandLess />}
              sx={{
                backgroundColor: "#F0F2FB",
                height: "56px",
                px: 4,
                borderBottom: "1px solid #E7E7E8"
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Basic Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "#FFFFFF",
                p: 2
              }}
            >
              <Box sx={{ p: 2 }}>
                {/* Organization Logo */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Box sx={{ position: "relative", width: 80, height: 80 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        border: "2px solid #E7E7E8",
                        overflow: "hidden"
                      }}
                    >
                      <Image
                        src={organization.orgImage}
                        alt="org-logo"
                        width={80}
                        height={80}
                        style={{ borderRadius: "50%" }}
                      />
                    </Avatar>
                    {/* Gradient overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0000001F 0%, #0000003F 100%)",
                        pointerEvents: "none"
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "#04139A",
                        color: "white",
                        width: 24,
                        height: 24,
                        "&:hover": {
                          backgroundColor: "#04139A",
                          opacity: 0.9
                        }
                      }}
                    >
                      <CameraAlt sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Organization Name */}
                <Box sx={{ mb: 3 }}>
                  <TextFieldStyled
                    label="Org Name"
                    required
                    placeholder="Enter organization name"
                    value={formData.orgName}
                    onChange={(e) => handleInputChange("orgName", e.target.value)}
                  />
                </Box>

                {/* Tags Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#121212",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    mb: 2
                  }}>
                    Tags
                  </Typography>

                  {formData.tags.map((tag, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                      <FormControl sx={{ flex: 1 }}>
                        <InputLabel sx={{
                          color: "#484848",
                          fontSize: "14px",
                          fontWeight: 500,
                          "&.Mui-focused": { color: "#04139A" },
                        }}>
                          Key
                        </InputLabel>
                        <Select
                          value={tag.key}
                          onChange={(e) => handleTagChange(index, "key", e.target.value)}
                          label="Key"
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
                          <MenuItem value="Industry">Industry</MenuItem>
                          <MenuItem value="Size">Size</MenuItem>
                          <MenuItem value="Region">Region</MenuItem>
                          <MenuItem value="Type">Type</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Value"
                        value={tag.value}
                        onChange={(e) => handleTagChange(index, "value", e.target.value)}
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

                      <IconButton
                        onClick={() => removeTag(index)}
                        sx={{ color: "#757575" }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    startIcon={<Add />}
                    onClick={addNewTag}
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
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Business Context Section */}
          <Accordion defaultExpanded
            sx={{
              mb: 3,
              border: "1px solid #E7E7E8",
              borderRadius: "8px",
              overflow: "hidden",
              "&:before": { display: "none" }
            }}>
            <AccordionSummary
              expandIcon={<ExpandLess />}
              sx={{
                backgroundColor: "#F0F2FB",
                height: "56px",
                px: 4,
                borderBottom: "1px solid #E7E7E8"
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Business Context
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "#FFFFFF",
                p: 4
              }}>
              <Grid container spacing={3}>
                {/* Industry Section */}
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#121212",
                      mb: 2,
                    }}
                  >
                    Industry
                  </Typography>

                  {/* First row → 2 inputs */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Industry Vertical"
                        required
                        placeholder="Financial Services, Healthcare"
                        value={formData.industryVertical}
                        onChange={(e) => handleInputChange("industryVertical", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SelectStyled
                        label="Region of Operation"
                        required
                        name="regionOfOperation"
                        value={formData.regionOfOperation}
                        onChange={(e) => handleInputChange("regionOfOperation", e.target.value as string)}
                        renderValue={(value) => {
                          const option = COUNTRIES.find(opt => opt.value === value);
                          return option ? option.label : (value as string);
                        }}
                      >
                        {COUNTRIES.map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </SelectStyled>
                    </Grid>
                  </Grid>

                  {/* Second row → 1 input */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Number of employees globally"
                        required
                        placeholder="100"
                        value={formData.numberOfEmployees}
                        onChange={(e) => handleInputChange("numberOfEmployees", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #E7E7E8",
                    "&::before, &::after": { display: "none" },
                    my: 2,
                  }}
                />

                {/* CISO/Security Head Section */}
                <Grid size={12}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      mb: 2
                    }}
                  >
                    CISO/Security Head
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Name"
                        required
                        placeholder="Enter name"
                        value={formData.cisoName}
                        onChange={(e) => handleInputChange("cisoName", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Email"
                        required
                        placeholder="Enter email"
                        value={formData.cisoEmail}
                        onChange={(e) => handleInputChange("cisoEmail", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #E7E7E8",
                    "&::before, &::after": { display: "none" },
                    my: 2,
                  }}
                />

                {/* Revenue Section */}
                <Grid size={12}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      mb: 2
                    }}
                  >
                    Revenue
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Estimated Annual Revenue"
                        required
                        placeholder="$ Enter amount in dollars"
                        value={formData.annualRevenue}
                        onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Risk Appetite"
                        required
                        placeholder="$ Enter amount in dollars"
                        value={formData.riskAppetite}
                        onChange={(e) => handleInputChange("riskAppetite", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Allocated budget for cybersecurity operations"
                        required
                        placeholder="$ Enter amount in dollars"
                        value={formData.cybersecurityBudget}
                        onChange={(e) => handleInputChange("cybersecurityBudget", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #E7E7E8",
                    "&::before, &::after": { display: "none" },
                    my: 2,
                  }}
                />

                {/* Cyber Insurance and Claims Section */}
                <Grid size={12}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      mb: 2
                    }}
                  >
                    Cyber Insurance and Claims
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Insurance - Current Coverage"
                        required
                        placeholder="$ Enter amount in dollars"
                        value={formData.insuranceCoverage}
                        onChange={(e) => handleInputChange("insuranceCoverage", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Insurance - Current Carrier"
                        required
                        placeholder="Enter Insurance - Current Carrier"
                        value={formData.insuranceCarrier}
                        onChange={(e) => handleInputChange("insuranceCarrier", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="No. of claims (made in last 12 months)"
                        required
                        placeholder="Enter no. of claims"
                        value={formData.numberOfClaims}
                        onChange={(e) => handleInputChange("numberOfClaims", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Claims Value (made in last 12 months)"
                        required
                        placeholder="$ Enter amount in dollars"
                        value={formData.claimsValue}
                        onChange={(e) => handleInputChange("claimsValue", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #E7E7E8",
                    "&::before, &::after": { display: "none" },
                    my: 2,
                  }}
                />

                {/* Regulatory Information Section */}
                <Grid size={12}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      mb: 2
                    }}
                  >
                    Regulatory Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Who are your regulators?"
                        required
                        placeholder="Enter regulators"
                        value={formData.regulators}
                        onChange={(e) => handleInputChange("regulators", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="What are your regulatory requirements?"
                        required
                        placeholder="Example: GDPR, etc."
                        value={formData.regulatoryRequirements}
                        onChange={(e) => handleInputChange("regulatoryRequirements", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid #E7E7E8",
                    "&::before, &::after": { display: "none" },
                    my: 2,
                  }}
                />

                {/* Records Section */}
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#121212",
                      mb: 2,
                    }}
                  >
                    RECORDS
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#484848",
                      mb: 3,
                    }}
                  >
                    1. What kinds of records does the company deal with? Check all that apply: PHI, PII, Intellectual Property, Government Records.
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {[
                      "PII",
                      "PIII",
                      "PFI",
                      "PHI",
                      "Intellectual Property",
                      "Government Records"
                    ].map((recordType) => {
                      const isSelected = formData.recordTypes?.includes(recordType) || false;
                      return (
                        <Button
                          key={recordType}
                          onClick={() => {
                            const currentTypes = formData.recordTypes || [];
                            const newTypes = isSelected
                              ? currentTypes.filter(type => type !== recordType)
                              : [...currentTypes, recordType];
                            handleArrayFieldChange("recordTypes", newTypes);
                          }}
                          sx={{
                            borderRadius: "8px",
                            px: 1.5,
                            py: 1.5,
                            minWidth: "auto",
                            height: "34px",
                            backgroundColor: isSelected ? "#E7E7E8" : "#FFFFFF",
                            color: "#484848",
                            border: "1px solid #E7E7E8",
                            textTransform: "none",
                            fontSize: "14px",
                            lineHeight: "22px",
                            letterSpacing: "0px",
                            fontWeight: 400,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              backgroundColor: isSelected ? "#04139A" : "#FFFFFF",
                              border: isSelected ? "none" : "1px solid #9E9FA5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#FFFFFF",
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </Typography>
                            )}
                          </Box>
                          {recordType}
                        </Button>
                      );
                    })}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    How many Personal Identifiable Information (PII) records does the company hold, including those related to employees, customers, and partners?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter value"
                      required
                      placeholder="Enter value"
                      value={formData.piiRecordsCount}
                      onChange={(e) => handleInputChange("piiRecordsCount", e.target.value)}
                    />
                  </Grid>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    How many Personal Financial Information (PFI) records does the company hold, including those of employees, customers, and partners?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter value"
                      required
                      placeholder="Enter value"
                      value={formData.pfiRecordsCount}
                      onChange={(e) => handleInputChange("pfiRecordsCount", e.target.value)}
                    />
                  </Grid>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    How many Protected Health Information (PHI) records does the company currently have for employees, customers, and partners?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter value"
                      required
                      placeholder="Enter value"
                      value={formData.phiRecordsCount}
                      onChange={(e) => handleInputChange("phiRecordsCount", e.target.value)}
                    />
                  </Grid>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    How many government classified information records does the company hold?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter value"
                      required
                      placeholder="Enter value"
                      value={formData.governmentRecordsCount}
                      onChange={(e) => handleInputChange("governmentRecordsCount", e.target.value)}
                    />
                  </Grid>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    2. Did the organization obtain PCI DSS, ISO 27001, or SOC2 certification in the past year? Please check the appropriate boxes if any.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {[
                      "PCI DSS",
                      "ISO 27001",
                      "SOC 2",
                    ].map((certification) => {
                      const isSelected = formData.certifications?.includes(certification) || false;
                      return (
                        <Button
                          key={certification}
                          onClick={() => {
                            const currentCertifications = formData.certifications || [];
                            const newCertifications = isSelected
                              ? currentCertifications.filter(cert => cert !== certification)
                              : [...currentCertifications, certification];
                            handleArrayFieldChange("certifications", newCertifications);
                          }}
                          sx={{
                            borderRadius: "8px",
                            px: 1.5,
                            py: 1.5,
                            minWidth: "auto",
                            height: "34px",
                            backgroundColor: isSelected ? "#E7E7E8" : "#FFFFFF",
                            color: "#484848",
                            border: "1px solid #E7E7E8",
                            textTransform: "none",
                            fontSize: "14px",
                            lineHeight: "22px",
                            letterSpacing: "0px",
                            fontWeight: 400,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              backgroundColor: isSelected ? "#04139A" : "#FFFFFF",
                              border: isSelected ? "none" : "1px solid #9E9FA5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#FFFFFF",
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </Typography>
                            )}
                          </Box>
                          {certification}
                        </Button>
                      );
                    })}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    3. How much is the company&apos;s intellectual property and trade secrets worth as a percentage of its yearly revenue?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter in percentage"
                      required
                      placeholder="Enter in percentage"
                      value={formData.intellectualPropertyPercentage}
                      onChange={(e) => handleInputChange("intellectualPropertyPercentage", e.target.value)}
                    />
                  </Grid>

                  <Divider
                    sx={{
                      width: "100%",
                      borderBottom: "1px solid #E7E7E8",
                      "&::before, &::after": { display: "none" },
                      my: 2,
                    }}
                  />

                  {/* Additional Information Section */}
                  <Grid size={12}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#121212",
                        lineHeight: "100%",
                        letterSpacing: "0px",
                        mb: 2
                      }}
                    >
                      Additional Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <TextFieldStyled
                          label="Additional Information"
                          required
                          placeholder="Enter additional information"
                          value={formData.additionalInformation}
                          onChange={(e) => handleInputChange("additionalInformation", e.target.value)}
                          multiline
                          rows={4}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, mb: 8 }}>
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                height: "40px",
                width: "113px",
                borderColor: "#CD0303",
                color: "#CD0303",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "16px",
                p: "12px 32px"
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              sx={{
                height: "40px",
                width: "116px",
                backgroundColor: "#04139A",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "16px",
                p: "12px 32px",
                "&:hover": {
                  backgroundColor: "#04139A",
                  opacity: 0.9
                },
                "&:disabled": {
                  backgroundColor: "#CCCCCC",
                  color: "#666666"
                }
              }}
            >
              {isSaving ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress
                    size={20}
                    thickness={2}
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
                    }} />
                </Box>
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        message={toast.message}
        toastBorder={toast.severity === "success" ? "1px solid #147A50" : undefined}
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={toast.severity === "success" ? "#DDF5EB" : undefined}
        toastSeverity={toast.severity}
      />
    </Box>
  );
}

export default withAuth(EditOrgDetailsPage);
