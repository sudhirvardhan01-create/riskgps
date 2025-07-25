export const login = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
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

export const register = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  organisation: string,
  communicationPreference: "Email" | "Phone" | "Both",
  message: string,
  roleName: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        organisation,
        communicationPreference,
        message,
        roleName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch register data");
  }
  return response.json();
};
