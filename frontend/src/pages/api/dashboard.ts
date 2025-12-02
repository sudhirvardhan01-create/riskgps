import apiClient from "@/utils/apiClient";

/**
 * Get Risk Exposure by Business Process Chart Data and Process Criticality Overview Data
 * @param orgId
 * @returns
 */
export const getRiskExposureProcessChartData = async (orgId: string) => {
  const res = await apiClient.get(`/reports/${orgId}/process-risk-exposure`);
  return res.data;
};

/**
 * Get Business Unit Heatmap Chart Data
 * @param orgId
 * @returns
 */
export const getBusinessUnitHeatmapChartData = async (orgId: string) => {
  const res = await apiClient.get(`/reports/${orgId}/bu-heatmap`);
  return res.data;
};
