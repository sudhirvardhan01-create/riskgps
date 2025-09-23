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
  Chip,
  Divider,
  OutlinedInput,
  Grid
} from "@mui/material";
import { ArrowBack, ExpandLess, Add, CameraAlt } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { Organization } from "@/types/organization";
import Image from "next/image";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";

// Mock data for organizations (same as in the main page)
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "MediCare Health",
    orgId: "ORG100001",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15",
    details: {
      industryVertical: "Healthcare",
      regionOfOperation: "US",
      employeeCount: 250,
      cisoName: "Dr. Sarah Johnson",
      cisoEmail: "sarah.johnson@medicare.com",
      annualRevenue: "$ 50,000,000",
      riskAppetite: "$ 5,000,000",
      cybersecurityBudget: "$ 2,500,000",
      insuranceCoverage: "$ 10,000,000",
      insuranceCarrier: "HealthCare Insurance Co.",
      claimsCount: "0",
      claimsValue: "$ 0",
      regulators: "FDA, HIPAA, CMS",
      regulatoryRequirements: "HIPAA, FDA 21 CFR Part 11, SOX",
      additionalInformation: "MediCare Health is a leading healthcare provider focused on patient care and data security compliance.",
      recordTypes: ["PHI", "PII", "Intellectual Property"],
      piiRecordsCount: "50000",
      pfiRecordsCount: "25000",
      phiRecordsCount: "100000",
      governmentRecordsCount: "500",
      certifications: ["HIPAA", "ISO 27001"],
      intellectualPropertyPercentage: "15"
    }
  },
  {
    id: "2",
    name: "FinTech Comp",
    orgId: "ORG100002",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15",
    details: {
      industryVertical: "Financial Services",
      regionOfOperation: "UK",
      employeeCount: 150,
      cisoName: "Michael Chen",
      cisoEmail: "michael.chen@fintech.com",
      annualRevenue: "$ 25,000,000",
      riskAppetite: "$ 3,000,000",
      cybersecurityBudget: "$ 1,500,000",
      insuranceCoverage: "$ 8,000,000",
      insuranceCarrier: "Financial Risk Insurance",
      claimsCount: "1",
      claimsValue: "$ 25,000",
      regulators: "FCA, PRA, ICO",
      regulatoryRequirements: "GDPR, PCI DSS, SOX",
      additionalInformation: "FinTech Comp specializes in digital banking solutions with a focus on security and compliance.",
      recordTypes: ["PII", "PFI", "Intellectual Property"],
      piiRecordsCount: "75000",
      pfiRecordsCount: "50000",
      phiRecordsCount: "0",
      governmentRecordsCount: "200",
      certifications: ["PCI DSS", "ISO 27001"],
      intellectualPropertyPercentage: "30"
    }
  },
  {
    id: "3",
    name: "EduSmart Global",
    orgId: "ORG100003",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15",
    details: {
      industryVertical: "Education Technology",
      regionOfOperation: "CA",
      employeeCount: 80,
      cisoName: "Lisa Rodriguez",
      cisoEmail: "lisa.rodriguez@edusmart.com",
      annualRevenue: "$ 15,000,000",
      riskAppetite: "$ 2,000,000",
      cybersecurityBudget: "$ 800,000",
      insuranceCoverage: "$ 5,000,000",
      insuranceCarrier: "EduTech Insurance",
      claimsCount: "0",
      claimsValue: "$ 0",
      regulators: "FERPA, COPPA, PIPEDA",
      regulatoryRequirements: "FERPA, COPPA, GDPR, PIPEDA",
      additionalInformation: "EduSmart Global provides educational technology solutions with strong focus on student data protection.",
      recordTypes: ["PII", "Intellectual Property"],
      piiRecordsCount: "30000",
      pfiRecordsCount: "5000",
      phiRecordsCount: "0",
      governmentRecordsCount: "50",
      certifications: ["SOC 2"],
      intellectualPropertyPercentage: "40"
    }
  },
  {
    id: "4",
    name: "Green Energy",
    orgId: "SH23978749",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15",
    details: {
      industryVertical: "Renewable Energy",
      regionOfOperation: "DE",
      employeeCount: 300,
      cisoName: "Hans Mueller",
      cisoEmail: "hans.mueller@greenenergy.com",
      annualRevenue: "$ 75,000,000",
      riskAppetite: "$ 7,500,000",
      cybersecurityBudget: "$ 3,000,000",
      insuranceCoverage: "$ 15,000,000",
      insuranceCarrier: "Energy Risk Insurance",
      claimsCount: "2",
      claimsValue: "$ 100,000",
      regulators: "Bundesnetzagentur, BSI",
      regulatoryRequirements: "GDPR, NIS Directive, ISO 27001",
      additionalInformation: "Green Energy is a leading renewable energy company with focus on grid security and data protection.",
      recordTypes: ["PII", "Intellectual Property", "Government Records"],
      piiRecordsCount: "40000",
      pfiRecordsCount: "15000",
      phiRecordsCount: "0",
      governmentRecordsCount: "1000",
      certifications: ["ISO 27001", "SOC 2"],
      intellectualPropertyPercentage: "35"
    }
  },
  {
    id: "5",
    name: "ABC Company",
    orgId: "ORG202451872",
    orgImage: "/orgImage.png",
    tags: {
      industry: "Healthcare",
      size: "Small (< 500 Employees)"
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
      additionalCount: 3
    },
    businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
    status: "active",
    lastUpdated: "2024-01-15",
    details: {
      industryVertical: "Health Care",
      regionOfOperation: "IN",
      employeeCount: 100,
      cisoName: "Vivek Kumar",
      cisoEmail: "vivekkumar@abccompany.com",
      annualRevenue: "$ 500,000,000",
      riskAppetite: "$ 30,000,000",
      cybersecurityBudget: "$ 35,000,000",
      insuranceCoverage: "$ 20,000,000",
      insuranceCarrier: "XYZ",
      claimsCount: "2",
      claimsValue: "$ 50,000",
      regulators: "FDA, HIPAA",
      regulatoryRequirements: "HIPAA, GDPR, SOX",
      additionalInformation: "This is a healthcare company focused on patient data management and compliance.",
      recordTypes: ["PII", "PHI", "Intellectual Property"],
      piiRecordsCount: "10000",
      pfiRecordsCount: "5000",
      phiRecordsCount: "15000",
      governmentRecordsCount: "100",
      certifications: ["HIPAA", "ISO 27001"],
      intellectualPropertyPercentage: "25"
    }
  }
];

interface Tag {
  key: string;
  value: string;
}

function EditOrgDetailsPage() {
  const router = useRouter();
  const { orgId, orgName, tags, businessContext } = router.query;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
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
    if (orgId) {
      console.log('Edit Org Details - orgId:', orgId);
      console.log('Edit Org Details - URL params:', { orgName, tags, businessContext });
      
      // Find organization by orgId
      let foundOrg = mockOrganizations.find(org => org.orgId === orgId);

      // If not found in mock data but orgId starts with "ORG" and has timestamp, create a new org
      if (!foundOrg && typeof orgId === 'string' && orgId.startsWith('ORG') && /^\d+$/.test(orgId.substring(3))) {
        console.log('Creating new organization from URL parameters');
        
        // Parse URL parameters directly for newly created organizations
        let parsedTags: any[] = [];
        let parsedBusinessContext: any = {};
        let orgNameFromURL = "";

        try {
          if (tags) {
            parsedTags = JSON.parse(tags as string);
            console.log('Parsed tags:', parsedTags);
          }
          if (businessContext) {
            parsedBusinessContext = JSON.parse(businessContext as string);
            console.log('Parsed business context:', parsedBusinessContext);
          }
          if (orgName) {
            orgNameFromURL = orgName as string;
            console.log('Organization name from URL:', orgNameFromURL);
          }
        } catch (error) {
          console.error('Error parsing URL parameters:', error);
        }

        // Convert tags array to object format
        const tagsObject: { [key: string]: string } = {};
        if (Array.isArray(parsedTags)) {
          parsedTags.forEach((tag: any) => {
            if (tag.key && tag.value) {
              tagsObject[tag.key] = tag.value;
            }
          });
        }

        foundOrg = {
          id: orgId,
          name: orgNameFromURL || "New Organization",
          orgId: orgId,
          orgImage: "/orgImage.png",
          tags: {
            industry: tagsObject.industry || "Healthcare",
            size: tagsObject.size || "Small (< 500 Employees)"
          },
          members: {
            avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"],
            additionalCount: 3
          },
          businessUnits: ["Retail Banking", "Lorem Ipsum", "Ipsum", "Unit 4", "Unit 5"],
          status: "active",
          lastUpdated: new Date().toISOString().split('T')[0],
          details: {
            industryVertical: parsedBusinessContext.industryVertical || "Health Care",
            regionOfOperation: parsedBusinessContext.regionOfOperation || "India",
            employeeCount: parseInt(parsedBusinessContext.numberOfEmployees) || 100,
            cisoName: parsedBusinessContext.cisoName || "Vivek Kumar",
            cisoEmail: parsedBusinessContext.cisoEmail || "vivekkumar@neworg.com",
            annualRevenue: parsedBusinessContext.annualRevenue || "$ 500,000,000",
            riskAppetite: parsedBusinessContext.riskAppetite || "$ 30,000,000",
            cybersecurityBudget: parsedBusinessContext.cybersecurityBudget || "$ 35,000,000",
            insuranceCoverage: parsedBusinessContext.insuranceCoverage || "$ 20,000,000",
            insuranceCarrier: parsedBusinessContext.insuranceCarrier || "XYZ",
            claimsCount: parsedBusinessContext.numberOfClaims || "-",
            claimsValue: parsedBusinessContext.claimsValue || "-",
            regulators: parsedBusinessContext.regulators || "",
            regulatoryRequirements: parsedBusinessContext.regulatoryRequirements || "",
            additionalInformation: parsedBusinessContext.additionalInformation || "",
            recordTypes: parsedBusinessContext.recordTypes || [],
            piiRecordsCount: parsedBusinessContext.piiRecordsCount || "",
            pfiRecordsCount: parsedBusinessContext.pfiRecordsCount || "",
            phiRecordsCount: parsedBusinessContext.phiRecordsCount || "",
            governmentRecordsCount: parsedBusinessContext.governmentRecordsCount || "",
            certifications: parsedBusinessContext.certifications || [],
            intellectualPropertyPercentage: parsedBusinessContext.intellectualPropertyPercentage || ""
          }
        };
        
        console.log('Created organization object:', foundOrg);
      }

      if (foundOrg) {
        setOrganization(foundOrg);
        
        // Set form data based on the organization data
        const newFormData = {
          orgName: foundOrg.name,
          industryVertical: foundOrg.details?.industryVertical || "Health Care",
          regionOfOperation: foundOrg.details?.regionOfOperation || "IN",
          numberOfEmployees: foundOrg.details?.employeeCount?.toString() || "100",
          cisoName: foundOrg.details?.cisoName || "",
          cisoEmail: foundOrg.details?.cisoEmail || "",
          annualRevenue: foundOrg.details?.annualRevenue || "",
          riskAppetite: foundOrg.details?.riskAppetite || "",
          cybersecurityBudget: foundOrg.details?.cybersecurityBudget || "",
          insuranceCoverage: foundOrg.details?.insuranceCoverage || "",
          insuranceCarrier: foundOrg.details?.insuranceCarrier || "",
          numberOfClaims: foundOrg.details?.claimsCount || "",
          claimsValue: foundOrg.details?.claimsValue || "",
          regulators: foundOrg.details?.regulators || "",
          regulatoryRequirements: foundOrg.details?.regulatoryRequirements || "",
          additionalInformation: foundOrg.details?.additionalInformation || "",
          recordTypes: foundOrg.details?.recordTypes || [],
          piiRecordsCount: foundOrg.details?.piiRecordsCount || "",
          pfiRecordsCount: foundOrg.details?.pfiRecordsCount || "",
          phiRecordsCount: foundOrg.details?.phiRecordsCount || "",
          governmentRecordsCount: foundOrg.details?.governmentRecordsCount || "",
          certifications: foundOrg.details?.certifications || [],
          intellectualPropertyPercentage: foundOrg.details?.intellectualPropertyPercentage || "",
          tags: [
            { key: "Industry", value: foundOrg.tags.industry },
            { key: "Size", value: foundOrg.tags.size }
          ]
        };
        console.log('Setting form data:', newFormData);
        setFormData(newFormData);
        setIsFormReady(true);
      } else {
        // If not found, redirect back to org management
        router.push('/org-management');
      }
    }
  }, [orgId, router, orgName, tags, businessContext]);

  const handleBackClick = () => {
    router.push(`/org-management/${orgId}`);
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

  const handleSave = () => {
    // Here you would typically save the data to your backend
    // For now, just redirect back to the organization details page
    router.push(`/org-management/${orgId}`);
  };

  if (!organization || !isFormReady) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
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
              <Typography sx={{ fontWeight: 600, fontSize: "16px", lineHeight: "150%", letterSpacing: "0px" }}>
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
                  <TextField
                    fullWidth
                    label="Org Name*"
                    value={formData.orgName}
                    onChange={(e) => handleInputChange("orgName", e.target.value)}
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
              <Typography sx={{ fontWeight: 600, fontSize: "16px", lineHeight: "150%", letterSpacing: "0px" }}>
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
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
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
                          const option = [
                            { value: "US", label: "United States" },
                            { value: "UK", label: "United Kingdom" },
                            { value: "CA", label: "Canada" },
                            { value: "AU", label: "Australia" },
                            { value: "DE", label: "Germany" },
                            { value: "FR", label: "France" },
                            { value: "IN", label: "India" }
                          ].find(opt => opt.value === value);
                          return option ? option.label : (value as string);
                        }}
                      >
                        <MenuItem value="">Select country</MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="UK">United Kingdom</MenuItem>
                        <MenuItem value="CA">Canada</MenuItem>
                        <MenuItem value="AU">Australia</MenuItem>
                        <MenuItem value="DE">Germany</MenuItem>
                        <MenuItem value="FR">France</MenuItem>
                        <MenuItem value="IN">India</MenuItem>
                      </SelectStyled>
                    </Grid>
                  </Grid>

                  {/* Second row → 1 input */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Number of employees globally"
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
                        placeholder="Enter name"
                        value={formData.cisoName}
                        onChange={(e) => handleInputChange("cisoName", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Email"
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
                        placeholder="Enter Insurance - Current Carrier"
                        value={formData.insuranceCarrier}
                        onChange={(e) => handleInputChange("insuranceCarrier", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="No. of claims (made in last 12 months)"
                        placeholder="Enter no. of claims"
                        value={formData.numberOfClaims}
                        onChange={(e) => handleInputChange("numberOfClaims", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="Claims Value (made in last 12 months)"
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
                        placeholder="Enter regulators"
                        value={formData.regulators}
                        onChange={(e) => handleInputChange("regulators", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextFieldStyled
                        label="What are your regulatory requirements?"
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
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#121212",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      mb: 2,
                    }}
                  >
                    RECORDS
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#484848",
                      lineHeight: "24px",
                      letterSpacing: "0px",
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
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "12px",
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
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "12px",
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
                    3. How much is the company's intellectual property and trade secrets worth as a percentage of its yearly revenue?
                  </Typography>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextFieldStyled
                      label="Enter in percentage"
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
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
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default withAuth(EditOrgDetailsPage);
