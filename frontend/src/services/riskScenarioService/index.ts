import {
  createRiskScenario,
  deleteRiskScenario,
  fetchRiskScenarios,
  updateRiskScenario,
  updateRiskScenarioStatus,
} from "@/pages/api/risk-scenario";
import { Filter } from "@/types/filter";

export const RiskScenarioService = {
  fetch: (page: number, rowsPerPage?: number, searchPattern?: string, sort?: string, statusFilter?: string[], filters?: Filter[]) => fetchRiskScenarios(page, rowsPerPage, searchPattern, sort, statusFilter, filters),
  create: (body: any) => createRiskScenario(body),
  update: (id: number, body: any) => updateRiskScenario(id, body),
  delete: (id: number) => deleteRiskScenario(id),
  updateStatus: (id: number, status: string) => updateRiskScenarioStatus(id, status),
};
