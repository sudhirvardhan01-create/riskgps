import { Filter } from "@/types/filter";
import { ProcessData, ProcessDependency } from "@/types/process";

export const fetchProcesses = async (page: number, limit: number, searchPattern?: string, sort?: string, statusFilter?: string[], attributesFilter?: Filter[]) => {
  const [sortBy, sortOrder] = (sort ?? '').split(':');;
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern?? '');
  params.append("sort_by",sortBy);
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
    processCode:item.process_code,
    processName: item.process_name,
    processDescription: item.process_description,
    seniorExecutiveOwnerName: item.senior_executive__owner_name,
    seniorExecutiveOwnerEmail: item.senior_executive__owner_email,
    operationsOwnerName: item.operations__owner_name,
    operationsOwnerEmail: item.operations__owner_email,
    technologyOwnerName: item.technology_owner_name,
    technologyOwnerEmail: item.technology_owner_email,
    organizationalRevenueImpactPercentage: item.organizational_revenue_impact_percentage,
    financialMateriality: item.financial_materiality,
    thirdPartyInvolvement: item.third_party_involvement,
    users: item.users_customers ,
    requlatoryAndCompliance: item.regulatory_and_compliance,
    criticalityOfDataProcessed: item.criticality_of_data_processed,
    dataProcessed: item.data_processed,
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
    }));
    };


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to process data");
  }
  const res = await response.json();
  res.data.data = transformProcessData(res.data.data);

  return res.data;
}

export const fetchProcessesForListing = async () => {

const transformProcessData = (data: any[]): ProcessData[] => {
  return data.map((item) => ({
    id: item.id,
    processCode:item.process_code,
    processName: item.process_name,
    }));
    };


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to process data");
  }
  const res = await response.json();
  res.data.data = transformProcessData(res.data.data);

  return res.data;
}


export const createProcess = async (data: ProcessData) => {

  const reqBody = {
      "process_name": data.processName,
      "process_description": data.processDescription,
      "senior_executive__owner_name": data.seniorExecutiveOwnerName,
      "senior_executive__owner_email": data.seniorExecutiveOwnerEmail,
      "operations__owner_name": data.operationsOwnerName,
      "operations__owner_email": data.operationsOwnerEmail,
      "technology_owner_name": data.technologyOwnerName,
      "technology_owner_email": data.technologyOwnerEmail,
      "organizational_revenue_impact_percentage": data.organizationalRevenueImpactPercentage,
      "financial_materiality": data.financialMateriality,
      "third_party_involvement": data.thirdPartyInvolvement,
      "users_customers": data.users,
      "regulatory_and_compliance": data.requlatoryAndCompliance,
      "criticality_of_data_processed": data.criticalityOfDataProcessed,
      "data_processed": data.dataProcessed,
      "status": data.status,
      "attributes": data.attributes || [],
      "process_dependency" : Array.isArray(data.processDependency)
      ? data.processDependency.map((dep: ProcessDependency) => ({
          target_process_id: dep.targetProcessId,
          relationship_type: dep.relationshipType,
        }))
      : [],
      
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process`,{
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    console.error("Creation failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to create Process");
  }

  const res = await response.json();
  console.log(res);

  return res.data;

}

export const updateProcess = async (id: number, data: ProcessData) => {
  if (!id) {
    throw new Error("invalid operation")
  }

  console.log(data)
    const reqBody = {
      "process_name": data.processName,
      "process_description": data.processDescription,
      "senior_executive__owner_name": data.seniorExecutiveOwnerName,
      "senior_executive__owner_email": data.seniorExecutiveOwnerEmail,
      "operations__owner_name": data.operationsOwnerName,
      "operations__owner_email": data.operationsOwnerEmail,
      "technology_owner_name": data.technologyOwnerName,
      "technology_owner_email": data.technologyOwnerEmail,
      "organizational_revenue_impact_percentage": data.organizationalRevenueImpactPercentage,
      "financial_materiality": data.financialMateriality,
      "third_party_involvement": data.thirdPartyInvolvement,
      "users_customers": data.users,
      "regulatory_and_compliance": data.requlatoryAndCompliance,
      "criticality_of_data_processed": data.criticalityOfDataProcessed,
      "data_processed": data.dataProcessed,
      "status": data.status,
      "attributes": data.attributes || [],
      "process_dependency" : Array.isArray(data.processDependency)
      ? data.processDependency.map((dep: ProcessDependency) => ({
          source_process_id: dep.sourceProcessId,
          target_process_id: dep.targetProcessId,
          relationship_type: dep.relationshipType,
        }))
      : [],
      
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process/${id}`,{
    method: "PUT",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    console.error("Update process failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to update Process");
  }

  const res = await response.json();
  console.log(res);

  return res.data;
}

export const updateProcessStatus = async (id: number, status: string) => {
  if (!id || !status) {
      throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = {status};

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process/update-status/${id}`, {
    method: "PATCH",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to Update Risk Scenario Status Data");
  }
  const res = await response.json();
  return res.data;
}

export const deleteProcess = async (id: number) => {
  if (!id) {
    throw new Error("invalid Operation, failed to delete");
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/process/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete process data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}


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
  console.log(response)
  return response; 
};