import { Filter } from "@/types/filter";
import { RiskScenarioData } from "@/types/risk-scenario";

interface APIResponse {
  data: RiskScenarioData[];
  page: number;
  total: number;
  totalPages: number;

}

export const fetchRiskScenarioById = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}

export const fetchRiskScenarios = async (page: number, limit: number, searchPattern?: string, sort?: string, statusFilter?: string[], attributesFilter?: Filter[]):Promise<APIResponse> => {
  const [sortBy, sortOrder] = (sort?? '').split(":");
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  params.append("sort_by",sortBy);
  params.append("sort_order", sortOrder);
  params.append("search", searchPattern?? "");

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

  const transformRiskData = (data: any[]): RiskScenarioData[] => {
  return data.map((item) => ({
    id: item.id,
    risk_code: item.riskCode,
    riskScenario: item.riskScenario,
    riskStatement: item.riskStatement,
    riskDescription: item.riskDescription,
    ciaMapping: item.ciaMapping,
    industry: item.industry,
    tags: item.tags,
    related_processes: item.related_processes,
    assets: item.assets,
    threats: item.threats,
    riskField1: item.riskField1,
    riskField2: item.riskField2,
    attributes: item.attributes,
    lastUpdated: item.updated_at,
    createdAt: item.created_at,
    status: item.status,
  }));
};
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch risk scenario data");
  }
  const res = await response.json();
  if (res.data.data)
  res.data.data = transformRiskData(res.data.data );
  console.log(res.data);
  return res.data;
};


export const createRiskScenario = async (data: RiskScenarioData) => {
  const riskScenarioData = {
    "riskScenario": data.riskScenario,
    "riskDescription": data.riskDescription,
    "riskStatement": data.riskStatement, 
    "ciaMapping": data.ciaMapping,
    "riskField1": data.riskField1?? null,
    "riskField2": data.riskField2?? null,
    "status": data.status,
    "related_processes": data.related_processes,
    "attributes": data.attributes
  };


  console.log(riskScenarioData);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario`, {
    method: "POST",
    body: JSON.stringify(riskScenarioData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
  console.error("Fetch failed with status:", response.status);
  const errorResponse = await response.json(); // if API returns error details
  console.log("Error response:", errorResponse);
  throw new Error("Failed to create Risk Scenario");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}

export const updateRiskScenario = async (id: number, data: any) => {
    const riskScenarioData = {
    "riskScenario": data.riskScenario,
    "riskDescription": data.riskDescription,
    "riskStatement": data.riskStatement, 
    "ciaMapping": data.ciaMapping,
    "riskField1": data.riskField1?? null,
    "riskField2": data.riskField2?? null,
    "status": data.status,
    "related_processes": data.related_processes,
    "attributes": data.attributes
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario/${id}`, {
    method: "PUT",
    body: JSON.stringify(riskScenarioData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to update risk scenario data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;

}

export const deleteRiskScenario = async (id: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete risks scenario data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}


export const fetchRiskScenarioMetaData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Risk Scenario Meta data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}

export const updateRiskScenarioStatus = async (id: number, status: string) => {
  if (!id || !status) {
      throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = {status};

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/risk-scenario/update-status/${id}`, {
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
  console.log(res);
  return res.data;
}
