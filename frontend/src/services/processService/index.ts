import { createProcess, deleteProcess, fetchProcesses, fetchProcessesForListing, updateProcess, updateProcessStatus } from "@/pages/api/process";
import { Filter } from "@/types/filter";


export const ProcessService = {
  fetch: (page: number, rowsPerPage: number, searchPattern?: string, sort?: string, statusFilter?: string[], filters?: Filter[]) => fetchProcesses(page, rowsPerPage, searchPattern, sort, statusFilter, filters),
  create: (body: any) => createProcess(body),
  update: (id: number, body: any) => updateProcess(id, body),
  delete: (id: number) => deleteProcess(id),
  updateStatus: (id: number, status: string) => updateProcessStatus(id, status),
  fetchProcessesForListing: () => fetchProcessesForListing(),
};
