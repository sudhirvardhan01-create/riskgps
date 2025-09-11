import { createControlMapping, downloadFrameworkControlsTemplateFile, fetchFrameworkControls } from "@/pages/api/control-framework";
import { ControlFrameworkForm } from "@/types/control";

export const ControlFrameworkService = {
        create: (data: ControlFrameworkForm) => createControlMapping(data),
        fetch: () => fetchFrameworkControls(),
        download: () => downloadFrameworkControlsTemplateFile(),
}