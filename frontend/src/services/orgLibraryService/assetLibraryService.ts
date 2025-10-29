import { AssetService } from "@/services/assetService";
import { AssetForm } from "@/types/asset";

// Adapter service for assets to match the common library interface
export const AssetLibraryService = {
  fetch: async (page: number, limit: number, searchTerm: string, sort: string) => {
    const response = await AssetService.fetch(page, limit, searchTerm, sort);
    
    // Transform AssetForm to LibraryItem format
    const transformedData = response.data
      .filter((asset: AssetForm) => asset.id !== undefined)
      .map((asset: AssetForm) => ({
        id: asset.id!,
        name: asset.applicationName,
        description: asset.assetDescription || '',
      }));

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
