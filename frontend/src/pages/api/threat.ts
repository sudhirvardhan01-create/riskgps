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
  return res.data;
};

