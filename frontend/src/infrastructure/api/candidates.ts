import { api } from '@/lib/api';
import type {
  CandidateCreate,
  CandidateUpdate,
  CandidateWithRelations,
  FunnelStats,
} from '@/domain/entities/candidate';

interface CandidateFilters {
  company_id?: string;
  job_position_id?: string;
  agent_id?: string;
  owner_user_id?: string;
}

export const candidatesApi = {
  getAll: (token: string, filters?: CandidateFilters) => {
    const params = new URLSearchParams();
    if (filters?.company_id) params.append('company_id', filters.company_id);
    if (filters?.job_position_id) params.append('job_position_id', filters.job_position_id);
    if (filters?.agent_id) params.append('agent_id', filters.agent_id);
    if (filters?.owner_user_id) params.append('owner_user_id', filters.owner_user_id);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<CandidateWithRelations[]>(`/candidates${query}`, token);
  },

  getFunnelStats: (token: string, companyId?: string) => {
    const query = companyId ? `?company_id=${companyId}` : '';
    return api.get<FunnelStats>(`/candidates/funnel${query}`, token);
  },

  getById: (id: string, token: string) =>
    api.get<CandidateWithRelations>(`/candidates/${id}`, token),

  create: (data: CandidateCreate, token: string) =>
    api.post<CandidateWithRelations>('/candidates', data, token),

  update: (id: string, data: CandidateUpdate, token: string) =>
    api.patch<CandidateWithRelations>(`/candidates/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<{ message: string }>(`/candidates/${id}`, token),
};

