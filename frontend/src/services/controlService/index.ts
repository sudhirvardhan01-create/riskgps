import {
  deleteControl,
  fetchControls,
  updateControl,
  updateControlStatus,
} from "@/pages/api/control";
import { ControlForm } from "@/types/control";

export const ControlService = {
  fetch: (page: number, limit: number, searchPattern: string, sort: string) =>
    fetchControls(page, limit, searchPattern, sort),
  delete: (mitreControlId: string, mitreControlName: string) =>
    deleteControl(mitreControlId, mitreControlName),
  update: (id: number, data: ControlForm) => updateControl(id, data),
  updateStatus: (
    mitreControlId: string,
    mitreControlName: string,
    status: string
  ) => updateControlStatus(mitreControlId, mitreControlName, status),
};
