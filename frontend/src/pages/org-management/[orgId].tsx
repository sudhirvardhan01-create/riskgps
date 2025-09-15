import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Tabs, Tab, Chip, Stack, Avatar, IconButton } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { Organization } from "@/types/organization";
import Image from "next/image";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";

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
      regionOfOperation: "India",
      employeeCount: 100,
      cisoName: "Vivek Kumar",
      cisoEmail: "vivekkumar@abccompany.com",
      annualRevenue: "$ 500,000,000",
      riskAppetite: "$ 30,000,000",
      cybersecurityBudget: "$ 35,000,000",
      insuranceCoverage: "$ 20,000,000",
      insuranceCarrier: "XYZ",
      claimsCount: "-",
      claimsValue: "-"
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
  const { orgId } = router.query;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (orgId) {
      // Find organization by orgId
      const foundOrg = mockOrganizations.find(org => org.orgId === orgId);
      if (foundOrg) {
        setOrganization(foundOrg);
      } else {
        // If not found, redirect back to org management
        router.push('/org-management');
      }
    }
  }, [orgId, router]);

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="org details tabs">
          <Tab label="Org Details" />
          <Tab label="Repository" />
          <Tab label={`Business Units (${organization.businessUnits.length})`} />
          <Tab label={`Users (${organization.members.avatars.length + organization.members.additionalCount})`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6">Org Details</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ textTransform: "none" }}
            >
              Edit Org Details
            </Button>
          </Box>

          {/* Organization Details Content */}
          <Box sx={{ display: "grid", gap: 3 }}>
            {/* Industry Section */}
            <Box sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Industry</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Industry Vertical
                  </Typography>
                  <Typography variant="body1">{organization.details?.industryVertical || organization.tags.industry}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Region of Operation
                  </Typography>
                  <Typography variant="body1">{organization.details?.regionOfOperation || "India"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Number of employees globally
                  </Typography>
                  <Typography variant="body1">{organization.details?.employeeCount || 100}</Typography>
                </Box>
              </Box>
            </Box>

            {/* CISO/Security Head Section */}
            <Box sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>CISO/Security Head</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Name
                  </Typography>
                  <Typography variant="body1">{organization.details?.cisoName || "Vivek Kumar"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1">{organization.details?.cisoEmail || "vivekkumar@abccompany.com"}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Revenue Section */}
            <Box sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Revenue</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Estimated Annual Revenue
                  </Typography>
                  <Typography variant="body1">{organization.details?.annualRevenue || "$ 500,000,000"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Risk Appetite
                  </Typography>
                  <Typography variant="body1">{organization.details?.riskAppetite || "$ 30,000,000"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Allocated budget for cybersecurity operations
                  </Typography>
                  <Typography variant="body1">{organization.details?.cybersecurityBudget || "$ 35,000,000"}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Cyber Insurance and Claims Section */}
            <Box sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Cyber Insurance and Claims</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Insurance - Current Coverage
                  </Typography>
                  <Typography variant="body1">{organization.details?.insuranceCoverage || "$ 20,000,000"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Insurance - Current Carrier
                  </Typography>
                  <Typography variant="body1">{organization.details?.insuranceCarrier || "XYZ"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    No. of claims (made in last 12 months)
                  </Typography>
                  <Typography variant="body1">{organization.details?.claimsCount || "-"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Claims Value (made in last 12 months)
                  </Typography>
                  <Typography variant="body1">{organization.details?.claimsValue || "-"}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Regulatory Information Section */}
            <Box sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Regulatory Information</Typography>
              <Typography variant="body2" color="text.secondary">
                No regulatory information available
              </Typography>
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
          <Typography variant="h6" sx={{ mb: 2 }}>Business Units</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {organization.businessUnits.map((unit, index) => (
              <Chip key={index} label={unit} variant="outlined" />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {organization.members.avatars.map((avatar, index) => (
              <Avatar key={index} src={avatar} sx={{ width: 32, height: 32 }} />
            ))}
            {organization.members.additionalCount > 0 && (
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                +{organization.members.additionalCount}
              </Avatar>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default withAuth(OrgDetailsPage);
