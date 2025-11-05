import { RiskScenarioService } from "@/services/riskScenarioService";
import { RiskScenarioData } from "@/types/risk-scenario";

// Adapter service for risk scenarios to match the common library interface
const NO_LIMIT = undefined as number | undefined;
export const RiskScenarioLibraryService = {
  fetch: async (page: number, searchTerm: string, sort: string) => {
    // Call fetch without limit parameter (using NO_LIMIT to skip the optional limit param)
    const response = await RiskScenarioService.fetch(page, NO_LIMIT, searchTerm, sort);
    
    // Transform RiskScenarioData to LibraryItem format
    const transformedData = response.data
      .filter((scenario: RiskScenarioData) => scenario.id !== undefined)
      .map((scenario: RiskScenarioData) => ({
        id: scenario.id!,
        name: scenario.riskScenario,
        description: scenario.riskStatement || '',
        riskCode: scenario.riskCode,
      }));

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
