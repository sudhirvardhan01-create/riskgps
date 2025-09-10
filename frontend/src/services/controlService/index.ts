import { deleteControl, fetchControls, updateControl, updateControlStatus } from "@/pages/api/control";
import { ControlForm } from "@/types/control";

export const ControlService = {
    fetch: (page: number, limit: number, searchPattern: string, sort: string) => fetchControls(page, limit, searchPattern, sort),
    delete: (id: number) => deleteControl(id),
    update: (id: number, data: ControlForm) => updateControl(id, data),
    updateStatus : (id: number, status: string) => updateControlStatus(id, status)
}