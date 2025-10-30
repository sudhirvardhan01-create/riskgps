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

export type ChartAsset = {
  id: string;
  name: string;
};

export type ChartRisk = {
  id: string;
  name: string;
};

export type ChartProcess = {
  id: string;
  name: string;
  assets: ChartAsset[];
  risks: ChartRisk[];
  dependsOn?: string[];
};
