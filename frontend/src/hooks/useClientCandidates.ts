'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { clientCandidatesApi } from '@/infrastructure/api';
import type { ClientCandidateWithRelations } from '@/domain/entities/clientCandidate';

interface ClientCandidateFilters {
  job_position_id?: string;
}

export function useClientCandidates(filters?: ClientCandidateFilters) {
  const { getToken } = useAuth();

  const filterKey = filters
    ? Object.entries(filters)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    : '';

  const { data, error, isLoading, mutate } = useSWR<ClientCandidateWithRelations[]>(
    `client-candidates-${filterKey}`,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientCandidatesApi.getAll(token, filters);
    }
  );

  return {
    candidates: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useClientCandidate(id: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<ClientCandidateWithRelations>(
    id ? `client-candidate-${id}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientCandidatesApi.getById(id, token);
    }
  );

  return {
    candidate: data,
    isLoading,
    error,
    mutate,
  };
}

