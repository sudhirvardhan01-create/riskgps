import { AssetForm } from "@/types/asset";

//Function to fetch assets
export const fetchAssets = async (
  page: number,
  limit: number,
  searchPattern?: string,
  sort?: string
) => {
  const [sortBy, sortOrder] = (sort ?? '').split(':');
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern ?? '');
  params.append("sort_by", sortBy);
  params.append("sort_order", sortOrder);

  const transformAssetData = (data: any[]): AssetForm[] => {
    return data.map((item) => ({
      id: item.id,
      assetCode: item.asset_code,
      applicationName: item.application_name,
      assetName: item.asset_name,
      assetCategory: item.asset_category,
      assetDescription: item.asset_description,
      applicationOwner: item.application_owner,
      applicationITOwner: item.application_it_owner,
      isThirdPartyManagement: item.is_third_party_management,
      thirdPartyName: item.third_party_name,
      thirdPartyLocation: item.third_party_location,
      hosting: item.hosting,
      hostingFacility: item.hosting_facility,
      cloudServiceProvider: item.cloud_service_provider,
      geographicLocation: item.geographic_location,
      hasRedundancy: item.has_redundancy,
      databases: item.databases,
      hasNetworkSegmentation: item.has_network_segmentation,
      networkName: item.network_name,
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
  console.log(res.data);
  return res.data;
};

//Function to create an asset
export const createAsset = async (data: AssetForm) => {
  const assetData = {
    asset_name: data.assetName,
    asset_category: data.assetCategory,
    asset_description: data.assetDescription,
    application_name: data.applicationName,
    application_owner: data.applicationOwner,
    application_it_owner: data.applicationITOwner,
    is_third_party_management: data.isThirdPartyManagement,
    third_party_name: data.thirdPartyName,
    third_party_location: data.thirdPartyLocation,
    hosting: data.hosting,
    hosting_facility: data.hostingFacility,
    cloud_service_provider: data.cloudServiceProvider,
    geographic_location: data.geographicLocation,
    has_redundancy: data.hasRedundancy,
    databases: data.databases,
    has_network_segmentation: data.hasNetworkSegmentation,
    network_name: data.networkName,
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
    asset_name: data.assetName,
    asset_category: data.assetCategory,
    asset_description: data.assetDescription,
    application_name: data.applicationName,
    application_owner: data.applicationOwner,
    application_it_owner: data.applicationITOwner,
    is_third_party_management: data.isThirdPartyManagement,
    third_party_name: data.thirdPartyName,
    third_party_location: data.thirdPartyLocation,
    hosting: data.hosting,
    hosting_facility: data.hostingFacility,
    cloud_service_provider: data.cloudServiceProvider,
    geographic_location: data.geographicLocation,
    has_redundancy: data.hasRedundancy,
    databases: data.databases,
    has_network_segmentation: data.hasNetworkSegmentation,
    network_name: data.networkName,
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
