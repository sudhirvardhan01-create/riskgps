export interface ProcessAsset {
  assetId: string;
  applicationName: string;
  controlStrength: number;
  targetStrength: number;
  riskExposure?: number;
  riskExposureLevel?: string;
  netExposure?: number;
  netExposureLevel?: string;
}

export interface ProcessRisk {
  riskScenarioId: string;
  riskScenario: string;
  riskScenarioCIAMapping: string;
  riskExposure: number;
  riskExposureLevel?: string;
  netExposure: number;
  netExposureLevel?: string;
}

export interface RiskExposureByProcessChartItem {
  assessmentId: string;
  assessmentName: string;
  orgId: string;
  orgName: string;
  businessUnitId: string;
  businessUnitName: string;
  businessProcessId: string;
  processName: string;
  severity: string;
  riskAppetite: number;
  maxRiskExposure: number;
  maxNetExposure: number;
  assets: ProcessAsset[];
  risks: ProcessRisk[];
}

export interface BusinessUnitHeatmapChart {
  businessUnitId: string;
  x: string;
  y: string;
  value: number;
}

export type RiskMetric =
  | "Total Risk Exposure"
  | "Average Net Exposure"
  | "Financial Impact"
  | "Operational Impact"
  | "Regulatory Impact"
  | "Reputational Impact";

export interface RiskRadarRecord {
  metric: RiskMetric;
  values: Record<string, number>; // dynamic BUs
}

export interface RiskScenarioTableChartItem {
  assessmentId: string;
  assessmentName: string;
  orgId: string;
  orgName: string;
  organizationRiskAppetite: number;
  businessUnitId: string;
  businessUnit: string;
  businessProcessId: string;
  businessProcess: string;
  riskScenarioId: string;
  riskScenario: string;
  riskScenarioCIAMapping: string;
  inherentRiskScore: number;
  riskExposure: number;
  riskExposureLevel: string;
  controlStrengthRisk: number;
  residualRiskScoreRisk: number;
  netExposure: number;
  netExposureLevel: string;
  targetImpact: number;
}
