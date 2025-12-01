'use client';

import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { companiesApi } from '@/infrastructure/api';
import type { Company, CompanyCreate, CompanyUpdate } from '@/domain/entities/company';

export function useCompanies() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Company[]>(
    'companies',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('No token');
      return companiesApi.getAll(token);
    }
  );

  const createCompany = async (data: CompanyCreate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const created = await companiesApi.create(data, token);
    mutate();
    return created;
  };

  const updateCompany = async (id: string, data: CompanyUpdate) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    const updated = await companiesApi.update(id, data, token);
    mutate();
    return updated;
  };

  const deleteCompany = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('No token');
    await companiesApi.delete(id, token);
    mutate();
  };

  return {
    companies: data ?? [],
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    mutate,
  };
}

