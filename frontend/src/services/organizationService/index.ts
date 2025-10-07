import { ApiOrganization, ApiOrganizationsResponse, Organization } from "@/types/organization";

export interface CreateOrganizationRequest {
  orgName: string;
  desc: string;
  tags: Array<{
    key: string;
    value: string;
  }>;
  businessContext: {
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
  };
}

export interface CreateOrganizationResponse {
  success: boolean;
  message: string;
  data: {
    organizationId: string;
    createdDate: string;
    modifiedDate: string;
    isDeleted: boolean;
    name: string;
    desc: string;
    industryVertical: string;
    regionOfOperation: string;
    numberOfEmployees: number;
    cisoName: string;
    cisoEmail: string;
    annualRevenue: string;
    riskAppetite: string;
    cybersecurityBudget: string;
    insuranceCoverage: string;
    insuranceCarrier: string;
    numberOfClaims: number;
    claimsValue: string;
    regulators: string;
    regulatoryRequirements: string;
    additionalInformation: string;
    recordTypes: string[];
    certifications: string[];
    piiRecordsCount: number;
    pfiRecordsCount: number;
    phiRecordsCount: number;
    governmentRecordsCount: number;
    intellectualPropertyPercentage: number;
    tags: Array<{
      key: string;
      value: string;
    }>;
    createdBy: string | null;
    modifiedBy: string | null;
  };
}

export const createOrganization = async (organizationData: CreateOrganizationRequest): Promise<CreateOrganizationResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create organization");
  }

  return response.json();
};

export const getOrganizations = async (
  page: number = 0, 
  limit: number = 10, 
  search?: string,
  sortBy: string = 'created_date',
  sortOrder: string = 'DESC'
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(search && { search })
  });
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organizations data");
  }
  return response.json();
};

export const getOrganizationById = async (orgId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organization data");
  }
  return response.json();
};

// Transform API organization data to frontend format
export const transformApiOrganizationToFrontend = (apiOrg: ApiOrganization): Organization => {
  // Extract tags from API format
  const tags: { [key: string]: string } = {};
  if (apiOrg.tags) {
    apiOrg.tags.forEach(tag => {
      tags[tag.key] = tag.value;
    });
  }

  // Extract business unit names
  const businessUnits = apiOrg.businessUnits?.map(bu => bu.name) || [];

  // Determine status based on isDeleted flag
  const status: 'active' | 'disabled' = apiOrg.isDeleted ? 'disabled' : 'active';

  return {
    id: apiOrg.organizationId,
    name: apiOrg.name,
    orgId: apiOrg.organizationId, // Using organizationId as orgId for now
    orgImage: "/orgImage.png", // Default image
    tags: {
      industry: tags.industry || apiOrg.industryVertical || "Unknown",
      size: tags.size || (apiOrg.numberOfEmployees ? `${apiOrg.numberOfEmployees}` : "Unknown"),
      ...tags
    },
    members: {
      avatars: ["/memberImage.jpg", "/memberImage1.jpg", "/memberImage2.jpg"], // Default avatars
      additionalCount: 3
    },
    businessUnits,
    status,
    lastUpdated: apiOrg.modifiedDate,
    createdDate: apiOrg.createdDate,
    modifiedDate: apiOrg.modifiedDate,
    createdBy: apiOrg.createdBy || undefined,
    details: {
      industryVertical: apiOrg.industryVertical || undefined,
      regionOfOperation: apiOrg.regionOfOperation || undefined,
      employeeCount: apiOrg.numberOfEmployees || undefined,
      cisoName: apiOrg.cisoName || undefined,
      cisoEmail: apiOrg.cisoEmail || undefined,
      annualRevenue: apiOrg.annualRevenue || undefined,
      riskAppetite: apiOrg.riskAppetite || undefined,
      cybersecurityBudget: apiOrg.cybersecurityBudget || undefined,
      insuranceCoverage: apiOrg.insuranceCoverage || undefined,
      insuranceCarrier: apiOrg.insuranceCarrier || undefined,
      claimsCount: apiOrg.numberOfClaims?.toString() || undefined,
      claimsValue: apiOrg.claimsValue || undefined,
      regulators: apiOrg.regulators || undefined,
      regulatoryRequirements: apiOrg.regulatoryRequirements || undefined,
      additionalInformation: apiOrg.additionalInformation || undefined,
      recordTypes: apiOrg.recordTypes || undefined,
      piiRecordsCount: apiOrg.piiRecordsCount?.toString() || undefined,
      pfiRecordsCount: apiOrg.pfiRecordsCount?.toString() || undefined,
      phiRecordsCount: apiOrg.phiRecordsCount?.toString() || undefined,
      governmentRecordsCount: apiOrg.governmentRecordsCount?.toString() || undefined,
      certifications: apiOrg.certifications || undefined,
      intellectualPropertyPercentage: apiOrg.intellectualPropertyPercentage?.toString() || undefined
    }
  };
};

// Transform API response to frontend format
export const transformApiResponseToFrontend = (apiResponse: ApiOrganizationsResponse) => {
  return {
    organizations: apiResponse.data.organizations.map(transformApiOrganizationToFrontend),
    total: apiResponse.data.total,
    page: apiResponse.data.page,
    limit: apiResponse.data.limit
  };
};

export interface DeleteOrganizationRequest {
  modifiedBy: string;
}

export interface DeleteOrganizationResponse {
  msg: string;
}

export const deleteOrganization = async (
  organizationId: string, 
  modifiedBy: string
): Promise<DeleteOrganizationResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${organizationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modifiedBy }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete organization");
  }

  return response.json();
};

export interface UpdateOrganizationRequest {
  name: string;
  desc: string;
  modifiedBy: string;
  tags: Array<{
    key: string;
    value: string;
  }>;
  businessContext: {
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
  };
}

export interface UpdateOrganizationResponse {
  success: boolean;
  message: string;
  data: {
    organizationId: string;
    createdDate: string;
    modifiedDate: string;
    isDeleted: boolean;
    name: string;
    desc: string;
    industryVertical: string;
    regionOfOperation: string;
    numberOfEmployees: number;
    cisoName: string;
    cisoEmail: string;
    annualRevenue: string;
    riskAppetite: string;
    cybersecurityBudget: string;
    insuranceCoverage: string;
    insuranceCarrier: string;
    numberOfClaims: number;
    claimsValue: string;
    regulators: string;
    regulatoryRequirements: string;
    additionalInformation: string;
    recordTypes: string[];
    certifications: string[];
    piiRecordsCount: number;
    pfiRecordsCount: number;
    phiRecordsCount: number;
    governmentRecordsCount: number;
    intellectualPropertyPercentage: number;
    tags: Array<{
      key: string;
      value: string;
    }>;
    createdBy: string | null;
    modifiedBy: string | null;
  };
}

export const updateOrganization = async (
  organizationId: string,
  organizationData: UpdateOrganizationRequest
): Promise<UpdateOrganizationResponse> => {
  // Get access token from cookies
  const token = typeof window !== 'undefined' ? document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1] : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${organizationId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(organizationData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Update API Error:', errorData);
    throw new Error(errorData.message || "Failed to update organization");
  }

  const responseData = await response.json();
  return responseData;
};
