import {
  createControlMapping,
  deleteFrameworkControl,
  downloadFrameworkControlsTemplateFile,
  exportFrameworkControls,
  fetchFrameworkControls,
  importFrameworkControls,
  updateFrameworkControl,
  updateFrameworkControlStatus,
} from "@/pages/api/control-framework";
import { ControlFrameworkForm } from "@/types/control";

export const ControlFrameworkService = {
  create: (data: ControlFrameworkForm) => createControlMapping(data),
  fetch: (
    page: number,
    limit: number,
    frameworkName: string,
    searchPattern?: string,
    sort?: string
  ) => fetchFrameworkControls(page, limit, frameworkName, searchPattern, sort),
  download: () => downloadFrameworkControlsTemplateFile(),
  export: (frameworkName: string) => exportFrameworkControls(frameworkName),
  import: (file: File) => importFrameworkControls(file),
  updateStatus: (id: number, status: string) =>
    updateFrameworkControlStatus(id, status),
  delete: (id: number) => deleteFrameworkControl(id),
  update: (id: number, data: ControlFrameworkForm) =>
    updateFrameworkControl(id, data),
};
