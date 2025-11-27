import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  Stack,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  SxProps,
  Theme,
  Button,
  Popover,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Edit, Close } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import { Organization } from "@/types/organization";
import Image from "next/image";
import ToggleSwitch from "@/components/Library/ToggleSwitch/ToggleSwitch";
import { BusinessUnits } from "@/components/Organization/BusinessUnit";
import { getOrganizationById } from "@/services/organizationService";
import OrgDetailsTypography from "@/components/OrgDetailsTypography/OrgDetailsTypography";
import ToastComponent from "@/components/ToastComponent";
import Repository from "@/components/Repository/Repository";
import Cookies from "js-cookie";
import { useLibraryImport } from "@/hooks/useLibraryImport";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`org-tabpanel-${index}`}
      aria-labelledby={`org-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
}

function OrgDetailsPage() {
  const router = useRouter();
  const { orgId, orgName, tags, businessContext, tab } = router.query;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    orgName?: string;
    tags?: any;
    businessContext?: any;
  }>({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "warning" | "info" | "success",
  });
  const [user, setUser] = useState<{ role?: string; orgId?: string }>({});
  const [importModalAnchor, setImportModalAnchor] = useState<HTMLButtonElement | null>(null);
  const [importSelections, setImportSelections] = useState({
    riskScenario: false,
    process: false,
    assets: false,
  });

  // WebSocket integration for library import
  const { importStatus, startImport, stopImport, resetStatus } = useLibraryImport();

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  // Parse form data from URL parameters
  useEffect(() => {
    if (orgName || tags || businessContext) {
      try {
        const parsedTags = tags ? JSON.parse(tags as string) : [];
        const parsedBusinessContext = businessContext
          ? JSON.parse(businessContext as string)
          : {};

        setFormData({
          orgName: orgName as string,
          tags: parsedTags,
          businessContext: parsedBusinessContext,
        });
      } catch (error) {
        setToast({
          open: true,
          message: "Error parsing form data. Please try again.",
          severity: "error",
        });
      }
    }
  }, [orgName, tags, businessContext]);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId) return;

      setLoading(true);

      try {
        // First try to fetch from API
        const apiResponse = await getOrganizationById(orgId as string);

        // Transform API response to match Organization interface
        const transformedOrg: Organization = {
          id: apiResponse.data.organizationId,
          name: apiResponse.data.name,
          orgId: apiResponse.data.organizationId,
          orgCode: apiResponse.data.orgCode,
          orgImage: "/orgImage.png", // Default image since API doesn't provide this
          tags: (() => {
            // Convert API tags array to object format
            const tagsObject: { [key: string]: string } = {};
            if (apiResponse.data.tags && Array.isArray(apiResponse.data.tags)) {
              apiResponse.data.tags.forEach((tag: any) => {
                if (tag.key && tag.value) {
                  tagsObject[tag.key] = tag.value;
                }
              });
            }

            // Ensure size is always present
            if (!tagsObject.Size && !tagsObject.size) {
              if (apiResponse.data.numberOfEmployees) {
                tagsObject.size =
                  apiResponse.data.numberOfEmployees < 500
                    ? "Small (< 500 Employees)"
                    : apiResponse.data.numberOfEmployees < 2000
                    ? "Medium (500-2000 Employees)"
                    : "Large (> 2000 Employees)";
              } else {
                tagsObject.size = "Unknown";
              }
            }

            // Ensure industry is always present
            if (!tagsObject.Industry && !tagsObject.industry) {
              tagsObject.industry =
                apiResponse.data.industryVertical || "Unknown";
            }

            // Return the tags object with guaranteed industry and size properties
            return tagsObject as {
              industry: string;
              size: string;
              [key: string]: string;
            };
          })(),
          members: {
            avatars: [], // Empty array - API doesn't return member data
            additionalCount: 0,
          },
          businessUnits:
            apiResponse.data.businessUnits &&
            apiResponse.data.businessUnits.length > 0
              ? apiResponse.data.businessUnits.map((bu: any) => bu.name || bu)
              : [], // Use API data or empty array
          status: apiResponse.data.isDeleted ? "disabled" : "active", // Use isDeleted flag from API
          lastUpdated: apiResponse.data.modifiedDate
            ? new Date(apiResponse.data.modifiedDate)
                .toISOString()
                .split("T")[0]
            : new Date().toISOString().split("T")[0],
          createdDate: apiResponse.data.createdDate || "-",
          modifiedDate: apiResponse.data.modifiedDate || "-",
          createdBy: apiResponse.data.createdBy || "-",
          details: {
            industryVertical: apiResponse.data.industryVertical || "-",
            regionOfOperation: apiResponse.data.regionOfOperation || "-",
            employeeCount: apiResponse.data.numberOfEmployees || "-",
            cisoName: apiResponse.data.cisoName || "-",
            cisoEmail: apiResponse.data.cisoEmail || "-",
            annualRevenue: apiResponse.data.annualRevenue
              ? `$ ${parseInt(apiResponse.data.annualRevenue).toLocaleString()}`
              : "-",
            riskAppetite: apiResponse.data.riskAppetite
              ? `$ ${parseInt(apiResponse.data.riskAppetite).toLocaleString()}`
              : "-",
            cybersecurityBudget: apiResponse.data.cybersecurityBudget
              ? `$ ${parseInt(
                  apiResponse.data.cybersecurityBudget
                ).toLocaleString()}`
              : "-",
            insuranceCoverage: apiResponse.data.insuranceCoverage
              ? `$ ${parseInt(
                  apiResponse.data.insuranceCoverage
                ).toLocaleString()}`
              : "-",
            insuranceCarrier: apiResponse.data.insuranceCarrier || "-",
            claimsCount: apiResponse.data.numberOfClaims?.toString() || "-",
            claimsValue: apiResponse.data.claimsValue
              ? `$ ${parseInt(apiResponse.data.claimsValue).toLocaleString()}`
              : "-",
            regulators: apiResponse.data.regulators || "-",
            regulatoryRequirements:
              apiResponse.data.regulatoryRequirements || "-",
            additionalInformation:
              apiResponse.data.additionalInformation || "-",
            recordTypes: apiResponse.data.recordTypes || ["-", "-", "-"],
            piiRecordsCount:
              apiResponse.data.piiRecordsCount?.toString() || "-",
            pfiRecordsCount:
              apiResponse.data.pfiRecordsCount?.toString() || "-",
            phiRecordsCount:
              apiResponse.data.phiRecordsCount?.toString() || "-",
            governmentRecordsCount:
              apiResponse.data.governmentRecordsCount?.toString() || "-",
            certifications: apiResponse.data.certifications || ["-"],
            intellectualPropertyPercentage:
              apiResponse.data.intellectualPropertyPercentage?.toString() ||
              "-",
          },
        };

        setOrganization(transformedOrg);
      } catch (apiError) {
        setToast({
          open: true,
          message: "Failed to load organization. Please try again.",
          severity: "error",
        });
        // If API fails, redirect back to org management after showing error
        setTimeout(() => {
          router.push("/orgManagement");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId, router, formData]);

  useEffect(() => {
    if (!router.isReady || !orgId) return;

    // Check if showSuccess query parameter is present and equals "true"
    const showSuccessParam = router.query.showSuccess;
    const showSuccess = showSuccessParam === "true" || 
                       (Array.isArray(showSuccessParam) && showSuccessParam[0] === "true");
    
    if (showSuccess) {
      setShowSuccessPopup(true);

      // Auto-hide popup after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        // Remove the query parameter from URL
        router.replace(`/orgManagement/${orgId}`, undefined, { shallow: true });
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [router.isReady, router.query.showSuccess, orgId, router]);

  // Handle tab query parameter
  useEffect(() => {
    if (tab && typeof tab === "string") {
      const tabIndex = parseInt(tab, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setTabValue(tabIndex);
      }
    } else if (!tab && router.isReady) {
      // If no tab parameter exists, add it to the URL with default value (0)
      router.replace(`/orgManagement/${orgId}?tab=0`, undefined, {
        shallow: true,
      });
    }
  }, [tab, router.isReady, orgId, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update URL with tab parameter
    router.push(`/orgManagement/${orgId}?tab=${newValue}`, undefined, {
      shallow: true,
    });
  };

  const handleBackClick = () => {
    router.push("/orgManagement");
  };

  const handleImportLibraryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setImportModalAnchor(event.currentTarget);
  };

  const handleImportModalClose = () => {
    setImportModalAnchor(null);
    // Only reset status if import is not in progress
    if (!importStatus.isImporting) {
      resetStatus();
      // Reset selections
      setImportSelections({
        riskScenario: false,
        process: false,
        assets: false,
      });
    }
  };

  const handleCheckboxChange = (key: keyof typeof importSelections) => {
    setImportSelections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleImport = async () => {
    if (!orgId || typeof orgId !== "string") {
      setToast({
        open: true,
        message: "Organization ID is required",
        severity: "error",
      });
      return;
    }

    // Build selectedLibrary array based on importSelections
    const selectedLibrary: string[] = [];
    if (importSelections.riskScenario) {
      selectedLibrary.push("risk-scenarios");
    }
    if (importSelections.process) {
      selectedLibrary.push("process");
    }
    if (importSelections.assets) {
      selectedLibrary.push("assets");
    }

    // Check if at least one library is selected
    if (selectedLibrary.length === 0) {
      setToast({
        open: true,
        message: "Please select at least one library to import",
        severity: "warning",
      });
      return;
    }

    try {
      // Start import using WebSocket hook
      await startImport(orgId as string, selectedLibrary);
      
      // Close modal immediately - import is now running in background
      handleImportModalClose();
      
      // Reset selections after starting import
      setImportSelections({
        riskScenario: false,
        process: false,
        assets: false,
      });
    } catch (error: any) {
      setToast({
        open: true,
        message: error.message || "Failed to start import",
        severity: "error",
      });
      resetStatus();
    }
  };

  // Handle import status changes from WebSocket
  useEffect(() => {
    if (importStatus.status === "completed") {
      setToast({
        open: true,
        message: importStatus.message || "Library imported successfully",
        severity: "success",
      });
      resetStatus();
    } else if (importStatus.status === "error") {
      setToast({
        open: true,
        message: importStatus.message || "Failed to import library",
        severity: "error",
      });
      resetStatus();
    } else if (importStatus.status === "stopped") {
      setToast({
        open: true,
        message: importStatus.message || "Import stopped",
        severity: "warning",
      });
      resetStatus();
    }
  }, [importStatus.status, importStatus.message, resetStatus]);


  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography>Loading organization details...</Typography>
      </Box>
    );
  }

  if (!organization) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Organization not found</Typography>
      </Box>
    );
  }

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 72px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Breadcrumb */}
      <Stack sx={{ backgroundColor: "#F0F2FB", pt: 1, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, pl: 2 }}>
          <IconButton
            onClick={handleBackClick}
            sx={{
              mr: 1,
              visibility: user?.role === "Admin" ? "visible" : "hidden",
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#484848",
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
                color: "#04139A",
              }}
            >
              {organization.name}
            </Box>
          </Typography>
        </Box>

        {/* Organization Header */}
        <Box sx={{ pl: 8, mb: 2 }}>
          {/* Logo and Company Name on same line */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, mr: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  mr: 2,
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "30px",
                  overflow: "hidden",
                  backgroundColor: "#91939A",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: "22px",
                    fontWeight: 600,
                    zIndex: 2,
                  }}
                >
                  {organization.name?.charAt(0)?.toUpperCase() || "?"}
                </Box>
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
                    zIndex: 1,
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 500, color: "#484848" }}>
                {organization.name}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleImportLibraryClick}
              disabled={importStatus.isImporting}
              startIcon={
                importStatus.isImporting ? (
                  <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                ) : null
              }
              sx={{
                backgroundColor: "#04139A",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#030d6b",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#04139A",
                  color: "#FFFFFF",
                  opacity: 0.7,
                },
              }}
            >
              {importStatus.isImporting
                ? importStatus.message || "Importing..."
                : "Import Library"}
            </Button>
          </Box>

          {/* Details row below */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ flexWrap: "wrap" }}
          >
            <Typography variant="body1" sx={{ color: "#484848" }}>
              #
              {organization.orgCode && organization.orgCode.length > 15
                ? organization.orgCode.substring(0, 15) + "..."
                : organization.orgCode || organization.orgId || "-"}
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#9E9FA5",
              }}
            />
            <Typography variant="body1" sx={{ color: "#484848" }}>
              Org Size: {(organization.details?.employeeCount ?? 100).toLocaleString()} employees
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
                  color:
                    organization.status === "active" ? "#147A50" : "#757575",
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
            {/* Render all tags from API as chips, except Size */}
            {organization.tags &&
              Object.entries(organization.tags).map(([key, value]) => {
                // Skip the size tag as requested
                if (key === "size") return null;

                return (
                  <Chip
                    key={key}
                    label={`${capitalizeFirstLetter(key)} - ${value}`}
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
                );
              })}
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
          <Tab
            label={`Business Units (${
              organization.businessUnits?.length || 0
            })`}
          />
          <Tab label={`Users`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TabPanel value={tabValue} index={0} sx={{ pr: "80px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 3,
            }}
          >
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
              onClick={() =>
                router.push(`/orgManagement/${orgId}/editOrgDetails`)
              }
            >
              <Edit sx={{ fontSize: 16 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "inherit" }}
              >
                Edit Org Details
              </Typography>
            </Box>
          </Box>

          {/* Organization Details Content */}
          <Box sx={{ display: "grid", gap: 3, pl: "60px" }}>
            {/* Industry Section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Industry
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>Industry Vertical</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.industryVertical ||
                      organization.tags?.industry ||
                      "-"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    Region of Operation
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.regionOfOperation || "India"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    Number of employees globally
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {(organization.details?.employeeCount ?? 100).toLocaleString()}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* CISO/Security Head Section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                CISO/Security Head
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>Name</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.cisoName || "Vivek Kumar"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>Email</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.cisoEmail ||
                      "vivekkumar@abccompany.com"}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* Revenue Section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Revenue
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>
                    Estimated Annual Revenue
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.annualRevenue || "$ 500,000,000"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>Risk Appetite</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.riskAppetite || "$ 30,000,000"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    Allocated budget for cybersecurity operations
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.cybersecurityBudget ||
                      "$ 35,000,000"}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* Cyber Insurance and Claims Section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Cyber Insurance and Claims
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "100px" }}>
                <Box>
                  <OrgDetailsTypography>
                    Insurance - Current Coverage
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.insuranceCoverage || "$ 20,000,000"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    No. of claims (made in last 12 months)
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.insuranceCarrier || "XYZ"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    No. of claims (made in last 12 months)
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.claimsCount || "-"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    Claims Value (made in last 12 months)
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.claimsValue || "-"}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* Regulatory Information Section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Regulatory Information
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "150px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>
                    Who are your regulators?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.regulators ||
                      formData.businessContext?.regulators ||
                      "-"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>
                    What are your regulatory requirements?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.regulatoryRequirements ||
                      formData.businessContext?.regulatoryRequirements ||
                      "-"}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* Records section */}
            <Box
              sx={{ p: 2, border: "1px solid #E7E7E8", borderRadius: "8px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Records
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />

              {/* Question 1: Types of records */}
              <Box sx={{ mb: 3 }}>
                <OrgDetailsTypography>
                  What kinds of records does the company deal with? Check all
                  that apply: PHI, PII, Intellectual Property, Government
                  Records.
                </OrgDetailsTypography>
                <OrgDetailsTypography variant="value">
                  {organization.details?.recordTypes &&
                  Array.isArray(organization.details.recordTypes) &&
                  organization.details.recordTypes.length > 0
                    ? organization.details.recordTypes.join(", ")
                    : formData.businessContext?.recordTypes &&
                      Array.isArray(formData.businessContext.recordTypes) &&
                      formData.businessContext.recordTypes.length > 0
                    ? formData.businessContext.recordTypes.join(", ")
                    : "PII, PFI, PHI, Government Records"}
                </OrgDetailsTypography>
              </Box>

              {/* Question 2: PII records count */}
              <Box sx={{ ml: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <OrgDetailsTypography>
                    How many Personal Identifiable Information (PII) records
                    does the company hold, including those related to employees,
                    customers, and partners?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.piiRecordsCount ||
                      formData.businessContext?.piiRecordsCount ||
                      "1000"}
                  </OrgDetailsTypography>
                </Box>

                {/* Question 3: PFI records count */}
                <Box sx={{ mb: 3 }}>
                  <OrgDetailsTypography>
                    How many Personal Financial Information (PFI) records does
                    the company hold, including those of employees, customers,
                    and partners?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.pfiRecordsCount ||
                      formData.businessContext?.pfiRecordsCount ||
                      "1000"}
                  </OrgDetailsTypography>
                </Box>

                {/* Question 4: PHI records count */}
                <Box sx={{ mb: 3 }}>
                  <OrgDetailsTypography>
                    How many Protected Health Information (PHI) records does the
                    company currently have for employees, customers, and
                    partners?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.phiRecordsCount ||
                      formData.businessContext?.phiRecordsCount ||
                      "2000"}
                  </OrgDetailsTypography>
                </Box>

                {/* Question 5: Government records count */}
                <Box sx={{ mb: 3 }}>
                  <OrgDetailsTypography>
                    How many government classified information records does the
                    company hold?
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.governmentRecordsCount ||
                      formData.businessContext?.governmentRecordsCount ||
                      "100"}
                  </OrgDetailsTypography>
                </Box>
              </Box>

              {/* Question 6: Certifications */}
              <Box sx={{ mb: 3 }}>
                <OrgDetailsTypography>
                  Did the organization obtain PCI DSS, ISO 27001, or SOC2
                  certification in the past year? Please check the appropriate
                  boxes if any.
                </OrgDetailsTypography>
                <OrgDetailsTypography variant="value">
                  {organization.details?.certifications &&
                  Array.isArray(organization.details.certifications) &&
                  organization.details.certifications.length > 0
                    ? organization.details.certifications.join(", ")
                    : formData.businessContext?.certifications &&
                      Array.isArray(formData.businessContext.certifications) &&
                      formData.businessContext.certifications.length > 0
                    ? formData.businessContext.certifications.join(", ")
                    : "PCI DSS"}
                </OrgDetailsTypography>
              </Box>

              {/* Question 7: Intellectual property value */}
              <Box sx={{ mb: 3 }}>
                <OrgDetailsTypography>
                  How much is the company&apos;s intellectual property and trade
                  secrets worth as a percentage of its yearly revenue?
                </OrgDetailsTypography>
                <OrgDetailsTypography variant="value">
                  {organization.details?.intellectualPropertyPercentage ||
                    formData.businessContext?.intellectualPropertyPercentage ||
                    "30"}
                  %
                </OrgDetailsTypography>
              </Box>
            </Box>

            {/* Additional Information Section */}
            <Box
              sx={{
                p: 2,
                border: "1px solid #E7E7E8",
                borderRadius: "8px",
                minHeight: "120px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Additional Information
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "100px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>
                    Additional Information
                  </OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.details?.additionalInformation ||
                      formData.businessContext?.additionalInformation ||
                      "-"}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>

            {/* Activity Section */}
            <Box
              sx={{
                p: 2,
                border: "1px solid #E7E7E8",
                borderRadius: "8px",
                mb: 6,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Activity
              </Typography>
              <Divider sx={{ borderColor: "#E0E0E0", mb: 2.5, mt: 1 }} />
              <Box sx={{ display: "flex", gap: "200px", height: "36px" }}>
                <Box>
                  <OrgDetailsTypography>Created On</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {formatDate(organization.createdDate)}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>Created By</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {organization.createdBy || "Karan Gautam"}
                  </OrgDetailsTypography>
                </Box>
                <Box>
                  <OrgDetailsTypography>Last Updated</OrgDetailsTypography>
                  <OrgDetailsTypography variant="value">
                    {formatDate(organization.modifiedDate)}
                  </OrgDetailsTypography>
                </Box>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Repository />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BusinessUnits />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h3" sx={{ mb: 2 }} textAlign={"center"}>
            Coming soon user!!
          </Typography>
        </TabPanel>
      </Box>

      {/* Import Library Modal */}
      <Popover
        open={Boolean(importModalAnchor)}
        anchorEl={importModalAnchor}
        onClose={handleImportModalClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E7E7E8",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: "#484848",
            }}
          >
            Import Library
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={importSelections.riskScenario}
                  onChange={() => handleCheckboxChange("riskScenario")}
                  sx={{
                    color: "#04139A",
                    "&.Mui-checked": {
                      color: "#04139A",
                    },
                  }}
                />
              }
              label="Risk Scenario"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "#484848",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={importSelections.process}
                  onChange={() => handleCheckboxChange("process")}
                  sx={{
                    color: "#04139A",
                    "&.Mui-checked": {
                      color: "#04139A",
                    },
                  }}
                />
              }
              label="Process"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "#484848",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={importSelections.assets}
                  onChange={() => handleCheckboxChange("assets")}
                  sx={{
                    color: "#04139A",
                    "&.Mui-checked": {
                      color: "#04139A",
                    },
                  }}
                />
              }
              label="Assets"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "#484848",
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleImportModalClose}
              sx={{
                textTransform: "none",
                color: "#484848",
                borderColor: "#E7E7E8",
                "&:hover": {
                  borderColor: "#91939A",
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={
                !importSelections.riskScenario &&
                !importSelections.process &&
                !importSelections.assets
              }
              sx={{
                backgroundColor: "#04139A",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#030d6b",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#E7E7E8",
                  color: "#91939A",
                },
              }}
            >
              Import
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Success Popup Dialog */}
      <Dialog
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        PaperProps={{
          sx: {
            width: "100%",
            height: "241px",
            borderRadius: "10px",
            border: "1px solid #E7E7E7",
            backgroundColor: "#FFFFFF",
            position: "relative",
            boxShadow: "none",
            margin: "auto",
          },
        }}
      >
        <DialogContent
          sx={{
            p: "48px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            height: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "&.MuiDialogContent-root": {
              padding: "48px",
            },
          }}
        >
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
              },
            }}
          >
            <Close />
          </IconButton>

          {/* Success icon */}
          <Box
            sx={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
          >
            <Image
              src={"/success_Icons.png"}
              alt="success-Icons"
              width={64}
              height={64}
            />
          </Box>

          {/* Success message */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#484848",
              flexShrink: 0,
              textAlign: "center",
              lineHeight: "100%",
              verticalAlign: "bottom",
            }}
          >
            Success
          </Typography>

          <Typography
            variant="body2"
            sx={{
              lineHeight: "150%",
              textAlign: "center",
              color: "#484848",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {organization?.name || "Organization"} has been successfully created
          </Typography>
        </DialogContent>
      </Dialog>

      <ToastComponent
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        toastBorder={
          toast.severity === "success" ? "1px solid #147A50" : undefined
        }
        toastColor={toast.severity === "success" ? "#147A50" : undefined}
        toastBackgroundColor={
          toast.severity === "success" ? "#DDF5EB" : undefined
        }
        toastSeverity={toast.severity}
      />
    </Box>
  );
}

export default withAuth(OrgDetailsPage);
