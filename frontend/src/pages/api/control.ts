import { ControlForm } from "@/types/control";

//Function to fetch controls
export const fetchControls = async (
  page: number,
  limit: number,
  searchPattern?: string,
  sort?: string,
) => {
  const [sortBy, sortOrder] = (sort ?? "").split(":");
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern ?? "");
  params.append("sort_by", sortBy);
  params.append("sort_order", sortOrder);

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
    throw new Error("Failed to fetch controls data");
  }
  const res = await response.json();
  return res.data;
};

//Function to create a control
export const createControl = async (data: ControlForm) => {
  console.log(data);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset`,
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
    throw new Error("Failed to create Control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update a control
export const updateControl = async (id: number, data: ControlForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/asset/${id}`,
    {
      method: "PUT",
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
export const deleteControl = async (id: number) => {
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
    throw new Error("Failed to delete a control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to update status of a control
export const updateControlStatus = async (id: number, status: string) => {
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
    throw new Error("Failed to update status of a control");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};
