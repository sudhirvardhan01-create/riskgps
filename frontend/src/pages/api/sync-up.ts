import apiClient from "@/utils/apiClient";

export const getLastSyncupDetails = async (orgId: string | undefined) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/syncup/v1/last-syncup-details/${orgId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  const res = await response.json();

  return res.data;
};

export const startSyncupJob = async (orgId: string | undefined) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/syncup/v1/data-syncup/${orgId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch api data");
  }
  const res = await response.json();

  return res;
};

export const downloadLastSyncupData = async (orgId: string | undefined) => {
  const response = await apiClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/syncup/export-reports-data/${orgId}`,
    { responseType: "blob" }
  );

  // Create blob
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Trigger download
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "reports_data_export.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
