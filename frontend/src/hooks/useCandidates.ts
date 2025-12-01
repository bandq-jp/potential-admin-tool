'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { candidatesApi } from '@/infrastructure/api';
import type {
  CandidateCreate,
  CandidateUpdate,
  CandidateWithRelations,
  DashboardStats,
  FunnelStats,
} from '@/domain/entities/candidate';

interface CandidateFilters {
  company_id?: string;
  job_position_id?: string;
  agent_id?: string;
  owner_user_id?: string;
}

export function useCandidates(filters?: CandidateFilters) {
  const { getToken } = useAuth();

  const filterKey = filters
    ? Object.entries(filters)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    : '';

  const { data, error, isLoading, mutate } = useSWR<CandidateWithRelations[]>(
    `candidates-${filterKey}`,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return candidatesApi.getAll(token, filters);
    }
  );

  const createCandidate = async (data: CandidateCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await candidatesApi.create(data, token);
    mutate();
    return created;
  };

  const updateCandidate = async (id: string, data: CandidateUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await candidatesApi.update(id, data, token);
    mutate();
    return updated;
  };

  const deleteCandidate = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    await candidatesApi.delete(id, token);
    mutate();
  };

  return {
    candidates: data ?? [],
    isLoading,
    error,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    mutate,
  };
}

export function useFunnelStats(companyId?: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSWR<FunnelStats>(
    `funnel-stats-${companyId ?? 'all'}`,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return candidatesApi.getFunnelStats(token, companyId);
    }
  );

  return {
    stats: data,
    isLoading,
    error,
  };
}

export function useCandidate(id: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<CandidateWithRelations>(
    id ? `candidate-${id}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return candidatesApi.getById(id, token);
    }
  );

  return {
    candidate: data,
    isLoading,
    error,
    mutate,
  };
}

export function useDashboardStats() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    'dashboard-stats',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return candidatesApi.getDashboardStats(token);
    },
    { refreshInterval: 60000 }
  );

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  };
}

