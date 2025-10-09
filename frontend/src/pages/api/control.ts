import { MITREControlForm } from "@/types/control";
import { Filter } from "@/types/filter";

//Function to fetch controls
export const fetchControls = async (
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
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/get-controls?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch controls data");
  }
  const res = await response.json();
  console.log(res.data);
  return res.data;
};

//Function to update a control
export const updateControl = async (data: MITREControlForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/update-mitre-control`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update a control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to delete a control
export const deleteControl = async (
  mitreControlId: string,
  mitreControlNames: string[]
) => {
  if (!mitreControlNames || !mitreControlId) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { mitreControlNames };
  console.log(reqBody);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/delete-mitre-control?mitreControlId=${mitreControlId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete a control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update status of a control
export const updateControlStatus = async (
  mitreControlId: string,
  status: string
) => {
  if (!mitreControlId || !status) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { status };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/update-mitre-control-status?mitreControlId=${mitreControlId}`,
    {
      method: "PATCH",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update status of a control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to fetch all the controls for listing without pagination
export const fetchControlsForListing = async (fields?: string) => {
  const params = new URLSearchParams();
  params.append("fields", fields ?? "");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/get-controls?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch controls data");
  }
  const res = await response.json();
  console.log(res.data);
  return res.data;
};
