import { OrganizationFrameworkControl } from "@/types/reports";
import apiClient from "@/utils/apiClient";

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
  const res = await apiClient.get(`/reports/${orgId}/org-nist-score`);
  return res.data;
};

export const updateOrganizationNistControlScores = async (
  orgId: string | undefined,
  body: OrganizationFrameworkControl[]
) => {
  const res = await apiClient.patch(`/reports/${orgId}/org-nist-score`, body);
  return res.data;
};

export const getAssetLevelChartsData = async (orgId: string | undefined) => {
  if (!orgId) Promise.reject("Org ID Required");
  const res = await apiClient.get(
    `/reports/${orgId}/org-asset-mitre-nist-score`
  );
  return res.data;
};
