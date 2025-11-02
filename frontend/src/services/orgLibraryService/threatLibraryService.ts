import { ThreatService } from "@/services/threatService";
import { ThreatForm } from "@/types/threat";

// Adapter service for threats to match the common library interface
const NO_LIMIT = undefined as number | undefined;
export const ThreatLibraryService = {
  fetch: async (page: number, searchTerm: string, sort: string) => {
    // Call fetch without limit parameter (using NO_LIMIT to skip the optional limit param)
    const response = await ThreatService.fetch(page, NO_LIMIT, searchTerm, sort, []);
    
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
