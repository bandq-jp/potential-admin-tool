import { api } from '@/lib/api';
import type { ClientMe } from '@/domain/entities/clientMe';

export const clientMeApi = {
  getMe: (token: string) => api.get<ClientMe>('/client/me', token),
};

