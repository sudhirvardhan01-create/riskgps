//Function to feth the metadata
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

//Function to delete a metadata
export const deleteMetaData = async (id: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/meta-data/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete metadata");
  }
  const res = await response.json();
  console.log(res);
  return res.msg;
}
