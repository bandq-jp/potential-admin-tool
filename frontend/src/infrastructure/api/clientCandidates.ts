import { api } from '@/lib/api';
import type { ClientCandidateWithRelations } from '@/domain/entities/clientCandidate';

interface ClientCandidateFilters {
  job_position_id?: string;
}

export const clientCandidatesApi = {
  getAll: (token: string, filters?: ClientCandidateFilters) => {
    const params = new URLSearchParams();
    if (filters?.job_position_id) params.append('job_position_id', filters.job_position_id);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<ClientCandidateWithRelations[]>(`/client/candidates${query}`, token);
  },

  getById: (id: string, token: string) =>
    api.get<ClientCandidateWithRelations>(`/client/candidates/${id}`, token),
};

