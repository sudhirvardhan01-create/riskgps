import { UserEditFormData, UserFormData } from "@/types/user";

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
  if (!id) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
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

export const updateUser = async (id: string, data: UserEditFormData) => {
  if (!id) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  const res = await response.json();
  return res.data;
};

export const deleteUser = async (id: string) => {
  if (!id) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  const res = await response.json();
  return res.message;
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  console.log(id, isActive);
  if (!id) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const reqBody = { isActive };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/update-status/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update the user status");
  }
  const res = await response.json();
  return res.message;
};
