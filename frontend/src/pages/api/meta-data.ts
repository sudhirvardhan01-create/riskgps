export const fetchMetaDatas = async () => {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const res = await response.json();
  console.log(res);
  return res.data;
}