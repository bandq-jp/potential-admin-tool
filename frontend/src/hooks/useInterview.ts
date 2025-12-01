'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { interviewsApi, reportsApi } from '@/infrastructure/api';
import type {
  InterviewCreate,
  InterviewDetailCreate,
  InterviewQuestionResponseCreate,
  InterviewUpdate,
  InterviewWithDetails,
} from '@/domain/entities/interview';

export function useInterview(candidateId: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<InterviewWithDetails | null>(
    candidateId ? `interview-candidate-${candidateId}` : null,
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return interviewsApi.getByCandidate(candidateId, token);
    }
  );

  const createInterview = async (data: InterviewCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await interviewsApi.create(data, token);
    mutate();
    return created;
  };

  const updateInterview = async (interviewId: string, data: InterviewUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await interviewsApi.update(interviewId, data, token);
    mutate();
    return updated;
  };

  const saveDetails = async (interviewId: string, details: InterviewDetailCreate[]) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const saved = await interviewsApi.saveDetails(interviewId, details, token);
    mutate();
    return saved;
  };

  const addQuestionResponse = async (
    interviewId: string,
    data: InterviewQuestionResponseCreate
  ) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await interviewsApi.addQuestionResponse(interviewId, data, token);
    mutate();
    return created;
  };

  const updateQuestionResponse = async (
    id: string,
    data: Partial<InterviewQuestionResponseCreate>
  ) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await interviewsApi.updateQuestionResponse(id, data, token);
    mutate();
    return updated;
  };

  const deleteQuestionResponse = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    await interviewsApi.deleteQuestionResponse(id, token);
    mutate();
  };

  const generateClientReport = async (interviewId: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    return reportsApi.generateClientReport(interviewId, token);
  };

  const generateAgentReport = async (interviewId: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    return reportsApi.generateAgentReport(interviewId, token);
  };

  return {
    interview: data,
    isLoading,
    error,
    createInterview,
    updateInterview,
    saveDetails,
    addQuestionResponse,
    updateQuestionResponse,
    deleteQuestionResponse,
    generateClientReport,
    generateAgentReport,
    mutate,
  };
}

