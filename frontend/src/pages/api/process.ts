import { Filter } from "@/types/filter";
import { ProcessData, ProcessDependency } from "@/types/process";

export const fetchProcesses = async (
  page: number,
  limit?: number,
  searchPattern?: string,
  sort?: string,
  statusFilter?: string[],
  attributesFilter?: Filter[]
) => {
  const [sortBy, sortOrder] = (sort ?? "").split(":");
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  if (limit !== undefined) {
    params.append("limit", JSON.stringify(limit));
  }
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

    params.append("attributes", paramString);
  }

  const transformProcessData = (data: any[]): ProcessData[] => {
    return data.map((item) => ({
      id: item.id,
      processCode: item.processCode,
      processName: item.processName,
      processDescription: item.processDescription,
      seniorExecutiveOwnerName: item.seniorExecutiveOwnerName,
      seniorExecutiveOwnerEmail: item.seniorExecutiveOwnerEmail,
      operationsOwnerName: item.operationsOwnerName,
      operationsOwnerEmail: item.operationsOwnerEmail,
      technologyOwnerName: item.technologyOwnerName,
      technologyOwnerEmail: item.technologyOwnerEmail,
      organizationalRevenueImpactPercentage:
        item.organizationalRevenueImpactPercentage,
      financialMateriality: item.financialMateriality,
      thirdPartyInvolvement: item.thirdPartyInvolvement,
      users: item.usersCustomers,
      requlatoryAndCompliance: item.requlatoryAndCompliance,
      criticalityOfDataProcessed: item.criticalityOfDataProcessed,
      dataProcessed: item.dataProcessed,
      attributes: item.attributes,
      industry: item.industry ?? [],
      processDependency: Array.isArray(item.process_dependency)
        ? item.process_dependency.map((dep: any) => ({
            sourceProcessId: dep.source_process_id,
            targetProcessId: dep.target_process_id,
            relationshipType: dep.relationship_type,
          }))
        : [],
      status: item.status,
      lastUpdated: item.updated_at,
      createdAt: item.created_at,
    }));
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to process data");
  }
  const res = await response.json();
  res.data.data = transformProcessData(res.data.data);

  return res.data;
};

export const fetchProcessesForListing = async () => {
  const transformProcessData = (data: any[]): ProcessData[] => {
    return data.map((item) => ({
      id: item.id,
      processCode: item.processCode,
      processName: item.processName,
    }));
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to process data");
  }
  const res = await response.json();
  res.data.data = transformProcessData(res.data.data ?? []);

  return res.data;
};

export const fetchOrganizationProcessesForListing = async (orgId: string) => {
  console.log(orgId)

  if (!orgId) {
    throw new Error("Ord ID Required")
  }

  const transformProcessData = (data: any[]): ProcessData[] => {
    return data.map((item) => ({
      id: item.id,
      processCode: item.processCode,
      processName: item.processName,
    }));
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/process-for-listing`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response)
  if (!response.ok) {
    // Check if it's a 404 with "No processes found" - this is a valid case, not an error
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error === "No processes found for given organization") {
        // Return empty data structure instead of throwing error
        return { data: [] };
      }
    }
    throw new Error("Failed to process data");
  }
  const res = await response.json();
  console.log(res.data)
  res.data.data = transformProcessData(res.data ?? []);

  return res.data;
};

export const createProcess = async (data: ProcessData) => {
  const reqBody = {
    processName: data.processName,
    processDescription: data.processDescription,
    seniorExecutiveOwnerName: data.seniorExecutiveOwnerName,
    seniorExecutiveOwnerEmail: data.seniorExecutiveOwnerEmail,
    operationsOwnerName: data.operationsOwnerName,
    operationsOwnerEmail: data.operationsOwnerEmail,
    technologyOwnerName: data.technologyOwnerName,
    technologyOwnerEmail: data.technologyOwnerEmail,
    organizationalRevenueImpactPercentage:
      data.organizationalRevenueImpactPercentage,
    financialMateriality: data.financialMateriality,
    thirdPartyInvolvement: data.thirdPartyInvolvement,
    usersCustomers: data.users,
    regulatoryAndCompliance: data.requlatoryAndCompliance,
    criticalityOfDataProcessed: data.criticalityOfDataProcessed,
    dataProcessed: data.dataProcessed,
    status: data.status,
    attributes: data.attributes || [],
    process_dependency: Array.isArray(data.processDependency)
      ? data.processDependency.map((dep: ProcessDependency) => ({
          target_process_id: dep.targetProcessId,
          relationship_type: dep.relationshipType,
        }))
      : [],
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process`,
    {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Creation failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to create Process");
  }

  const res = await response.json();
  console.log(res);

  return res.data;
};

export const updateProcess = async (id: number, data: ProcessData) => {
  if (!id) {
    throw new Error("invalid operation");
  }

  console.log(data);
  const reqBody = {
    processName: data.processName,
    processDescription: data.processDescription,
    seniorExecutiveOwnerName: data.seniorExecutiveOwnerName,
    seniorExecutiveOwnerEmail: data.seniorExecutiveOwnerEmail,
    operationsOwnerName: data.operationsOwnerName,
    operationsOwnerEmail: data.operationsOwnerEmail,
    technologyOwnerName: data.technologyOwnerName,
    technologyOwnerEmail: data.technologyOwnerEmail,
    organizationalRevenueImpactPercentage:
      data.organizationalRevenueImpactPercentage,
    financialMateriality: data.financialMateriality,
    thirdPartyInvolvement: data.thirdPartyInvolvement,
    usersCustomers: data.users,
    regulatoryAndCompliance: data.requlatoryAndCompliance,
    criticalityOfDataProcessed: data.criticalityOfDataProcessed,
    dataProcessed: data.dataProcessed,
    status: data.status,
    attributes: data.attributes || [],
    process_dependency: Array.isArray(data.processDependency)
      ? data.processDependency.map((dep: ProcessDependency) => ({
          source_process_id: dep.sourceProcessId,
          target_process_id: dep.targetProcessId,
          relationship_type: dep.relationshipType,
        }))
      : [],
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Update process failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to update Process");
  }

  const res = await response.json();
  console.log(res);

  return res.data;
};

export const updateProcessStatus = async (id: number, status: string) => {
  if (!id || !status) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { status };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/update-status/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to Update Risk Scenario Status Data");
  }
  const res = await response.json();
  return res.data;
};

export const deleteProcess = async (id: number) => {
  if (!id) {
    throw new Error("invalid Operation, failed to delete");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete process data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

export const fetchProcessById = async (id: string | number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch process");
  }

  const res = await response.json();
  return res.data;
};

export const downloadProcessTemplateFile = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/download-template-file`,
    {
      method: "GET",
      headers: {
        Accept: "text/csv",
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
export const exportProcesses = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/export`,
    {
      method: "GET",
      headers: {
        Accept: "text/csv",
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
export const importProcesses = async (file: File): Promise<any> => {
  if (!file) {
    throw new Error("No file selected.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/process/import`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to import.");
  }

  const response = await res.json();
  console.log(response);
  return response;
};
