export interface Organization {
  id: string;
  name: string;
  orgId: string;
  orgImage: string,
  tags: {
    industry: string;
    size: string;
  };
  members: {
    avatars: string[];
    additionalCount: number;
  };
  businessUnits: string[];
  status: 'active' | 'disabled';
  lastUpdated?: string;
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
