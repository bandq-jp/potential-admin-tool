import { api } from '@/lib/api';
import type { User, UserUpdate } from '@/domain/entities/user';

export const usersApi = {
  getCurrentUser: (token: string) => api.get<User>('/users/me', token),

  getAll: (token: string) => api.get<User[]>('/users', token),

  update: (id: string, data: UserUpdate, token: string) =>
    api.patch<User>(`/users/${id}`, data, token),
};
