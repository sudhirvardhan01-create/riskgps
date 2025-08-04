import { MetaData } from "@/types/meta-data";

//Function to fetch the metadata
export const fetchMetaDatas = async () => {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch metadata");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}

//Function to create a metadata
export const createMetaData = async (data : MetaData) => {
  console.log(data);
  const metaData = {
    "name":data.name,
    "label": data.label,
    "input_type": data.input_type ?? null,
    "supported_values": data.supported_values,
    "applies_to": data.applies_to
};
  console.log(metaData);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data`, {
    method: "POST",
    body: JSON.stringify(metaData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if(!response.ok){
    console.error("Metadata creation failed with status:", response.status);
    const errorResponse = await response.json();
    console.log("Error response:", errorResponse);
    throw new Error("Failed to create Metadata");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}

//Function to delete a metadata
export const deleteMetaData = async (id: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete metadata");
  }
  const res = await response.json();
  console.log(res);
  return res.msg;
}

//Function to update a metadata
export const updateMetaData = async (id: number, data: MetaData) => {
  const metaData = {
    "name": data.name,
    "label": data.label,
    "input_type": data.input_type,
    "supported_values": data.supported_values,
    "applies_to": data.applies_to
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metaData),
  });
  if(!response.ok){
    throw new Error("Failed to update metadata");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}
