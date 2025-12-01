'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { agentsApi } from '@/infrastructure/api';
import type { Agent, AgentCreate, AgentStats, AgentUpdate } from '@/domain/entities/agent';

export function useAgents() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Agent[]>('agents', async () => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    return agentsApi.getAll(token);
  });

  const createAgent = async (data: AgentCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await agentsApi.create(data, token);
    mutate();
    return created;
  };

  const updateAgent = async (id: string, data: AgentUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await agentsApi.update(id, data, token);
    mutate();
    return updated;
  };

  const deleteAgent = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    await agentsApi.delete(id, token);
    mutate();
  };

  return {
    agents: data ?? [],
    isLoading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    mutate,
  };
}

export function useAgentStats() {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSWR<AgentStats[]>('agent-stats', async () => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    return agentsApi.getStats(token);
  });

  return {
    stats: data ?? [],
    isLoading,
    error,
  };
}

