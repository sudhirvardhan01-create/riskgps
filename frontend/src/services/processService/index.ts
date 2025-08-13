import { createProcess, deleteProcess, fetchProcesses, updateProcess, updateProcessStatus } from "@/pages/api/process";


export const ProcessService = {
  fetch: (page: number, rowsPerPage: number) => fetchProcesses(page, rowsPerPage),
  create: (body: any) => createProcess(body),
  update: (id: number, body: any) => updateProcess(id, body),
  delete: (id: number) => deleteProcess(id),
  updateStatus: (id: number, status: string) => updateProcessStatus(id, status),
};
