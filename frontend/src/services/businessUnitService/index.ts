import { BusinessUnitData } from "@/types/business-unit";

// API Response interfaces for Business Units
export interface ApiBusinessUnit {
  orgBusinessUnitId: string;
  organizationId: string;
  name: string;
  desc?: string | null;
  head?: {
    name: string;
    email: string;
  };
  pocBiso?: {
    name: string;
    email: string;
  };
  itPoc?: {
    name: string;
    email: string;
  };
  financeLead?: {
    name: string;
    email: string;
  };
  tags?: Array<{
    key: string;
    value: string;
  }>;
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: string;
  modifiedDate: string;
  isDeleted: boolean;
}

export interface ApiBusinessUnitsResponse {
  data: {
    businessUnits: ApiBusinessUnit[];
    total: number;
    page: number;
    limit: number;
  };
  msg: string;
}

export interface ApiBusinessUnitResponse {
  data: ApiBusinessUnit;
  msg: string;
}

// Transform API business unit data to frontend format
export const transformApiBusinessUnitToFrontend = (apiBu: ApiBusinessUnit): BusinessUnitData => {
  return {
    id: apiBu.orgBusinessUnitId,
    businessUnitName: apiBu.name,
    buCode: `BU${Math.floor(Math.random() * 1000000)}`, // Generate random BU code since API doesn't provide it
    buSize: 0, // Default size since API doesn't provide it
    assessments: 0, // Default assessments since API doesn't provide it
    tags: apiBu.tags || [],
    status: "active", // Default status since API doesn't provide it
    lastUpdated: apiBu.modifiedDate,
    buHead: apiBu.head,
    buPocBiso: apiBu.pocBiso,
    buItPoc: apiBu.itPoc,
    buFinanceLead: apiBu.financeLead,
  };
};

// Transform API response to frontend format
export const transformApiResponseToFrontend = (apiResponse: ApiBusinessUnitsResponse) => {
  return {
    businessUnits: apiResponse.data.businessUnits.map(transformApiBusinessUnitToFrontend),
    total: apiResponse.data.total,
    page: apiResponse.data.page,
    limit: apiResponse.data.limit
  };
};

// Get business units for an organization
export const getBusinessUnits = async (orgId: string): Promise<BusinessUnitData[]> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-units`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch business units");
  }

  const apiResponse: ApiBusinessUnitsResponse = await response.json();
  const transformedData = transformApiResponseToFrontend(apiResponse);
  
  return transformedData.businessUnits;
};

// Get single business unit by ID
export const getBusinessUnitById = async (businessUnitId: string): Promise<BusinessUnitData> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/business-unit/${businessUnitId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch business unit");
  }

  const apiResponse: ApiBusinessUnitResponse = await response.json();
  return transformApiBusinessUnitToFrontend(apiResponse.data);
};

// Create business unit
export interface CreateBusinessUnitRequest {
  name: string;
  head?: {
    name: string;
    email: string;
  };
  pocBiso?: {
    name: string;
    email: string;
  };
  itPoc?: {
    name: string;
    email: string;
  };
  financeLead?: {
    name: string;
    email: string;
  };
  tags?: Array<{
    key: string;
    value: string;
  }>;
  createdBy: string;
  status?: string;
}

export interface CreateBusinessUnitResponse {
  success: boolean;
  message: string;
  data: ApiBusinessUnit;
}

export const createBusinessUnit = async (
  orgId: string,
  businessUnitData: CreateBusinessUnitRequest
): Promise<CreateBusinessUnitResponse> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-units`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(businessUnitData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to create business unit");
  }

  return response.json();
};

// Update business unit
export interface UpdateBusinessUnitRequest {
  name?: string;
  head?: {
    name: string;
    email: string;
  };
  pocBiso?: {
    name: string;
    email: string;
  };
  itPoc?: {
    name: string;
    email: string;
  };
  financeLead?: {
    name: string;
    email: string;
  };
  tags?: Array<{
    key: string;
    value: string;
  }>;
  status?: string;
  modifiedBy: string;
}

export interface UpdateBusinessUnitResponse {
  success: boolean;
  message: string;
  data: ApiBusinessUnit;
}

export const updateBusinessUnit = async (
  businessUnitId: string,
  businessUnitData: UpdateBusinessUnitRequest
): Promise<UpdateBusinessUnitResponse> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/business-unit/${businessUnitId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(businessUnitData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to update business unit");
  }

  return response.json();
};

// Delete business unit
export interface DeleteBusinessUnitResponse {
  success: boolean;
  message: string;
}

export const deleteBusinessUnit = async (
  businessUnitId: string,
  modifiedBy: string
): Promise<DeleteBusinessUnitResponse> => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/business-unit/${businessUnitId}`,
    {
      method: "DELETE",
      headers,
      body: JSON.stringify({ modifiedBy }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete business unit");
  }

  return response.json();
};
