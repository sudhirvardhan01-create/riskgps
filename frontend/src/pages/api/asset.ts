import { AssetForm } from "@/types/asset";
import { Filter } from "@/types/filter";

//Function to fetch assets
export const fetchAssets = async (
  page: number,
  limit: number,
  searchPattern?: string,
  sort?: string,
  statusFilter?: string[],
  attributesFilter?: Filter[]
) => {
  const [sortBy, sortOrder] = (sort ?? "").split(":");
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern ?? "");
  params.append("sort_by", sortBy);
  params.append("sort_order", sortOrder);

  if (statusFilter && statusFilter?.length > 0) {
    const joinedStatusFilter = statusFilter.join(",");
    params.append("status", joinedStatusFilter);
  }

  if (attributesFilter && attributesFilter?.length) {
    const paramString = attributesFilter
      .map((obj) => {
        const [key, values] = Object.entries(obj)[0]; // each object has one key
        return `${key}:${values.join(",")}`;
      })
      .join(";");

    params.append("attrFilters", paramString);
  }
  const transformAssetData = (data: any[]): AssetForm[] => {

    return data.map((item) => ({
      id: item.id,
      assetCode: item.assetCode,
      applicationName: item.applicationName,
      assetName: item.assetName,
      assetCategory: item.assetCategory,
      assetDescription: item.assetDescription,
      applicationOwner: item.applicationOwner,
      applicationITOwner: item.applicationItOwner,
      isThirdPartyManagement: item.isThirdPartyManagement,
      thirdPartyName: item.thirdPartyName,
      thirdPartyLocation: item.thirdPartyLocation,
      hosting: item.hosting,
      hostingFacility: item.hostingFacility,
      cloudServiceProvider: item.cloudServiceProvider,
      geographicLocation: item.geographicLocation,
      hasRedundancy: item.hasRedundancy,
      databases: item.databases,
      hasNetworkSegmentation: item.hasNetworkSegmentation,
      networkName: item.networkName,
      relatedProcesses: item.related_processes,
      attributes: item.attributes,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
      status: item.status,
      industry: item.industry,
      domain: item.domain,
    }));
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch assets data");
  }
  const res = await response.json();
  if (res.data.data) res.data.data = transformAssetData(res.data.data);
  return res.data;
};

//Function to create an asset
export const createAsset = async (data: AssetForm) => {
  const assetData = {
    assetCategory: data.assetCategory,
    assetDescription: data.assetDescription,
    applicationName: data.applicationName,
    applicationOwner: data.applicationOwner,
    applicationItOwner: data.applicationITOwner,
    isThirdPartyManagement: data.isThirdPartyManagement,
    thirdPartyName: data.thirdPartyName,
    thirdPartyLocation: data.thirdPartyLocation,
    hosting: data.hosting,
    hostingFacility: data.hostingFacility,
    cloudServiceProvider: data.cloudServiceProvider,
    geographicLocation: data.geographicLocation,
    hasRedundancy: data.hasRedundancy,
    databases: data.databases,
    hasNetworkSegmentation: data.hasNetworkSegmentation,
    networkName: data.networkName,
    status: data.status,
    related_processes: data.relatedProcesses,
    attributes: data.attributes,
    industry: data.industry,
    domain: data.domain,
  };
  console.log(assetData);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset`,
    {
      method: "POST",
      body: JSON.stringify(assetData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Fetch failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to create Asset");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update an asset
export const updateAsset = async (id: number, data: AssetForm) => {
  const assetData = {
    assetCategory: data.assetCategory,
    assetDescription: data.assetDescription,
    applicationName: data.applicationName,
    applicationOwner: data.applicationOwner,
    applicationItOwner: data.applicationITOwner,
    isThirdPartyManagement: data.isThirdPartyManagement,
    thirdPartyName: data.thirdPartyName,
    thirdPartyLocation: data.thirdPartyLocation,
    hosting: data.hosting,
    hostingFacility: data.hostingFacility,
    cloudServiceProvider: data.cloudServiceProvider,
    geographicLocation: data.geographicLocation,
    hasRedundancy: data.hasRedundancy,
    databases: data.databases,
    hasNetworkSegmentation: data.hasNetworkSegmentation,
    networkName: data.networkName,
    status: data.status,
    related_processes: data.relatedProcesses,
    attributes: data.attributes,
    industry: data.industry,
    domain: data.domain,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(assetData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update an asset");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to delete an asset
export const deleteAsset = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete an asset");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update status of an asset
export const updateAssetStatus = async (id: number, status: string) => {
  if (!id || !status) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { status };
  console.log(reqBody);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/update-status/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update status of an asset");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};


export const downloadAssetTemplateFile = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/download-template-file`,
    {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to export.");
  }
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "assets.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};
//Function to export the assets
export const exportAssets = async (endpoint: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset${endpoint}`,
    {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to export.");
  }
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "assets.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};

//Function to export the assets
export const importAssets = async (file: File): Promise<any> => {
  if (!file) {
    throw new Error("No file selected.");
  }

  const formData = new FormData();
  formData.append("file", file); 

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/import`, 
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to import.");
  }

  const response = await res.json();
  console.log(response)
  return response; 
};
