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
  createdDate: string;
  modifiedDate: string; 
  isDeleted: boolean;
}

export interface Control {
  controlCategoryId: string;
  controlCategory: string;
  controlSubCategoryId: string;
  controlSubCategory: string;
  calcultatedControlScore: number;
  currentScore: number;
  targetScore: number;
}

export interface AssetRiskRecord {
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

  controlStrength: number;

  inherentRiskScore: number;
  inherentRiskLevel: string;

  residualRiskScore: number;
  residualRiskLevel: string;

  inherentImpactInDollar: number;
  residualImpactInDollar: number;
  targetImpactInDollar: number;

  targetStrength: number;
  targetResidualRiskScore: number;
  targetResidualRiskLevel: string;

  controls: Control[];
}

