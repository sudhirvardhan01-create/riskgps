import { RiskScenarioService } from "@/services/riskScenarioService";
import { RiskScenarioData } from "@/types/risk-scenario";

// Adapter service for risk scenarios to match the common library interface
export const RiskScenarioLibraryService = {
  fetch: async (page: number, limit: number, searchTerm: string, sort: string) => {
    const response = await RiskScenarioService.fetch(page, limit, searchTerm, sort);
    
    // Transform RiskScenarioData to LibraryItem format
    const transformedData = response.data
      .filter((scenario: RiskScenarioData) => scenario.id !== undefined)
      .map((scenario: RiskScenarioData) => ({
        id: scenario.id!,
        name: scenario.riskScenario,
        description: scenario.riskStatement || '',
      }));

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
