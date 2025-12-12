export type ApiAsset = {
  id: string;
  applicationName: string;
};

export type ApiRisk = {
  id: string;
  riskScenario: string;
};

export type ApiProcess = {
  id: string;
  processName: string;
  assets: ApiAsset[];
  riskScenarios: ApiRisk[];
  processDependency?: string[];
};

// types.ts
export interface Asset {
  id: string;
  organizationId: string;
  assetCode: string;
  applicationName: string;
  isThirdPartyManagement: boolean | null;
  thirdPartyName: string | null;
  thirdPartyLocation: string | null;
  geographicLocation: string | null;
  assetCategory: string;
}

export interface AssetSummary {
  id: string;
  name: string;
  category: string;
  code: string;
}

export interface VendorSummary {
  name: string;
  location?: string | null;
}

export interface LocationSummary {
  name: string;
}


export interface OrganizationFrameworkControl {
  orgControlId: string;
  parentObjectId: string | null;
  organizationId: string;
  frameWorkName: string;
  frameWorkControlCategoryId: string;
  frameWorkControlCategory: string | null;
  frameWorkControlDescription: string | null;
  frameWorkControlSubCategoryId: string | null;
  frameWorkControlSubCategory: string | null;
  currentScore: number | null;
  targetScore: number | null;
  createdBy: string | null,
  createdDate: string;
  modifiedDate: string; 
  isDeleted: boolean;
}

export interface Control {
  controlCategoryId: string;
  controlCategory: string;
  controlSubCategoryId: string | null;
  controlSubCategory: string | null;
  calcultatedControlScore: number | null
  currentScore: number | null;
  targetScore: number | null;
}

export interface AssetLevelReportsData {
  orgId: string;
  orgName: string;
  organizationRiskAppetiteInMillionDollar: number;

  businessUnitId: string;
  businessUnit: string;

  businessProcessId: string;
  businessProcess: string;

  assetId: string;
  asset: string;
  assetCategory: string;

  controlStrength: number | null;

  inherentRiskScore: number | null;
  inherentRiskLevel: "very low" | "low" | "moderate" | "high" | "critical";

  residualRiskScore: number | null;
  residualRiskLevel: "very low" | "low" | "moderate" | "high" | "critical";

  inherentImpactInDollar: number | null;
  residualImpactInDollar: number | null;
  targetImpactInDollar: number | null;

  targetStrength: number | null;
  targetResidualRiskScore: number | null;
  targetResidualRiskLevel: "very low" | "low" | "moderate" | "high" | "critical";

  controls: Control[] | null;
}

