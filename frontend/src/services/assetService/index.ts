import {
  createAsset,
  deleteAsset,
  fetchAssets,
  updateAsset,
  updateAssetStatus,
} from "@/pages/api/asset";

export const AssetService = {
  fetch: (page: number) => fetchAssets(page),
  create: (body: any) => createAsset(body),
  update: (id: number, body: any) => updateAsset(id, body),
  delete: (id: number) => deleteAsset(id),
  updateStatus: (id: number, status: string) => updateAssetStatus(id, status),
};
