export const getOrganization = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};

export const getOrganizationProcess = async (
  orgId: string | undefined,
  buId: string | undefined,
  page: number = 0,
  limit: number = 10
) => {
  if (!orgId || !buId) {
    throw new Error("Organization ID and Business Unit ID are required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/processes?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || "Failed to fetch organization processes";
    
    // If error is "No processes found" (404), treat it as empty state, not an error
    // This allows the "Add Processes" section to be visible for new business units
    if (response.status === 404 && errorMessage.toLowerCase().includes("no processes found")) {
      return {
        data: [],
        msg: "No processes found"
      };
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

export const createOrganizationProcesses = async (
  orgId: string | undefined,
  buId: string | undefined,
  processes: any[]
) => {
  if (!orgId || !buId) {
    throw new Error("Organization ID and Business Unit ID are required");
  }

  // Transform the data from GET response format to backend expectations
  // Input format: { process_dependency: [...], attributes: [{ meta_data_key_id: ..., values: [...] }], ... }
  // Output format: { processDependency: [...], attributes: [{ metaDataKeyId: ..., values: [...] }], ... }
  const transformedData = processes.map((process) => {
    // Map attributes from meta_data_key_id to metaDataKeyId
    const attributes = process.attributes?.map((attr: any) => ({
      metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
      values: attr.values || [],
    })) || [];

    // Map process_dependency to processDependency
    const processDependency = process.process_dependency?.map((dep: any) => ({
      sourceProcessId: dep.sourceProcessId || dep.source_process_id,
      targetProcessId: dep.targetProcessId || dep.target_process_id,
      relationshipType: dep.relationshipType || dep.relationship_type,
    })) || [];

    return {
      processName: process.processName,
      processDescription: process.processDescription || "",
      seniorExecutiveOwnerName: process.seniorExecutiveOwnerName || "",
      seniorExecutiveOwnerEmail: process.seniorExecutiveOwnerEmail || null,
      operationsOwnerName: process.operationsOwnerName || "",
      operationsOwnerEmail: process.operationsOwnerEmail || "",
      technologyOwnerName: process.technologyOwnerName || "",
      technologyOwnerEmail: process.technologyOwnerEmail || "",
      organizationalRevenueImpactPercentage: process.organizationalRevenueImpactPercentage || null,
      financialMateriality: process.financialMateriality || "",
      thirdPartyInvolvement: process.thirdPartyInvolvement || null,
      usersCustomers: process.usersCustomers || "",
      regulatoryAndCompliance: process.regulatoryAndCompliance || null,
      criticalityOfDataProcessed: process.criticalityOfDataProcessed || "",
      dataProcessed: process.dataProcessed || null,
      status: process.status || "published",
      processDependency: processDependency,
      attributes: attributes,
    };
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/process`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to create organization processes");
  }

  return response.json();
};

export const getOrganizationAssets = async (orgId: string | undefined) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/assets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch organization assets");
  }

  return response.json();
};

export const createOrganizationAssets = async (
  orgId: string | undefined,
  assets: any[]
) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  // Transform the data from GET response format to backend expectations
  // Input format: { related_processes: [...], attributes: [{ meta_data_key_id: ..., values: [...] }], ... }
  // Output format: { relatedProcesses: [...], attributes: [{ metaDataKeyId: ..., values: [...] }], ... }
  const transformedData = assets.map((asset) => {
    // Map attributes from meta_data_key_id to metaDataKeyId
    const attributes = asset.attributes?.map((attr: any) => ({
      metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
      values: attr.values || [],
    })) || [];

    // Map related_processes to relatedProcesses (snake_case to camelCase)
    // const relatedProcesses = asset.related_processes?.map((processId: string) => 
    //   typeof processId === 'string' ? processId : String(processId)
    // ) || [];

    return {
      applicationName: asset.applicationName,
      assetDescription: asset.assetDescription || "",
      assetCategory: asset.assetCategory || "",
      applicationOwner: asset.applicationOwner || null,
      applicationItOwner: asset.applicationItOwner || null,
      isThirdPartyManagement: asset.isThirdPartyManagement || null,
      thirdPartyName: asset.thirdPartyName || null,
      thirdPartyLocation: asset.thirdPartyLocation || null,
      hosting: asset.hosting || null,
      hostingFacility: asset.hostingFacility || null,
      cloudServiceProvider: asset.cloudServiceProvider || null,
      geographicLocation: asset.geographicLocation || null,
      hasRedundancy: asset.hasRedundancy || null,
      databases: asset.databases || null,
      hasNetworkSegmentation: asset.hasNetworkSegmentation || null,
      networkName: asset.networkName || null,
      status: asset.status || "published",
      // relatedProcesses: relatedProcesses,
      attributes: attributes,
    };
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/asset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to create organization assets");
  }

  return response.json();
};

export const getOrganizationRisks = async (orgId: string | undefined) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch organization risk scenarios");
  }

  return response.json();
};

export const getOrganizationTaxonomy = async (orgId: string | undefined) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/taxonomies`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};

export const createOrganizationRiskScenarios = async (
  orgId: string | undefined,
  riskScenarios: any[]
) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  // Transform the data to match backend expectations
  const transformedData = riskScenarios.map((scenario) => {
    // Map attributes from meta_data_key_id to metaDataKeyId
    const attributes = scenario.attributes?.map((attr: any) => ({
      metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
      values: attr.values || [],
    })) || [];

    // Map related_processes to relatedProcesses
    const relatedProcesses = scenario.related_processes?.map((processId: string) => 
      typeof processId === 'string' ? processId : String(processId)
    ) || [];

    return {
      riskScenario: scenario.riskScenario,
      riskDescription: scenario.riskDescription || "",
      riskStatement: scenario.riskStatement || "",
      ciaMapping: scenario.ciaMapping || [],
      status: scenario.status || "published",
      riskField1: scenario.riskField1 || "",
      riskField2: scenario.riskField2 || "",
      relatedProcesses: relatedProcesses,
      attributes: attributes,
    };
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to create organization risk scenarios");
  }

  return response.json();
};
