'use client';

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import useSWR from 'swr';
import { usersApi } from '@/infrastructure/api';
import type { User } from '@/domain/entities/user';

export function useAuth() {
  const { getToken, isLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const { data: user, error, isLoading } = useSWR<User>(
    isSignedIn ? 'current-user' : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return usersApi.getCurrentUser(token);
    }
  );

  return {
    user,
    clerkUser,
    isLoaded,
    isSignedIn,
    isLoading,
    error,
    getToken,
    isAdmin: user?.role === 'admin',
  };
}

