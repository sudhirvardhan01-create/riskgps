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
