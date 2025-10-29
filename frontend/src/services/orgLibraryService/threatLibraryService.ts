import { ThreatService } from "@/services/threatService";
import { ThreatForm } from "@/types/threat";

// Adapter service for threats to match the common library interface
export const ThreatLibraryService = {
  fetch: async (page: number, limit: number, searchTerm: string, sort: string) => {
    const response = await ThreatService.fetch(page, limit, searchTerm, sort, []);
    
    // Transform ThreatForm to LibraryItem format
    const transformedData = response.data
      .filter((threat: ThreatForm) => threat.id !== undefined)
      .map((threat: ThreatForm) => ({
        id: threat.id!,
        name: threat.mitreTechniqueName,
        description: threat.subTechniqueName || '',
      }));

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
