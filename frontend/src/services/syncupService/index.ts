import { downloadLastSyncupData, getLastSyncupDetails, startSyncupJob } from "@/pages/api/sync-up";

export const SyncupService = {
  getLastSyncupDetails: (orgId: string | undefined) => getLastSyncupDetails(orgId),
  startSyncupJob: (orgId: string | undefined) => startSyncupJob(orgId),
  downloadLastSyncupData: (orgId: string | undefined) => downloadLastSyncupData(orgId)
};