'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { clientMeApi } from '@/infrastructure/api';
import type { ClientMe } from '@/domain/entities/clientMe';

export function useClientMe() {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSWR<ClientMe>(
    'client-me',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return clientMeApi.getMe(token);
    }
  );

  return {
    clientMe: data,
    isLoading,
    error,
  };
}

