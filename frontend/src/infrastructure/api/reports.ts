import { api } from '@/lib/api';

export const reportsApi = {
  generateClientReport: (interviewId: string, token: string) =>
    api.get<{ markdown: string }>(`/reports/client/${interviewId}`, token),

  generateAgentReport: (interviewId: string, token: string) =>
    api.get<{ markdown: string }>(`/reports/agent/${interviewId}`, token),
};

