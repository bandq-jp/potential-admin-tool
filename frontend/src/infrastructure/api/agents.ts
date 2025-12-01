import { api } from '@/lib/api';
import type { Agent, AgentCreate, AgentStats, AgentUpdate } from '@/domain/entities/agent';

export const agentsApi = {
  getAll: (token: string) => api.get<Agent[]>('/agents', token),

  getStats: (token: string) => api.get<AgentStats[]>('/agents/stats', token),

  getById: (id: string, token: string) => api.get<Agent>(`/agents/${id}`, token),

  create: (data: AgentCreate, token: string) =>
    api.post<Agent>('/agents', data, token),

  update: (id: string, data: AgentUpdate, token: string) =>
    api.patch<Agent>(`/agents/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<{ message: string }>(`/agents/${id}`, token),
};

