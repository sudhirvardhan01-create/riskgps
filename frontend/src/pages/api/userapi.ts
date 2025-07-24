export const fetchUserData = async (userName: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    body: JSON.stringify({ name: userName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};
