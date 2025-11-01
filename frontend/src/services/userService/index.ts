import {
  createUser,
  deleteUser,
  fetchRoles,
  fetchUserById,
  fetchUsers,
  updateUser,
  updateUserStatus,
} from "@/pages/api/user";
import { UserEditFormData, UserFormData } from "@/types/user";

export const UserService = {
  fetch: () => fetchUsers(),
  fetchById: (id: string) => fetchUserById(id),
  fetchRoles: () => fetchRoles(),
  create: (data: UserFormData) => createUser(data),
  update: (id: string, data: UserEditFormData) => updateUser(id, data),
  delete: (id: string) => deleteUser(id),
  updateStatus: (id: string, isActive: boolean) =>
    updateUserStatus(id, isActive),
};
