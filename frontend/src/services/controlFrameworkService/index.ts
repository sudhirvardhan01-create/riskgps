import { createControlMapping, downloadFrameworkControlsTemplateFile, exportFrameworkControls, fetchFrameworkControls, importFrameworkControls } from "@/pages/api/control-framework";
import { ControlFrameworkForm } from "@/types/control";

export const ControlFrameworkService = {
        create: (data: ControlFrameworkForm) => createControlMapping(data),
        fetch: (page: number, limit: number, frameworkName: string, searchPattern?: string, sort?: string) => fetchFrameworkControls(page, limit, frameworkName, searchPattern, sort),
        download: () => downloadFrameworkControlsTemplateFile(),
        export: () => exportFrameworkControls(),
        import: (file: File) => importFrameworkControls(file),
}