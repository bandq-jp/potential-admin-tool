'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { criteriaApi } from '@/infrastructure/api';
import type {
  CriteriaGroupCreate,
  CriteriaGroupWithItems,
  CriteriaItemCreate,
} from '@/domain/entities/criteria';

export function useCriteria(jobPositionId: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<CriteriaGroupWithItems[]>(
    jobPositionId ? `criteria-${jobPositionId}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return criteriaApi.getGroupsWithItems(jobPositionId, token);
    }
  );

  const createGroup = async (data: CriteriaGroupCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await criteriaApi.createGroup(data, token);
    mutate();
    return created;
  };

  const updateGroup = async (id: string, data: Partial<CriteriaGroupCreate>) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await criteriaApi.updateGroup(id, data, token);
    mutate();
    return updated;
  };

  const deleteGroup = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    await criteriaApi.deleteGroup(id, token);
    mutate();
  };

  const createItem = async (data: CriteriaItemCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await criteriaApi.createItem(data, token);
    mutate();
    return created;
  };

  const updateItem = async (id: string, data: Partial<CriteriaItemCreate>) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await criteriaApi.updateItem(id, data, token);
    mutate();
    return updated;
  };

  return {
    criteriaGroups: data ?? [],
    isLoading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    createItem,
    updateItem,
    mutate,
  };
}

