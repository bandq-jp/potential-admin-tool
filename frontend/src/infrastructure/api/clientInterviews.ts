import { api } from '@/lib/api';
import type { ClientInterviewWithDetails } from '@/domain/entities/clientInterview';

export const clientInterviewsApi = {
  getByCandidateId: (candidateId: string, token: string) =>
    api.get<ClientInterviewWithDetails | null>(`/client/interviews/by-candidate/${candidateId}`, token),

  getClientReport: (interviewId: string, token: string) =>
    api.get<{ markdown: string }>(`/client/reports/${interviewId}`, token),
};

