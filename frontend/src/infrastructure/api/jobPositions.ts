import { api } from '@/lib/api';
import type {
  JobPosition,
  JobPositionCreate,
  JobPositionUpdate,
} from '@/domain/entities/jobPosition';

export const jobPositionsApi = {
  getAll: (token: string, companyId?: string) => {
    const query = companyId ? `?company_id=${companyId}` : '';
    return api.get<JobPosition[]>(`/job-positions${query}`, token);
  },

  getById: (id: string, token: string) =>
    api.get<JobPosition>(`/job-positions/${id}`, token),

  create: (data: JobPositionCreate, token: string) =>
    api.post<JobPosition>('/job-positions', data, token),

  update: (id: string, data: JobPositionUpdate, token: string) =>
    api.patch<JobPosition>(`/job-positions/${id}`, data, token),
};

