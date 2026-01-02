import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ServerException } from '@/core/interfaces/server-exception.response';
import { Company, PaginatedResponse } from '@ascencio/shared/interfaces';
import { CreateCompanyRequest } from '@ascencio/shared/schemas';
import {
  createUpdateCompany,
  deleteCompanyAction,
  getCompaniesAction,
  getCompanyAction,
} from '../actions';

export const useCompanies = () => {
  return useQuery<
    PaginatedResponse<Company>,
    AxiosError<ServerException>,
    PaginatedResponse<Company>,
    string[]
  >({
    queryKey: ['companies'],
    queryFn: getCompaniesAction,
    retry: 1,
  });
};

export const useCompany = (id: string) => {
  return useQuery<Company, AxiosError<ServerException>, Company>({
    queryKey: ['company', id],
    queryFn: () => getCompanyAction(id),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // enabled: !!id,
  });
};

export const useCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCompanyRequest,
    AxiosError<ServerException>,
    CreateCompanyRequest
  >({
    mutationFn: createUpdateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, AxiosError<ServerException>, string>({
    mutationFn: deleteCompanyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
