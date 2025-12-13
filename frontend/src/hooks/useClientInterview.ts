'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { clientInterviewsApi } from '@/infrastructure/api';
import type { ClientInterviewWithDetails } from '@/domain/entities/clientInterview';

export function useClientInterview(candidateId: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<ClientInterviewWithDetails | null>(
    candidateId ? `client-interview-${candidateId}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientInterviewsApi.getByCandidateId(candidateId, token);
    }
  );

  const getClientReport = useCallback(async (interviewId: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    return clientInterviewsApi.getClientReport(interviewId, token);
  }, [getToken]);

  return {
    interview: data,
    isLoading,
    error,
    mutate,
    getClientReport,
  };
}
