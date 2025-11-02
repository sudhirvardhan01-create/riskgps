import { ControlService } from "@/services/controlService";

// Adapter service for controls to match the common library interface
const NO_LIMIT = undefined as number | undefined;
export const ControlLibraryService = {
  fetch: async (page: number, searchTerm: string, sort: string) => {
    // Call fetch without limit parameter (using NO_LIMIT to skip the optional limit param)
    const response = await ControlService.fetch(page, NO_LIMIT, searchTerm, sort, []);
    
    // Transform control data to LibraryItem format
    // The response structure is: response.data.data
    const controlsData = response.data || [];
    
    const transformedData = controlsData
      .map((control: any) => {
        // Each control can have multiple controlDetails, we'll flatten them
        const controlItems = [];
        
        if (control.controlDetails && Array.isArray(control.controlDetails)) {
          control.controlDetails.forEach((detail: any) => {
            controlItems.push({
              id: `${control.mitreControlId}-${detail.mitreControlName}`,
              name: detail.mitreControlName,
              description: detail.subControls?.[0]?.bluOceanControlDescription || detail.subControls?.[0]?.mitreControlDescription || '',
            });
          });
        } else {
          // Fallback if no controlDetails
          controlItems.push({
            id: control.mitreControlId,
            name: control.mitreControlId,
            description: '',
          });
        }
        
        return controlItems;
      })
      .flat(); // Flatten the array of arrays

    return {
      data: transformedData,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages,
    };
  },
};
