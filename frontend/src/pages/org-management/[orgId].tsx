import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Chip, Stack, Avatar, IconButton, Divider, Dialog, DialogContent } from "@mui/material";
import { ArrowBack, Edit, Close } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { Organization } from "@/types/organization";
import Image from "next/image";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { BusinessUnits } from "@/components/Organization/BusinessUnit";

// Mock data for organizations (same as in container)
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
    lastUpdated: "2024-01-15"
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
    lastUpdated: "2024-01-15"
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
    lastUpdated: "2024-01-15"
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
    lastUpdated: "2024-01-15"
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`org-tabpanel-${index}`}
      aria-labelledby={`org-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function OrgDetailsPage() {
  const router = useRouter();
  const { orgId, orgName, tags, businessContext } = router.query;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<{
    orgName?: string;
    tags?: any;
    businessContext?: any;
  }>({});

  // Parse form data from URL parameters
  useEffect(() => {
    if (orgName || tags || businessContext) {
      try {
        const parsedTags = tags ? JSON.parse(tags as string) : [];
        const parsedBusinessContext = businessContext ? JSON.parse(businessContext as string) : {};

        setFormData({
          orgName: orgName as string,
          tags: parsedTags,
          businessContext: parsedBusinessContext
        });
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
  }, [orgName, tags, businessContext]);

  useEffect(() => {
    if (orgId) {
      // Find organization by orgId
      let foundOrg = mockOrganizations.find(org => org.orgId === orgId);

      // If not found in mock data but orgId starts with "ORG" and has timestamp, create a new org
      if (!foundOrg && typeof orgId === 'string' && orgId.startsWith('ORG') && /^\d+$/.test(orgId.substring(3))) {
        // Use form data if available, otherwise use defaults
        const orgNameFromForm = formData.orgName || "New Organization";
        const tagsFromForm = formData.tags || [];
        const businessContextFromForm = formData.businessContext || {};

        // Convert tags array to object format
        const tagsObject: { [key: string]: string } = {};
        if (Array.isArray(tagsFromForm)) {
          tagsFromForm.forEach((tag: any) => {
            if (tag.key && tag.value) {
              tagsObject[tag.key] = tag.value;
            }
          });
        }

        foundOrg = {
          id: orgId,
          name: orgNameFromForm,
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
            industryVertical: businessContextFromForm.industryVertical || "Health Care",
            regionOfOperation: businessContextFromForm.regionOfOperation || "India",
            employeeCount: parseInt(businessContextFromForm.numberOfEmployees) || 100,
            cisoName: businessContextFromForm.cisoName || "Vivek Kumar",
            cisoEmail: businessContextFromForm.cisoEmail || "vivekkumar@neworg.com",
            annualRevenue: businessContextFromForm.annualRevenue || "$ 500,000,000",
            riskAppetite: businessContextFromForm.riskAppetite || "$ 30,000,000",
            cybersecurityBudget: businessContextFromForm.cybersecurityBudget || "$ 35,000,000",
            insuranceCoverage: businessContextFromForm.insuranceCoverage || "$ 20,000,000",
            insuranceCarrier: businessContextFromForm.insuranceCarrier || "XYZ",
            claimsCount: businessContextFromForm.numberOfClaims || "-",
            claimsValue: businessContextFromForm.claimsValue || "-"
          }
        };
      }

      if (foundOrg) {
        setOrganization(foundOrg);
      } else {
        // If not found, redirect back to org management
        router.push('/org-management');
      }
    }
  }, [orgId, router, formData]);

  useEffect(() => {
    // Check if showSuccess query parameter is present
    if (router.query.showSuccess === 'true') {
      setShowSuccessPopup(true);

      // Auto-hide popup after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        // Remove the query parameter from URL
        router.replace(`/org-management/${orgId}`, undefined, { shallow: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router.query.showSuccess, orgId, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    router.push('/org-management');
  };

  if (!organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Box sx={{
      height: "calc(100vh - 72px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "#FFFFFF"
    }}>
      {/* Breadcrumb */}
      <Stack sx={{ backgroundColor: "#F0F2FB", height: "228px", pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, pl: 2, }}>
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
              {organization.name}
            </Box>
          </Typography>
        </Box>

        {/* Organization Header */}
        <Box sx={{ pl: 8, mb: 2 }}>
          {/* Logo and Company Name on same line */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ mr: 2, position: "relative", width: 48, height: 48 }}>
              <Image
                src={organization.orgImage}
                alt="org-image"
                width={48}
                height={48}
                style={{ borderRadius: "48px" }}
              />
              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#0000001F",
                  borderRadius: "48px",
                }}
              />
            </Box>
            <Typography sx={{ fontWeight: 500, color: "#484848", fontSize: "32px", lineHeight: "130%", letterSpacing: "0%" }}>
              {organization.name}
            </Typography>
          </Box>

          {/* Details row below */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: "16px", fontWeight: 400, lineHeight: "130%", letterSpacing: 0, color: "#484848" }}>
              #{organization.orgId}
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#9E9FA5",
              }}
            />
            <Typography sx={{ fontSize: "16px", fontWeight: 400, lineHeight: "130%", letterSpacing: 0, color: "#484848" }}>
              Org Size: {organization.details?.employeeCount || 100} employees
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#9E9FA5",
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ToggleSwitch
                sx={{ m: 0 }}
                checked={organization.status === "active"}
              />
              <Typography
                variant="body2"
                sx={{
                  color: organization.status === "active" ? "#147A50" : "#757575",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {organization.status === "active" ? "Active" : "Disabled"}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#9E9FA5",
              }}
            />
            <Chip
              label={`Industry - ${organization.tags.industry}`}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "4px",
                border: "1px solid #E7E7E8",
                backgroundColor: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "130%",
                letterSpacing: "0",
                "& .MuiChip-label": {
                  padding: "7px 12px",
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>

      {/* Tabs */}
      <Box
        sx={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 20px 0px #002F7514",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="org details tabs"
          centered
          sx={{
            height: "64px",
            "& .MuiTabs-flexContainer": {
              height: "100%",
            },
            "& .MuiTab-root": {
              height: "100%",
              minHeight: "64px",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "160%",
              letterSpacing: "0%",
              textTransform: "none",
              "&.Mui-selected": {
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Org Details" />
          <Tab label="Repository" />
          <Tab label={`Business Units (${organization.businessUnits?.length || 0})`} />
          <Tab label={`Users`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 3, mt: 2 }}>
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
              onClick={() => router.push(`/org-management/${orgId}/edit-org-details`)}
            >
              <Edit sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "inherit", lineHeight: "130%", letterSpacing: "0%" }}>
                Edit Org Details
              </Typography>
            </Box>
          </Box>

          {/* Organization Details Content */}
          <Box sx={{ display: "grid", gap: 3 }}>
            {/* Industry Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Industry</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Industry Vertical
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.industryVertical || organization.tags.industry}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Region of Operation
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.regionOfOperation || "India"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Number of employees globally
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.employeeCount || 100}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Display form company tags if available */}
            {formData.tags && Array.isArray(formData.tags) && formData.tags.length > 0 && <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Additional Tags from Form</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.tags.map((tag: any, index: number) => (
                      <Chip
                        key={index}
                        label={`${capitalizeFirstLetter(tag.key)}: ${tag.value}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                          border: "1px solid #E7E7E8",
                          backgroundColor: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: 400,
                          lineHeight: "130%",
                          letterSpacing: "0",
                          "& .MuiChip-label": {
                            padding: "4px 8px",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>}

            {/* CISO/Security Head Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>CISO/Security Head</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Name
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.cisoName || "Vivek Kumar"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Email
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.cisoEmail || "vivekkumar@abccompany.com"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Revenue Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Revenue</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Estimated Annual Revenue
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.annualRevenue || "$ 500,000,000"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Risk Appetite
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.riskAppetite || "$ 30,000,000"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Allocated budget for cybersecurity operations
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.cybersecurityBudget || "$ 35,000,000"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Cyber Insurance and Claims Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Cyber Insurance and Claims</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "100px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Insurance - Current Coverage
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.insuranceCoverage || "$ 20,000,000"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    No. of claims (made in last 12 months)
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.insuranceCarrier || "XYZ"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    No. of claims (made in last 12 months)
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.claimsCount || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Claims Value (made in last 12 months)
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {organization.details?.claimsValue || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Regulatory Information Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Regulatory Information</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "150px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Who are your regulators?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.regulators || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    What are your regulatory requirements?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.regulatoryRequirements || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Records section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", minHeight: "432px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Records</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />

              {/* Question 1: Types of records */}
              <Box sx={{ mb: 3 }}>
                <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                  What kinds of records does the company deal with? Check all that apply: PHI, PII, Intellectual Property, Government Records.
                </Typography>
                <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                  {formData.businessContext?.recordTypes && Array.isArray(formData.businessContext.recordTypes) && formData.businessContext.recordTypes.length > 0
                    ? formData.businessContext.recordTypes.join(", ")
                    : "PII, PFI, PHI, Government Records"
                  }
                </Typography>
              </Box>

              {/* Question 2: PII records count */}
              <Box sx={{ ml: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    How many Personal Identifiable Information (PII) records does the company hold, including those related to employees, customers, and partners?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.piiRecordsCount || "1000"}
                  </Typography>
                </Box>

                {/* Question 3: PFI records count */}
                <Box sx={{ mb: 3 }}>
                  <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    How many Personal Financial Information (PFI) records does the company hold, including those of employees, customers, and partners?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.pfiRecordsCount || "1000"}
                  </Typography>
                </Box>

                {/* Question 4: PHI records count */}
                <Box sx={{ mb: 3 }}>
                  <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    How many Protected Health Information (PHI) records does the company currently have for employees, customers, and partners?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.phiRecordsCount || "2000"}
                  </Typography>
                </Box>

                {/* Question 5: Government records count */}
                <Box sx={{ mb: 3 }}>
                  <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    How many government classified information records does the company hold?
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.governmentRecordsCount || "100"}
                  </Typography>
                </Box>
              </Box>

              {/* Question 6: Certifications */}
              <Box sx={{ mb: 3 }}>
                <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                  Did the organization obtain PCI DSS, ISO 27001, or SOC2 certification in the past year? Please check the appropriate boxes if any.
                </Typography>
                <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                  {formData.businessContext?.certifications && Array.isArray(formData.businessContext.certifications) && formData.businessContext.certifications.length > 0
                    ? formData.businessContext.certifications.join(", ")
                    : "PCI DSS"
                  }
                </Typography>
              </Box>

              {/* Question 7: Intellectual property value */}
              <Box sx={{ mb: 3 }}>
                <Typography color="#91939A" sx={{ mb: 1, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                  How much is the company's intellectual property and trade secrets worth as a percentage of its yearly revenue?
                </Typography>
                <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                  {formData.businessContext?.intellectualPropertyPercentage || "30"}%
                </Typography>
              </Box>
            </Box>

            {/* Additional Information Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", minHeight: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Additional Information</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "100px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Additional Information
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {formData.businessContext?.additionalInformation || "-"}
                  </Typography>
                </Box>
              </Box>

              {/* Display form data summary */}
              {formData.orgName && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: "#F8F9FA", borderRadius: "8px", border: "1px solid #E9ECEF" }}>
                  <Typography sx={{ mb: 2, fontWeight: 600, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px", color: "#04139A" }}>
                    Form Submission Summary
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
                    <Box>
                      <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                        Organization Name
                      </Typography>
                      <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                        {formData.orgName}
                      </Typography>
                    </Box>
                    {formData.businessContext?.regulators && (
                      <Box>
                        <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                          Regulators
                        </Typography>
                        <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                          {formData.businessContext.regulators}
                        </Typography>
                      </Box>
                    )}
                    {formData.businessContext?.regulatoryRequirements && (
                      <Box>
                        <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                          Regulatory Requirements
                        </Typography>
                        <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                          {formData.businessContext.regulatoryRequirements}
                        </Typography>
                      </Box>
                    )}
                    {formData.businessContext?.recordTypes && Array.isArray(formData.businessContext.recordTypes) && formData.businessContext.recordTypes.length > 0 && (
                      <Box>
                        <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                          Record Types
                        </Typography>
                        <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                          {formData.businessContext.recordTypes.join(", ")}
                        </Typography>
                      </Box>
                    )}
                    {formData.businessContext?.certifications && Array.isArray(formData.businessContext.certifications) && formData.businessContext.certifications.length > 0 && (
                      <Box>
                        <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                          Certifications
                        </Typography>
                        <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                          {formData.businessContext.certifications.join(", ")}
                        </Typography>
                      </Box>
                    )}
                    {formData.businessContext?.intellectualPropertyPercentage && (
                      <Box>
                        <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                          IP Value (% of Revenue)
                        </Typography>
                        <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                          {formData.businessContext.intellectualPropertyPercentage}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Activity Section */}
            <Box sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px", height: "120px" }}>
              <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "16px", lineHeight: "100%", letterSpacing: "0px" }}>Activity</Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Created On
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {"07 Feb, 2024"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Created By
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {"Karan Gautam"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="#91939A" sx={{ mb: 0.5, fontWeight: 500, fontSize: "12px", lineHeight: "130%", letterSpacing: "0px" }}>
                    Last Updated
                  </Typography>
                  <Typography color="#484848" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: "130%", letterSpacing: "0px" }}>
                    {"08 Feb, 2024"}
                  </Typography>
                </Box>
              </Box>
            </Box>

          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>Repository</Typography>
          <Typography variant="body2" color="text.secondary">
            Repository content will be displayed here.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BusinessUnits />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
          <Typography variant="body2" color="text.secondary">
            Users will be displayed here.
          </Typography>
        </TabPanel>
      </Box>

      {/* Success Popup Dialog */}
      <Dialog
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        PaperProps={{
          sx: {
            width: "373px",
            height: "241px",
            borderRadius: "10px",
            border: "1px solid #E7E7E7",
            backgroundColor: "#FFFFFF",
            position: "relative",
            boxShadow: "none",
            margin: "auto",
          }
        }}
      >
        <DialogContent sx={{
          p: "48px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          height: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
          "&.MuiDialogContent-root": {
            padding: "48px"
          }
        }}>
          {/* Close button */}
          <IconButton
            onClick={() => setShowSuccessPopup(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#9E9FA5",
              "&:hover": {
                color: "#484848",
              }
            }}
          >
            <Close />
          </IconButton>

          {/* Success icon */}
          <Box sx={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <Image
              src={"/success_Icons.png"}
              alt="success-Icons"
              width={64}
              height={64}
            />
          </Box>

          {/* Success message */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#484848",
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0px",
              flexShrink: 0
            }}
          >
            Success
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#484848",
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "0px",
              fontWeight: 400,
              flexShrink: 0,
              whiteSpace: "nowrap"
            }}
          >
            {organization?.name || "Organization"} has been successfully created
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default withAuth(OrgDetailsPage);
