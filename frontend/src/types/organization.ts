// API Response interfaces
export interface ApiOrganization {
  organizationId: string;
  name: string;
  desc: string;
  tags: Array<{
    key: string;
    value: string;
  }> | null;
  industryVertical: string | null;
  regionOfOperation: string | null;
  numberOfEmployees: number | null;
  cisoName: string | null;
  cisoEmail: string | null;
  annualRevenue: string | null;
  riskAppetite: string | null;
  cybersecurityBudget: string | null;
  insuranceCoverage: string | null;
  insuranceCarrier: string | null;
  numberOfClaims: number | null;
  claimsValue: string | null;
  regulators: string | null;
  regulatoryRequirements: string | null;
  additionalInformation: string | null;
  recordTypes: string[] | null;
  piiRecordsCount: number | null;
  pfiRecordsCount: number | null;
  phiRecordsCount: number | null;
  governmentRecordsCount: number | null;
  certifications: string[] | null;
  intellectualPropertyPercentage: number | null;
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: string;
  modifiedDate: string;
  isDeleted: boolean;
  businessUnits: Array<{
    orgBusinessUnitId: string;
    name: string;
    desc: string | null;
    createdBy: string | null;
    modifiedBy: string | null;
    createdDate: string;
    modifiedDate: string;
  }>;
}

export interface ApiOrganizationsResponse {
  data: {
    total: number;
    page: number;
    limit: number;
    organizations: ApiOrganization[];
  };
  msg: string;
}

// Frontend Organization interface (for display)
export interface Organization {
  id: string;
  name: string;
  orgId: string;
  orgImage: string,
  tags: {
    industry: string;
    size: string;
    [key: string]: string; // Allow additional dynamic tags
  };
  members: {
    avatars: string[];
    additionalCount: number;
  };
  businessUnits: string[];
  status: 'active' | 'disabled';
  lastUpdated?: string;
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: string;
  // Additional details for organization details page
  details?: {
    industryVertical?: string;
    regionOfOperation?: string;
    employeeCount?: number;
    cisoName?: string;
    cisoEmail?: string;
    annualRevenue?: string;
    riskAppetite?: string;
    cybersecurityBudget?: string;
    insuranceCoverage?: string;
    insuranceCarrier?: string;
    claimsCount?: string;
    claimsValue?: string;
    regulators?: string;
    regulatoryRequirements?: string;
    additionalInformation?: string;
    recordTypes?: string[];
    piiRecordsCount?: string;
    pfiRecordsCount?: string;
    phiRecordsCount?: string;
    governmentRecordsCount?: string;
    certifications?: string[];
    intellectualPropertyPercentage?: string;
  };
}

export interface OrganizationForm {
  name: string;
  orgId: string;
  industry: string;
  size: string;
  businessUnits: string[];
  members: string[];
}
