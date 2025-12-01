'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { jobPositionsApi } from '@/infrastructure/api';
import type {
  JobPosition,
  JobPositionCreate,
  JobPositionUpdate,
} from '@/domain/entities/jobPosition';

export function useJobPositions(companyId?: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<JobPosition[]>(
    companyId ? `job-positions-${companyId}` : 'job-positions',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return jobPositionsApi.getAll(token, companyId);
    }
  );

  const createJobPosition = async (data: JobPositionCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await jobPositionsApi.create(data, token);
    mutate();
    return created;
  };

  const updateJobPosition = async (id: string, data: JobPositionUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await jobPositionsApi.update(id, data, token);
    mutate();
    return updated;
  };

  return {
    jobPositions: data ?? [],
    isLoading,
    error,
    createJobPosition,
    updateJobPosition,
    mutate,
  };
}

