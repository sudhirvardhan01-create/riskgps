import {
  getBusinessUnitHeatmapChartData,
  getBusinessUnitRadarChartData,
  getRiskExposureProcessChartData,
  getRiskScenariosTableChartData,
} from "@/pages/api/dashboard";

export const DashboardService = {
  getRiskExposureBusinessProcessChartData: (orgId: string) =>
    getRiskExposureProcessChartData(orgId),
  getBusinessUnitSeverityHeatmapChartData: (orgId: string) =>
    getBusinessUnitHeatmapChartData(orgId),
  getRiskScenariosTableChartData: (orgId: string) =>
    getRiskScenariosTableChartData(orgId),
  getBusinessUnitRadarChartData: (orgId: string) =>
    getBusinessUnitRadarChartData(orgId),
};
