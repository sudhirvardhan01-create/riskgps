import {
  getBusinessUnitHeatmapChartData,
  getRiskExposureProcessChartData,
} from "@/pages/api/dashboard";

export const DashboardService = {
  getRiskExposureBusinessProcessChartData: (orgId: string) =>
    getRiskExposureProcessChartData(orgId),
  getBusinessUnitSeverityHeatmapChartData: (orgId: string) =>
    getBusinessUnitHeatmapChartData(orgId),
};
