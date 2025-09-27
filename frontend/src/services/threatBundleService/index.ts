import {
  createThreatBundleRecords,
  deleteThreatBundleRecord,
  fetchThreatBundleRecords,
} from "@/pages/api/threat-bundle";
import { ThreatBundleForm } from "@/types/threat";

export const ThreatBundleService = {
  fetch: (bundleName: string, page: number, limit: number) =>
    fetchThreatBundleRecords(bundleName, page, limit),
  delete: (threatBundleId: string) => deleteThreatBundleRecord(threatBundleId),
  create: (data: ThreatBundleForm) => createThreatBundleRecords(data),
};
