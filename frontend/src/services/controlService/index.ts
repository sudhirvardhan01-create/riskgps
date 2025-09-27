import {
  deleteControl,
  fetchControls,
  fetchControlsForListing,
  updateControl,
  updateControlStatus,
} from "@/pages/api/control";
import { ControlForm } from "@/types/control";

export const ControlService = {
  fetch: (page: number, limit: number, searchPattern: string, sort: string) =>
    fetchControls(page, limit, searchPattern, sort),
  delete: (mitreControlId: string, mitreControlName: string) =>
    deleteControl(mitreControlId, mitreControlName),
  update: (
    data: ControlForm,
    mitreControlId: string,
    mitreControlName: string,
    mitreControlType: string
  ) => updateControl(data, mitreControlId, mitreControlName, mitreControlType),
  updateStatus: (
    mitreControlId: string,
    mitreControlName: string,
    status: string
  ) => updateControlStatus(mitreControlId, mitreControlName, status),
  fetchControlsForListing: (fields?: string) => fetchControlsForListing(fields),
};
