import { Filter } from "@/types/filter";
import { ThreatForm } from "@/types/threat";
import { RssFeed } from "@mui/icons-material";

//Function to fetch threats
export const fetchThreats = async (
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch threats data");
  }
  const res = await response.json();
  console.log(res.data);
  console.log(res.data.data.length);
  return res.data;
};

//Function to create a threat
export const createThreat = async (data: ThreatForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Fetch failed with status:", response.status);
    const errorResponse = await response.json(); // if API returns error details
    console.log("Error response:", errorResponse);
    throw new Error("Failed to create Threat");
  }
  const res = await response.json();
  return res.data;
};

//Function to update a threat
export const updateThreat = async (data: ThreatForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/update`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update a threat");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to delete a threat
export const deleteThreat = async (
  mitre_technique_id: string,
  mitre_sub_technique_id?: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/delete-threats?mitre_technique_id=${mitre_technique_id}&&mitre_sub_technique_id=${mitre_sub_technique_id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete a threat");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update status of a threat
export const updateThreatStatus = async (
  status: string,
  mitreTechniqueId: string,
  subTechniqueId?: string
) => {
  if (!mitreTechniqueId || !status) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { status };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/update-status?mitreTechniqueId=${mitreTechniqueId}&&subTechniqueId=${subTechniqueId}`,
    {
      method: "PATCH",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update status of a threat");
  }
  const res = await response.json();
  return res.data;
};

export const fetchUniqueMitreTechniques = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/unique-mitre-technique`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch unique MITRE Techniques");
  }
  const res = await response.json();
  return res.data;
};
