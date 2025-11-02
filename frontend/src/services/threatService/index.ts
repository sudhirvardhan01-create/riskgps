import {
  createThreat,
  deleteThreat,
  fetchThreats,
  fetchUniqueMitreTechniques,
  updateThreat,
  updateThreatStatus,
} from "@/pages/api/threat";
import { Filter } from "@/types/filter";
import { ThreatForm } from "@/types/threat";

export const ThreatService = {
  fetch: (
    page: number,
    limit?: number,
    searchPattern?: string,
    sort?: string,
    statusFilter?: string[],
    filters?: Filter[]
  ) => fetchThreats(page, limit, searchPattern, sort, statusFilter, filters),
  create: (data: ThreatForm) => createThreat(data),
  delete: (mitre_technique_id: string, mitre_sub_technique_id?: string) =>
    deleteThreat(mitre_technique_id, mitre_sub_technique_id),
  update: (data: ThreatForm) => updateThreat(data),
  updateStatus: (
    status: string,
    mitreTechniqueId: string,
    subTechniqueId?: string
  ) => updateThreatStatus(status, mitreTechniqueId, subTechniqueId),
  fetchUnique: () => fetchUniqueMitreTechniques(),
};
