'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { clientJobPositionsApi } from '@/infrastructure/api';
import type { JobPosition } from '@/domain/entities/jobPosition';

export function useClientJobPositions() {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSWR<JobPosition[]>(
    'client-job-positions',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientJobPositionsApi.getAll(token);
    }
  );

  return {
    jobPositions: data ?? [],
    isLoading,
    error,
  };
}

