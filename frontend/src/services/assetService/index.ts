import {
  createAsset,
  deleteAsset,
  fetchAssets,
  updateAsset,
  updateAssetStatus,
  exportAssets
} from "@/pages/api/asset";

export const AssetService = {
  fetch: (page: number, limit : number, searchPattern : string, sort : string) => fetchAssets(page, limit, searchPattern, sort),
  create: (body: any) => createAsset(body),
  update: (id: number, body: any) => updateAsset(id, body),
  delete: (id: number) => deleteAsset(id),
  updateStatus: (id: number, status: string) => updateAssetStatus(id, status),
  export: () => exportAssets()
};
