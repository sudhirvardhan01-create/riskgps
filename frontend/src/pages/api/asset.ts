import { AssetForm } from "@/types/asset";

interface APIResponse {
  data: AssetForm[];
  page: number;
  total: number;
  totalPages: number;
}

//Function to fetch assets
export const fetchAssets = async (
  page: number,
  limit: number
): Promise<APIResponse> => {
  const params = new URLSearchParams();
  if(page) params.append("page", page.toString());
  if(limit) params.append("limit", limit.toString());

  const transformAssetData = (data: any[]): AssetForm[] => {
    return data.map((item) => ({
      id: item.id,
      asset_code: item.asset_code,
      assetName: item.asset_name,
      assetCategory: item.asset_category,
      assetOwner: item.asset_owner,
      assetITOwner: item.asset_it_owner,
      isThirdPartyManagement: item.is_third_party_management,
      thirdPartyName: item.third_party_name,
      thirdPartyLocation: item.third_party_location,
      hosting: item.hosting,
      hostingFacility: item.hosting_facility,
      cloudServiceProvider: item.cloud_service_provider,
      geographicLocation: item.geographic_location,
      isRedundancy: item.is_redundancy,
      databases: item.databases,
      isNetworkSegmentation: item.is_network_segmentation,
      networkName: item.network_name,
      related_processes: item.related_processes,
      attributes: item.attributes,
      lastUpdated: item.updated_at,
      createdAt: item.created_at,
      status: item.status,
    }));
  };
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/library/asset?${params.toString()}`,
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
  console.log(res.data);
  return res.data;
};

//Function to create an asset
export const createAsset = async (data: AssetForm) => {
  const assetData = {
    "asset_name": data.assetName,
    "asset_category": data.assetCategory,
    "asset_owner": data.assetOwner,
    "asset_it_owner": data.assetITOwner,
    "is_third_party_management": data.isThirdPartyManagement,
    "third_party_name": data.thirdPartyName,
    "third_party_location": data.thirdPartyLocation,
    "hosting": data.hosting,
    "hosting_facility": data.hostingFacility,
    "cloud_service_provider": data.cloudServiceProvider,
    "geographic_location": data.geographicLocation,
    "is_redundancy": data.isRedundancy,
    "databases": data.databases,
    "is_network_segmentation": data.isNetworkSegmentation,
    "network_name": data.networkName,
    "status": data.status,
    "related_processes": data.related_processes,
    "attributes": data.attributes,
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
export const updateAsset = async (
  id: number,
  data: AssetForm
) => {
  const assetData = {
    "asset_name": data.assetName,
    "asset_category": data.assetCategory,
    "asset_owner": data.assetOwner,
    "asset_it_owner": data.assetITOwner,
    "is_third_party_management": data.isThirdPartyManagement,
    "third_party_name": data.thirdPartyName,
    "third_party_location": data.thirdPartyLocation,
    "hosting": data.hosting,
    "hosting_facility": data.hostingFacility,
    "cloud_service_provider": data.cloudServiceProvider,
    "geographic_location": data.geographicLocation,
    "is_redundancy": data.isRedundancy,
    "databases": data.databases,
    "is_network_segmentation": data.isNetworkSegmentation,
    "network_name": data.networkName,
    "status": data.status,
    "related_processes": data.related_processes,
    "attributes": data.attributes,
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
