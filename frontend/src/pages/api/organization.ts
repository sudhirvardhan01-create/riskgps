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
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/processes-v2?page=${page}&limit=${limit}`,
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

export const getOrganizationProcessesWithoutBU = async (
  orgId: string | undefined
) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/process-for-listing`,
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
    if (response.status === 404 && errorMessage.toLowerCase().includes("no processes found")) {
      return {
        data: [],
        msg: "No processes found"
      };
    }
    
    throw new Error(errorMessage);
  }

  const res = await response.json();
  // The API returns { data: [...], msg: "..." }
  // Transform to match the expected format with pagination structure
  return {
    data: {
      data: res.data || [],
      total: res.data?.length || 0,
      page: 0,
      limit: res.data?.length || 0,
      totalPages: 1,
    },
    msg: res.msg || "Processes fetched successfully"
  };
};

export const createOrganizationProcess = async (
  orgId: string | undefined,
  buId: string | undefined,
  processData: any
) => {
  if (!orgId || !buId) {
    throw new Error("Organization ID and Business Unit ID are required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  const attributes = processData.attributes?.map((attr: any) => ({
    metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
    values: attr.values || [],
  })) || [];

  // Map process_dependency to processDependency
  const processDependency = processData.process_dependency?.map((dep: any) => ({
    sourceProcessId: dep.sourceProcessId || dep.source_process_id,
    targetProcessId: dep.targetProcessId || dep.target_process_id,
    relationshipType: dep.relationshipType || dep.relationship_type,
  })) || [];

  // Helper function to convert empty strings to null (matching backend behavior)
  const emptyToNull = (value: any) => (value === "" ? null : value);

  const transformedData: any = {
    // Optional fields for updates
    ...(processData.id && { id: processData.id }),
    ...(processData.parentObjectId && { parentObjectId: processData.parentObjectId }),
    // Required field
    processName: processData.processName,
    // All other fields - convert empty strings to null to match backend
    processDescription: emptyToNull(processData.processDescription),
    seniorExecutiveOwnerName: emptyToNull(processData.seniorExecutiveOwnerName),
    seniorExecutiveOwnerEmail: emptyToNull(processData.seniorExecutiveOwnerEmail),
    operationsOwnerName: emptyToNull(processData.operationsOwnerName),
    operationsOwnerEmail: emptyToNull(processData.operationsOwnerEmail),
    technologyOwnerName: emptyToNull(processData.technologyOwnerName),
    technologyOwnerEmail: emptyToNull(processData.technologyOwnerEmail),
    organizationalRevenueImpactPercentage: emptyToNull(processData.organizationalRevenueImpactPercentage),
    financialMateriality: emptyToNull(processData.financialMateriality),
    thirdPartyInvolvement: processData.thirdPartyInvolvement ?? null,
    usersCustomers: emptyToNull(processData.usersCustomers),
    regulatoryAndCompliance: emptyToNull(processData.regulatoryAndCompliance),
    criticalityOfDataProcessed: emptyToNull(processData.criticalityOfDataProcessed),
    dataProcessed: emptyToNull(processData.dataProcessed),
    status: processData.status || "published",
    processDependency: processDependency,
    attributes: attributes,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/add-process`,
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
    throw new Error(errorData.error || errorData.message || "Failed to create organization process");
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
      parentObjectId: process.id
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

export const updateOrganizationProcess = async (
  orgId: string | undefined,
  buId: string | undefined,
  processId: string | undefined,
  processData: any
) => {
  if (!orgId || !buId || !processId) {
    throw new Error("Organization ID, Business Unit ID, and Process ID are required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  // Filter out invalid attributes (must have metaDataKeyId and values array)
  const attributes = processData.attributes
    ?.map((attr: any) => {
      const metaDataKeyId = attr.meta_data_key_id || attr.metaDataKeyId;
      const values = Array.isArray(attr.values) ? attr.values : [];
      
      // Only include attributes that have metaDataKeyId (values can be empty array)
      if (metaDataKeyId) {
        return {
          metaDataKeyId: metaDataKeyId,
          values: values,
        };
      }
      return null;
    })
    .filter((attr: any) => attr !== null) || [];

  // Map processDependency from camelCase to the expected format
  const processDependency = processData.processDependency?.map((dep: any) => ({
    sourceProcessId: dep.sourceProcessId || dep.source_process_id,
    targetProcessId: dep.targetProcessId || dep.target_process_id,
    relationshipType: dep.relationshipType || dep.relationship_type,
  })) || [];

  const transformedData = {
    processName: processData.processName,
    processDescription: processData.processDescription || "",
    seniorExecutiveOwnerName: processData.seniorExecutiveOwnerName || "",
    seniorExecutiveOwnerEmail: processData.seniorExecutiveOwnerEmail || null,
    operationsOwnerName: processData.operationsOwnerName || "",
    operationsOwnerEmail: processData.operationsOwnerEmail || "",
    technologyOwnerName: processData.technologyOwnerName || "",
    technologyOwnerEmail: processData.technologyOwnerEmail || "",
    organizationalRevenueImpactPercentage: processData.organizationalRevenueImpactPercentage || null,
    financialMateriality: typeof processData.financialMateriality === 'boolean' 
      ? String(processData.financialMateriality) 
      : processData.financialMateriality || "",
    thirdPartyInvolvement: typeof processData.thirdPartyInvolvement === 'boolean' 
      ? processData.thirdPartyInvolvement 
      : processData.thirdPartyInvolvement === 'true',
    usersCustomers: processData.usersCustomers || processData.users || "",
    regulatoryAndCompliance: processData.regulatoryAndCompliance || processData.requlatoryAndCompliance || null,
    criticalityOfDataProcessed: processData.criticalityOfDataProcessed || "",
    dataProcessed: processData.dataProcessed || null,
    status: processData.status || "published",
    attributes: attributes,
    processDependency: processDependency,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/process/${processId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || "Failed to update organization process";
    console.error("Update process error:", errorData);
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getOrganizationAssets = async (orgId: string | undefined) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/assets-v2`,
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

export const createOrganizationAsset = async (
  orgId: string | undefined,
  asset: any
) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  const attributes = asset.attributes?.map((attr: any) => ({
    metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
    values: attr.values || [],
  })) || [];

  // Map related_processes to relatedProcesses
  const relatedProcesses = asset.related_processes?.map((processId: string | number) => 
    typeof processId === 'string' ? processId : String(processId)
  ) || [];

  const transformedData = {
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
    relatedProcesses: relatedProcesses,
    attributes: attributes,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/add-asset`,
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
    throw new Error(errorData.error || errorData.message || "Failed to create organization asset");
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
      parentObjectId: asset.id
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

export const updateOrganizationAsset = async (
  orgId: string | undefined,
  assetId: string | undefined,
  asset: any
) => {
  if (!orgId || !assetId) {
    throw new Error("Organization ID and Asset ID are required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  const attributes = asset.attributes?.map((attr: any) => ({
    metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
    values: attr.values || [],
  })) || [];

  // Map relatedProcesses - handle both number[] and string[]
  // The API expects organization process IDs as strings
  const relatedProcesses = asset.relatedProcesses?.map((processId: string | number) => 
    typeof processId === 'string' ? processId : String(processId)
  ) || [];

  const transformedData = {
    applicationName: asset.applicationName,
    applicationOwner: asset.applicationOwner || null,
    applicationItOwner: asset.applicationITOwner || asset.applicationItOwner || null,
    isThirdPartyManagement: asset.isThirdPartyManagement ?? null,
    thirdPartyName: asset.thirdPartyName || null,
    thirdPartyLocation: asset.thirdPartyLocation || null,
    hosting: asset.hosting || null,
    hostingFacility: asset.hostingFacility || null,
    cloudServiceProvider: asset.cloudServiceProvider || null,
    geographicLocation: asset.geographicLocation || null,
    hasRedundancy: asset.hasRedundancy ?? null,
    databases: asset.databases || null,
    hasNetworkSegmentation: asset.hasNetworkSegmentation ?? null,
    networkName: asset.networkName || null,
    assetCategory: asset.assetCategory || "",
    assetName: asset.assetName || null,
    assetDescription: asset.assetDescription || "",
    relatedProcesses: relatedProcesses,
    attributes: attributes,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/asset/${assetId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to update organization asset");
  }

  return response.json();
};

export const getOrganizationRisks = async (orgId: string | undefined) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios-v2`,
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

export const createOrganizationRiskScenario = async (
  orgId: string | undefined,
  riskScenario: any
) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  const attributes = riskScenario.attributes?.map((attr: any) => ({
    metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
    values: attr.values || [],
  })) || [];

  // Map related_processes to relatedProcesses
  const relatedProcesses = riskScenario.related_processes?.map((processId: string) => 
    typeof processId === 'string' ? processId : String(processId)
  ) || [];

  const transformedData = {
    riskScenario: riskScenario.riskScenario,
    riskDescription: riskScenario.riskDescription || "",
    riskStatement: riskScenario.riskStatement || "",
    ciaMapping: riskScenario.ciaMapping || [],
    status: riskScenario.status || "published",
    riskField1: riskScenario.riskField1 || "",
    riskField2: riskScenario.riskField2 || "",
    relatedProcesses: relatedProcesses,
    attributes: attributes,
    parentObjectId: riskScenario.id,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/add-risk-scenarios`,
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
    throw new Error(errorData.error || errorData.message || "Failed to create organization risk scenario");
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
      parentObjectId: scenario.id,
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

export const updateOrganizationRiskScenario = async (
  orgId: string | undefined,
  riskScenarioId: string | undefined,
  riskScenario: any
) => {
  if (!orgId || !riskScenarioId) {
    throw new Error("Organization ID and Risk Scenario ID are required");
  }

  // Transform the data to match backend expectations
  // Map attributes from meta_data_key_id to metaDataKeyId
  const attributes = riskScenario.attributes?.map((attr: any) => ({
    metaDataKeyId: attr.meta_data_key_id || attr.metaDataKeyId,
    values: attr.values || [],
  })) || [];

  // Map related_processes to relatedProcesses
  const relatedProcesses = riskScenario.related_processes?.map((processId: string) => 
    typeof processId === 'string' ? processId : String(processId)
  ) || [];

  const transformedData = {
    riskScenario: riskScenario.riskScenario,
    riskDescription: riskScenario.riskDescription || "",
    riskStatement: riskScenario.riskStatement || "",
    ciaMapping: riskScenario.ciaMapping || [],
    status: riskScenario.status || "published",
    riskField1: riskScenario.riskField1 || "",
    riskField2: riskScenario.riskField2 || "",
    relatedProcesses: relatedProcesses,
    attributes: attributes,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios/${riskScenarioId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to update organization risk scenario");
  }

  return response.json();
};

export const deleteOrganizationRiskScenario = async (
  orgId: string | undefined,
  riskScenarioIds: string[] | string | undefined
) => {
  if (!orgId || !riskScenarioIds) {
    throw new Error("Organization ID and Risk Scenario ID(s) are required");
  }

  // Convert single ID to array for consistency
  const ids = Array.isArray(riskScenarioIds) ? riskScenarioIds : [riskScenarioIds];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ids,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete organization risk scenario");
  }

  return response.json();
};

export const deleteOrganizationAsset = async (
  orgId: string | undefined,
  assetIds: string[] | string | undefined
) => {
  if (!orgId || !assetIds) {
    throw new Error("Organization ID and Asset ID(s) are required");
  }

  // Convert single ID to array for consistency
  const ids = Array.isArray(assetIds) ? assetIds : [assetIds];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/asset`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ids,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete organization asset");
  }

  return response.json();
};

export const deleteOrganizationProcess = async (
  orgId: string | undefined,
  buId: string | undefined,
  processIds: string[] | string | undefined
) => {
  if (!orgId || !buId || !processIds) {
    throw new Error("Organization ID, Business Unit ID, and Process ID(s) are required");
  }

  // Convert single ID to array for consistency
  const ids = Array.isArray(processIds) ? processIds : [processIds];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/process`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ids,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete organization process");
  }

  return response.json();
};

export const getOrganizationProcessDetails = async (orgId: string | undefined) => {
  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/process-details/${orgId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch organization process details");
  }

  return response.json();
};
