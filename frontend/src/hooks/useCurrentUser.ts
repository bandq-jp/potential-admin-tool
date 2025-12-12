'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';

export interface CurrentUser {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  role: 'admin' | 'interviewer' | 'client';
  company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export function useCurrentUser() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<CurrentUser>(
    isLoaded && isSignedIn ? 'current-user' : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return api.get<CurrentUser>('/users/me', token);
    }
  );

  return {
    user: data,
    isLoading: !isLoaded || isLoading,
    isAdmin: data?.role === 'admin',
    isInterviewer: data?.role === 'interviewer',
    isClient: data?.role === 'client',
    error,
    mutate,
  };
}
