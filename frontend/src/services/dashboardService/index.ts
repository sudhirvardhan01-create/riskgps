import {
  getBusinessUnitHeatmapChartData,
  getBusinessUnitRadarChartData,
  getRiskExposureProcessChartData,
  getRiskScenariosTableChartData,
} from "@/pages/api/dashboard";
import {
  getAssetMitreToNistScoreChartData,
  getOrganizationNistControlScores,
  updateOrganizationNistControlScores,
} from "@/pages/api/reports";

export const DashboardService = {
  getRiskExposureBusinessProcessChartData: (orgId: string) =>
    getRiskExposureProcessChartData(orgId),
  getBusinessUnitSeverityHeatmapChartData: (orgId: string) =>
    getBusinessUnitHeatmapChartData(orgId),
  getRiskScenariosTableChartData: (orgId: string) =>
    getRiskScenariosTableChartData(orgId),
  getBusinessUnitRadarChartData: (orgId: string) =>
    getBusinessUnitRadarChartData(orgId),
  getOrganizationNistControlScores: (orgId: string) =>
    getOrganizationNistControlScores(orgId),
  updateOrganizationNistControlScores: (orgId: string, body: any) =>
    updateOrganizationNistControlScores(orgId, body),
  getAssetMitreToNistScoreChartData: (orgId: string) =>
    getAssetMitreToNistScoreChartData(orgId),
};
