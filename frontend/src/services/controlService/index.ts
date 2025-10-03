import {
  deleteControl,
  fetchControls,
  fetchControlsForListing,
  updateControl,
  updateControlStatus,
} from "@/pages/api/control";
import { MITREControlForm } from "@/types/control";

export const ControlService = {
  fetch: (page: number, limit: number, searchPattern: string, sort: string) =>
    fetchControls(page, limit, searchPattern, sort),
  delete: (mitreControlId: string, mitreControlNames: string[]) =>
    deleteControl(mitreControlId, mitreControlNames),
  update: (data: MITREControlForm) => updateControl(data),
  updateStatus: (mitreControlId: string, status: string) =>
    updateControlStatus(mitreControlId, status),
  fetchControlsForListing: (fields?: string) => fetchControlsForListing(fields),
};
