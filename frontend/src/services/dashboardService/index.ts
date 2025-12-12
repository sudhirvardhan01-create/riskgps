import {
  getBusinessUnitHeatmapChartData,
  getBusinessUnitRadarChartData,
  getRiskExposureProcessChartData,
  getRiskScenariosTableChartData,
} from "@/pages/api/dashboard";
import {
  getAssetLevelChartsData,
  getOrganizationNistControlScores,
  updateOrganizationNistControlScores,
} from "@/pages/api/reports";
import { OrganizationFrameworkControl } from "@/types/reports";

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
  updateOrganizationNistControlScores: (orgId: string, body: OrganizationFrameworkControl[]) =>
    updateOrganizationNistControlScores(orgId, body),
  getAssetLevelChartsData: (orgId: string) =>
    getAssetLevelChartsData(orgId),
};
