import { createControlMapping, downloadFrameworkControlsTemplateFile, exportFrameworkControls, fetchFrameworkControls, importFrameworkControls } from "@/pages/api/control-framework";
import { ControlFrameworkForm } from "@/types/control";

export const ControlFrameworkService = {
        create: (data: ControlFrameworkForm) => createControlMapping(data),
        fetch: () => fetchFrameworkControls(),
        download: () => downloadFrameworkControlsTemplateFile(),
        export: () => exportFrameworkControls(),
        import: (file: File) => importFrameworkControls(file),
}