import {
  deleteControl,
  fetchControls,
  fetchControlsForListing,
  updateControl,
  updateControlStatus,
} from "@/pages/api/control";
import { MITREControlForm } from "@/types/control";
import { Filter } from "@/types/filter";

export const ControlService = {
  fetch: (page: number, limit?: number, searchPattern?: string, sort?: string, statusFilter?: string[], filters?: Filter[]) =>
    fetchControls(page, limit, searchPattern, sort, statusFilter, filters),
  delete: (mitreControlId: string, mitreControlNames: string[]) =>
    deleteControl(mitreControlId, mitreControlNames),
  update: (data: MITREControlForm) => updateControl(data),
  updateStatus: (mitreControlId: string, status: string) =>
    updateControlStatus(mitreControlId, status),
  fetchControlsForListing: (fields?: string) => fetchControlsForListing(fields),
};
