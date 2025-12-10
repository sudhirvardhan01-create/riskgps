import { OrganizationFrameworkControl } from "@/types/reports";

export const getProcessList = async (orgId: string | undefined) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/process-details/${orgId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const getOrganizationNistControlScores = async (
  orgId: string | undefined
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/${orgId}/org-nist-score`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const updateOrganizationNistControlScores = async (
  orgId: string | undefined,
  body: any
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/${orgId}/org-nist-score`,
    {
      method: "PATCH",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};

export const getAssetMitreToNistScoreChartData = async (
  orgId: string | undefined
) => {
  if (!orgId) Promise.reject("Org ID Required");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/${orgId}/org-asset-mitre-nist-score`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  return response.json();
};
