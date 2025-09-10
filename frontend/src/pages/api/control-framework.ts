import { ControlFrameworkForm } from "@/types/control";

//Function to create a control mapping
export const createControlMapping = async (data: ControlFrameworkForm) => {
  console.log(data);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/controls/framework-control`,
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
    throw new Error("Failed to create Control Mapping");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};