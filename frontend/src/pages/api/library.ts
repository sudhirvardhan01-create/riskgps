export const getLibraryData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/summary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if(!response.ok){
    throw new Error("Failed to fetch Library data");
  }
  const res = await response.json();
  return res.data;
};
