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
  const res = await response.json()

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
  const res = await response.json()

  return res;
}
