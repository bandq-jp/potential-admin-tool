import { api } from '@/lib/api';
import type { JobPosition } from '@/domain/entities/jobPosition';

export const clientJobPositionsApi = {
  getAll: (token: string) => api.get<JobPosition[]>('/client/job-positions', token),
};

