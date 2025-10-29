import { ProcessService } from "@/services/processService";
import { ProcessData } from "@/types/process";

// Adapter service for processes to match the common library interface
export const ProcessLibraryService = {
  fetch: async (page: number, limit: number, searchTerm: string, sort: string) => {
    const response = await ProcessService.fetch(page, limit, searchTerm, sort);
    
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
