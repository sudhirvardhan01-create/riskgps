export const getOrganization = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};