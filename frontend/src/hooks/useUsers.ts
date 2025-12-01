'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { usersApi } from '@/infrastructure/api';
import type { User, UserUpdate } from '@/domain/entities/user';

export function useUsers() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<User[]>(
    'users-list',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return usersApi.getAll(token);
    }
  );

  const updateUser = async (id: string, data: UserUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await usersApi.update(id, data, token);
    mutate();
    return updated;
  };

  return {
    users: data ?? [],
    isLoading,
    error,
    updateUser,
    mutate,
  };
}

