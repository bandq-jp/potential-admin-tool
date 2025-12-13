'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { clientCriteriaApi } from '@/infrastructure/api';
import type { CriteriaGroupWithItems } from '@/domain/entities/criteria';

export function useClientCriteria(jobPositionId: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSWR<CriteriaGroupWithItems[]>(
    jobPositionId ? `client-criteria-${jobPositionId}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientCriteriaApi.getGroupsWithItems(jobPositionId, token);
    }
  );

  return {
    criteriaGroups: data ?? [],
    isLoading,
    error,
  };
}

