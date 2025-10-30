export const getProcessList = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/process-details`,
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
  return response.json();
};
