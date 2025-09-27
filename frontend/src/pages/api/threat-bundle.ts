import { ThreatBundleForm } from "@/types/threat";

//Function to fetch the threat bundle records
export const fetchThreatBundleRecords = async (
  bundleName: string,
  page: number,
  limit: number
) => {
  if (!bundleName) {
    throw new Error("Threat Bundle Name is required");
  }
  const params = new URLSearchParams();
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("bundleName", bundleName);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/threat-bundle?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch threat bundle records");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
};

//Function to delete the threat bundle record
export const deleteThreatBundleRecord = async (threatBundleId: string) => {
  if (!threatBundleId) {
    throw new Error("Threat Bundle Id is required");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/threat-bundle/${threatBundleId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete threat bundle record");
  }
  const res = await response.json();
  return res.data;
};

//Function to create threat bundle records
export const createThreatBundleRecords = async (data: ThreatBundleForm) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/threat-bundle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create threat bundle records");
  }
  const res = await response.json();
  return res;
};
