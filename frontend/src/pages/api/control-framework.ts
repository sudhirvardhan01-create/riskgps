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

//Function to fetch the framework controls
export const fetchFrameworkControls = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/controls/get-all-framework-control`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if(!response.ok){
        throw new Error("Failed to fetch Controls");
    }
    const res = await response.json();
    console.log(res.data);
    return res.data;
}

//Function to download the framework controls template file
export const downloadFrameworkControlsTemplateFile = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/controls/download-framework-template`,
        {
            method: "GET",
            headers: {
                Accept: "text/csv",
            },
        }
    );
    if (!response.ok) {
        throw new Error("Failed to download template file.");
    }
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `controls_template_file.csv`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};

//Function to export the framework controls
export const exportFrameworkControls = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/controls/export-frameworks`,
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
    a.download = `controls_exports.csv`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
};

//Function to import the framework controls
export const importFrameworkControls = async (file: File): Promise<any> => {
    if (!file) {
        throw new Error("No file selected.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/controls/import-framework-controls`,
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