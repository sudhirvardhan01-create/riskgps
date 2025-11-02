import { ProcessService } from "@/services/processService";
import { ProcessData } from "@/types/process";

// Adapter service for processes to match the common library interface
const NO_LIMIT = undefined as number | undefined;
export const ProcessLibraryService = {
  fetch: async (page: number, searchTerm: string, sort: string) => {
    // Call fetch without limit parameter (using NO_LIMIT to skip the optional limit param)
    const response = await ProcessService.fetch(page, NO_LIMIT, searchTerm, sort);
    
    // Transform ProcessData to LibraryItem format
    const transformedData = response.data
      .filter((process: ProcessData) => process.id !== undefined)
      .map((process: ProcessData) => ({
        id: process.id!,
        name: process.processName,
        description: process.processDescription || '',
      }));

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
