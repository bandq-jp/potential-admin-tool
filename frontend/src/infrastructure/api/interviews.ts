import { api } from '@/lib/api';
import type {
  Interview,
  InterviewCreate,
  InterviewDetail,
  InterviewDetailCreate,
  InterviewQuestionResponse,
  InterviewQuestionResponseCreate,
  InterviewUpdate,
  InterviewWithDetails,
} from '@/domain/entities/interview';

export const interviewsApi = {
  getByCandidate: (candidateId: string, token: string) =>
    api.get<InterviewWithDetails | null>(`/interviews/by-candidate/${candidateId}`, token),

  getById: (id: string, token: string) =>
    api.get<InterviewWithDetails>(`/interviews/${id}`, token),

  create: (data: InterviewCreate, token: string) =>
    api.post<Interview>('/interviews', data, token),

  update: (id: string, data: InterviewUpdate, token: string) =>
    api.patch<Interview>(`/interviews/${id}`, data, token),

  saveDetails: (interviewId: string, details: InterviewDetailCreate[], token: string) =>
    api.post<InterviewDetail[]>(`/interviews/${interviewId}/details`, details, token),

  addQuestionResponse: (
    interviewId: string,
    data: InterviewQuestionResponseCreate,
    token: string
  ) => api.post<InterviewQuestionResponse>(`/interviews/${interviewId}/questions`, data, token),

  updateQuestionResponse: (
    id: string,
    data: Partial<InterviewQuestionResponseCreate>,
    token: string
  ) => api.patch<InterviewQuestionResponse>(`/interviews/questions/${id}`, data, token),

  deleteQuestionResponse: (id: string, token: string) =>
    api.delete<{ message: string }>(`/interviews/questions/${id}`, token),
};

