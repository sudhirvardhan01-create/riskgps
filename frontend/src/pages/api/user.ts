import { UserFormData } from "@/types/user";

export const fetchUsers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const res = await response.json();
  return res.data;
};

export const fetchRoles = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/roles`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }
  const res = await response.json();
  return res.data;
};

export const fetchUserById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user by id");
  }
  const res = await response.json();
  return res.data;
};

export const createUser = async (data: UserFormData) => {
  if (!data) {
    throw new Error("User data is required to create a user");
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create an user");
  }
  const res = await response.json();
  return res.data;
};
