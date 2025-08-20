import { createProcess, deleteProcess, fetchProcesses, updateProcess, updateProcessStatus } from "@/pages/api/process";
import { Filter } from "@/types/filter";


export const ProcessService = {
  fetch: (page: number, rowsPerPage: number, searchPattern?: string, sort?: string, filters?: Filter[]) => fetchProcesses(page, rowsPerPage, searchPattern, sort, filters),
  create: (body: any) => createProcess(body),
  update: (id: number, body: any) => updateProcess(id, body),
  delete: (id: number) => deleteProcess(id),
  updateStatus: (id: number, status: string) => updateProcessStatus(id, status),
};
