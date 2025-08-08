import {
  createRiskScenario,
  deleteRiskScenario,
  fetchRiskScenarios,
  updateRiskScenario,
  updateRiskScenarioStatus,
} from "@/pages/api/risk-scenario";

export const RiskScenarioService = {
  fetch: (page: number, rowsPerPage: number) => fetchRiskScenarios(page, rowsPerPage),
  create: (body: any) => createRiskScenario(body),
  update: (id: number, body: any) => updateRiskScenario(id, body),
  delete: (id: number) => deleteRiskScenario(id),
  updateStatus: (id: number, status: string) => updateRiskScenarioStatus(id, status),
};
