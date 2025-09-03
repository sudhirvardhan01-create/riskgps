import { ThreatForm } from "@/types/threat";

//Function to fetch threats
export const fetchThreats = async (
  page: number,
  limit: number,
  searchPattern?: string,
  sort?: string
) => {
  const [sortBy, sortOrder] = (sort ?? "").split(":");
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern ?? "");
  params.append("sort_by", sortBy);
  params.append("sort_order", sortOrder);

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
  console.log(data);
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
  console.log(res);
  return res.data;
};

//Function to update a threat
export const updateThreat = async (id: number, data: ThreatForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/${id}`,
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
export const deleteThreat = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/${id}`,
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
export const updateThreatStatus = async (id: number, status: string) => {
  if (!id || !status) {
    throw new Error("Failed to perforom the operation, Invalid arguments");
  }
  const reqBody = { status };
  console.log(reqBody);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/update-status/${id}`,
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
  console.log(res);
  return res.data;
};


