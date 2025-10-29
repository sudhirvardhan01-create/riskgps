import {
  createUser,
  fetchRoles,
  fetchUserById,
  fetchUsers,
} from "@/pages/api/user";
import { UserFormData } from "@/types/user";

export const UserService = {
  fetch: () => fetchUsers(),
  fetchById: (id: string) => fetchUserById(id),
  fetchRoles: () => fetchRoles(),
  create: (data: UserFormData) => createUser(data),
};
