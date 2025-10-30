import { ApiProcess, ChartProcess } from "@/types/reports";

export const formatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export function transformProcessData(apiData: ApiProcess[]): ChartProcess[] {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((process) => ({
    id: process.id,
    name: process.processName,
    assets: (process.assets || []).map((asset) => ({
      id: asset.id,
      name: asset.applicationName,
    })),
    risks: (process.riskScenarios || []).map((risk) => ({
      id: risk.id,
      name: risk.riskScenario,
    })),
    dependsOn: process.processDependency ?? [],
  }));
}
