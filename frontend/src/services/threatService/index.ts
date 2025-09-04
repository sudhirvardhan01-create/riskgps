import {
  createThreat,
  deleteThreat,
  fetchThreats,
  updateThreat,
  updateThreatStatus,
} from "@/pages/api/threat";
import { ThreatForm } from "@/types/threat";

export const ThreatService = {
  fetch: (page: number, limit: number, searchPattern: string, sort: string) =>
    fetchThreats(page, limit, searchPattern, sort),
  create: (data: ThreatForm) => createThreat(data),
  delete: (mitre_technique_id: string, mitre_sub_technique_id?: string) => deleteThreat(mitre_technique_id, mitre_sub_technique_id),
  update: (id: number, data: ThreatForm) => updateThreat(id, data),
  updateStatus: (id: number, status: string) => updateThreatStatus(id, status),
};
