import React from "react";
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Divider,
  Button
} from "@mui/material";
import TextFieldStyled from "@/components/TextFieldStyled";
import SelectStyled from "@/components/SelectStyled";
import { COMPLIANCE_FRAMEWORKS, RECORD_TYPES, COUNTRIES } from "@/constants/constant";

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

interface BusinessContextFormProps {
  businessContext: BusinessContextData;
  onFieldChange: (field: keyof BusinessContextData, value: string | string[]) => void;
  currentStep: number;
  mandatoryFields: Record<string, boolean>;
}

const BusinessContextForm: React.FC<BusinessContextFormProps> = ({
  businessContext,
  onFieldChange,
  currentStep,
  mandatoryFields
}) => {
  return (
    <>
      {currentStep === 1 ? (<Box sx={{ width: "100%", mb: 4 }}>
        <Grid container spacing={3}>
          {/* Industry Section */}
          <Grid size={12}>
            <Typography
              variant="h6"
              sx={{
                color: "#04139A",
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
                  required={mandatoryFields.industryVertical}
                  placeholder="Financial Services, Healthcare"
                  value={businessContext.industryVertical}
                  onChange={(e) =>
                    onFieldChange("industryVertical", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectStyled
                  label="Region of Operation"
                  required={mandatoryFields.regionOfOperation}
                  value={businessContext.regionOfOperation}
                  onChange={(e) =>
                    onFieldChange("regionOfOperation", e.target.value as string)
                  }
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
                  required={mandatoryFields.numberOfEmployees}
                  placeholder="100"
                  value={businessContext.numberOfEmployees}
                  onChange={(e) =>
                    onFieldChange("numberOfEmployees", e.target.value)
                  }
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
                color: "#04139A",
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
                  required={mandatoryFields.cisoName}
                  placeholder="Enter name"
                  value={businessContext.cisoName}
                  onChange={(e) => onFieldChange("cisoName", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="Email"
                  required={mandatoryFields.cisoEmail}
                  placeholder="Enter email"
                  value={businessContext.cisoEmail}
                  onChange={(e) => onFieldChange("cisoEmail", e.target.value)}
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
                color: "#04139A",
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
                  required={mandatoryFields.annualRevenue}
                  placeholder="$ Enter amount in dollars"
                  value={businessContext.annualRevenue}
                  onChange={(e) => onFieldChange("annualRevenue", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="Risk Appetite"
                  required={mandatoryFields.riskAppetite}
                  placeholder="$ Enter amount in dollars"
                  value={businessContext.riskAppetite}
                  onChange={(e) => onFieldChange("riskAppetite", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="Allocated budget for cybersecurity operations"
                  required={mandatoryFields.cybersecurityBudget}
                  placeholder="$ Enter amount in dollars"
                  value={businessContext.cybersecurityBudget}
                  onChange={(e) => onFieldChange("cybersecurityBudget", e.target.value)}
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
                color: "#04139A",
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
                  required={mandatoryFields.insuranceCoverage}
                  placeholder="$ Enter amount in dollars"
                  value={businessContext.insuranceCoverage}
                  onChange={(e) => onFieldChange("insuranceCoverage", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="Insurance - Current Carrier"
                  required={mandatoryFields.insuranceCarrier}
                  placeholder="Enter Insurance - Current Carrier"
                  value={businessContext.insuranceCarrier}
                  onChange={(e) => onFieldChange("insuranceCarrier", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="No. of claims (made in last 12 months)"
                  required={mandatoryFields.numberOfClaims}
                  placeholder="Enter no. of claims"
                  value={businessContext.numberOfClaims}
                  onChange={(e) => onFieldChange("numberOfClaims", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="Claims Value (made in last 12 months)"
                  required={mandatoryFields.claimsValue}
                  placeholder="$ Enter amount in dollars"
                  value={businessContext.claimsValue}
                  onChange={(e) => onFieldChange("claimsValue", e.target.value)}
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
                color: "#04139A",
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
                  required={mandatoryFields.regulators}
                  placeholder="Enter regulators"
                  value={businessContext.regulators}
                  onChange={(e) => onFieldChange("regulators", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldStyled
                  label="What are your regulatory requirements?"
                  required={mandatoryFields.regulatoryRequirements}
                  placeholder="Example: GDPR, etc."
                  value={businessContext.regulatoryRequirements}
                  onChange={(e) => onFieldChange("regulatoryRequirements", e.target.value)}
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

          {/* Additional Information Section */}
          <Grid size={12}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#04139A",
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
                  required={mandatoryFields.additionalInformation}
                  placeholder="Enter additional information"
                  value={businessContext.additionalInformation}
                  onChange={(e) => onFieldChange("additionalInformation", e.target.value)}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>)
        :
        (<Box sx={{ width: "100%", mb: 4 }}>
          {/* Page 2 Start Section */}
          <Grid container spacing={3}>
            {/* record Section */}
            <Grid size={12}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#04139A",
                  lineHeight: "100%",
                  letterSpacing: "0px",
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
                {RECORD_TYPES.map((recordType) => {
                  const isSelected = businessContext.recordTypes?.includes(recordType) || false;
                  return (
                    <Button
                      key={recordType}
                      onClick={() => {
                        const currentTypes = businessContext.recordTypes || [];
                        const newTypes = isSelected
                          ? currentTypes.filter(type => type !== recordType)
                          : [...currentTypes, recordType];
                        onFieldChange("recordTypes", newTypes);
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
                  required={mandatoryFields.piiRecordsCount}
                  placeholder="Enter value"
                  value={businessContext.piiRecordsCount}
                  onChange={(e) => onFieldChange("piiRecordsCount", e.target.value)}
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
                  required={mandatoryFields.pfiRecordsCount}
                  placeholder="Enter value"
                  value={businessContext.pfiRecordsCount}
                  onChange={(e) => onFieldChange("pfiRecordsCount", e.target.value)}
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
                  required={mandatoryFields.phiRecordsCount}
                  placeholder="Enter value"
                  value={businessContext.phiRecordsCount}
                  onChange={(e) => onFieldChange("phiRecordsCount", e.target.value)}
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
                  required={mandatoryFields.governmentRecordsCount}
                  placeholder="Enter value"
                  value={businessContext.governmentRecordsCount}
                  onChange={(e) => onFieldChange("governmentRecordsCount", e.target.value)}
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
                {COMPLIANCE_FRAMEWORKS.map((certification) => {
                  const isSelected = businessContext.certifications?.includes(certification) || false;
                  return (
                    <Button
                      key={certification}
                      onClick={() => {
                        const currentCertifications = businessContext.certifications || [];
                        const newCertifications = isSelected
                          ? currentCertifications.filter(cert => cert !== certification)
                          : [...currentCertifications, certification];
                        onFieldChange("certifications", newCertifications);
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
                  required={mandatoryFields.intellectualPropertyPercentage}
                  placeholder="Enter in percentage"
                  value={businessContext.intellectualPropertyPercentage}
                  onChange={(e) => onFieldChange("intellectualPropertyPercentage", e.target.value)}
                />
              </Grid>

            </Grid>
          </Grid>
        </Box>)
      }
    </>
  );
};

export default BusinessContextForm;
