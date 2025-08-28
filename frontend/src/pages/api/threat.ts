

//Function to fetch threats
export const fetchThreats = async (
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
  return res.data;
};


//Function to export the threats
export const exportThreats = async (endpoint: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls${endpoint}`,
    {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
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
  a.download = "threats.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};


//Function to download the threats template
export const downloadThreatsTemplate = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/mitre-threats-controls/download-mitre-threats-controls-import-template-file`,
    {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to download template.");
  }
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "threats-template.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};
