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
  Grid
} from "@mui/material";
import { ArrowBack, CameraAlt, Add, Check } from "@mui/icons-material";
import withAuth from "@/hoc/withAuth";
import BusinessContextForm from "@/components/org-management/BusinessContextForm";

interface Tag {
  key: string;
  value: string;
}

interface BusinessContextData {
  industryVertical: string;
  regionOfOperation: string;
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

function CreateNewOrgPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<Tag>({ key: "", value: "" });
  const [businessContext, setBusinessContext] = useState<BusinessContextData>({
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
    recordTypes: [],
    piiRecordsCount: "",
    pfiRecordsCount: "",
    phiRecordsCount: "",
    governmentRecordsCount: "",
    certifications: [],
    intellectualPropertyPercentage: ""
  });

  const handleBackClick = () => {
    router.push('/org-management');
  };

  const handleAddTag = () => {
    if (currentTag.key && currentTag.value) {
      const newTags = [...tags, currentTag];
      setTags(newTags);
    } else {
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const isStep1Valid = () => {
    return businessContext.industryVertical.trim() !== "" &&
           businessContext.regionOfOperation.trim() !== "" &&
           businessContext.riskAppetite.trim() !== "" &&
           businessContext.insuranceCoverage.trim() !== "";
  };

  const handleContinue = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Generate unique organization ID and navigate to org details page
      const uniqueOrgId = `ORG${Date.now()}`;
      console.log("Submit form", { orgName, tags, businessContext });
      
      // Encode form data as URL parameters
      const queryParams = new URLSearchParams({
        showSuccess: 'true',
        orgName: orgName,
        tags: JSON.stringify(tags),
        businessContext: JSON.stringify(businessContext)
      });
      
      // Navigate to the organization details page with the unique ID and form data
      router.push(`/org-management/${uniqueOrgId}?${queryParams.toString()}`);
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
    router.push('/org-management');
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
        p: 1
      }}>
        <Box
          sx={{
            width: "880px",
            minHeight: "656px",
            borderRadius: "8px",
            border: "1px solid #E7E7E8",
            p: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            backgroundColor: "#FFFFFF",
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
                  sx={{
                    ml: 1,
                    fontSize: "16px",
                    fontWeight: 500,
                    color: currentStep === 0 ? "#04139A" : "#4CAF50",
                    lineHeight: "150%",
                    letterSpacing: "0%"
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
                  sx={{
                    ml: 1,
                    fontSize: "16px",
                    fontWeight: 500,
                    color: (currentStep === 1 || currentStep === 2) ? "#04139A" : "#9E9FA5",
                    lineHeight: "150%",
                    letterSpacing: "0%"
                  }}
                >
                  Business Context
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Page Indicator */}
          {currentStep > 0 && <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#9E9FA5",
              lineHeight: "24px",
              letterSpacing: "0px",
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
                <Box sx={{ position: "relative", mb: 4 }}>
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
                        backgroundColor: "#E0E0E0",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography sx={{ fontSize: "20px" }}>
                        🏢
                      </Typography>
                    </Box>
                  </Avatar>
                  <IconButton
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
                      }
                    }}
                  >
                    <CameraAlt sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>

                {/* Form Fields */}
                <Box sx={{ width: "100%", mb: 4, mt: 2 }}>
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
                  <Box sx={{ mb: 2, mt: 3 }}>
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
                      Tags
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      {/* Key Select */}
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

                      {/* Value Field */}
                      <TextField
                        label="Value"
                        placeholder="Enter Value"
                        value={currentTag.value}
                        onChange={(e) => setCurrentTag({ ...currentTag, value: e.target.value })}
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

                    {/* Display Added Tags */}
                    {tags.length > 0 && (
                      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={`${capitalizeFirstLetter(tag.key)}: ${tag.value}`}
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
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              /* Business Context Form */
              <BusinessContextForm
                businessContext={businessContext}
                currentStep={currentStep}
                onFieldChange={handleBusinessContextChange}
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

              <Button
                variant="contained"
                onClick={handleContinue}
                disabled={currentStep === 0 ? !orgName.trim() : currentStep === 1 ? !isStep1Valid() : false}
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
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default withAuth(CreateNewOrgPage);