import { createMetaData, deleteMetaData, fetchMetaDatas, updateMetaData } from "@/pages/api/meta-data";


export const MetaDataService = {
  fetch: (page?: number, limit?: number, searchPatten?: string, sort?: string) => fetchMetaDatas(page, limit, searchPatten, sort),
  create: (body: any) => createMetaData(body),
  update: (id: number, body: any) => updateMetaData(id, body),
  delete: (id: number) => deleteMetaData(id),
};
