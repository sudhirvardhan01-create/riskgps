import { AssetService } from "@/services/assetService";
import { AssetForm } from "@/types/asset";

// Adapter service for assets to match the common library interface
const NO_LIMIT = undefined as number | undefined;
export const AssetLibraryService = {
  fetch: async (page: number, searchTerm: string, sort: string) => {
    // Call fetch without limit parameter (using NO_LIMIT to skip the optional limit param)
    const response = await AssetService.fetch(page, NO_LIMIT, searchTerm, sort);
    
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
