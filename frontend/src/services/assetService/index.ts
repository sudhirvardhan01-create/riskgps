import {
  createAsset,
  deleteAsset,
  fetchAssets,
  updateAsset,
  updateAssetStatus,
  exportAssets
} from "@/pages/api/asset";
import { Filter } from "@/types/filter";

export const AssetService = {
  fetch: (page: number, limit : number, searchPattern : string, sort : string, statusFilter?: string[], filters?: Filter[]) => fetchAssets(page, limit, searchPattern, sort, statusFilter, filters),
  create: (body: any) => createAsset(body),
  update: (id: number, body: any) => updateAsset(id, body),
  delete: (id: number) => deleteAsset(id),
  updateStatus: (id: number, status: string) => updateAssetStatus(id, status),
  export: (endpoint : string) => exportAssets(endpoint)
};
