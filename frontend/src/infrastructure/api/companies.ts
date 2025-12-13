import { api } from '@/lib/api';
import type { Company, CompanyCreate, CompanyUpdate } from '@/domain/entities/company';

export const companiesApi = {
  getAll: (token: string) => api.get<Company[]>('/companies', token),

  getById: (id: string, token: string) => api.get<Company>(`/companies/${id}`, token),

  create: (data: CompanyCreate, token: string) =>
    api.post<Company>('/companies', data, token),

  update: (id: string, data: CompanyUpdate, token: string) =>
    api.patch<Company>(`/companies/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<{ message: string }>(`/companies/${id}`, token),

  inviteClientUser: (companyId: string, email: string, token: string) =>
    api.post(`/companies/${companyId}/invite`, { email }, token),
};
