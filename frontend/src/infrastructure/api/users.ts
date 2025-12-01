import { api } from '@/lib/api';
import type { User } from '@/domain/entities/user';

export const usersApi = {
  getCurrentUser: (token: string) => api.get<User>('/users/me', token),

  getAll: (token: string) => api.get<User[]>('/users', token),
};

