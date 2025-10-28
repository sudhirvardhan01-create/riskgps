import { fetchUserById, fetchUsers } from "@/pages/api/user";

export const UserService = {
  fetch: () => fetchUsers(),
  fetchById: (id: string) => fetchUserById(id),
};
