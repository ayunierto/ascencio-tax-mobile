import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';

import { ServerException } from '@/core/interfaces/server-exception.response';
import { Company } from '@ascencio/shared/interfaces';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
} from '@ascencio/shared/schemas/accounting';
import { getCompaniesAction } from '../actions/get-companies.action';
import { getCompanyAction } from '../actions/get-company.action';
import { createCompanyAction } from '../actions/create-company.action';
import { updateCompanyAction } from '../actions/update-company.action';
import { deleteCompanyAction } from '../actions/delete-company.action';

export const useCompanies = () => {
  return useQuery<Company[], AxiosError<ServerException>, Company[]>({
    queryKey: ['companies'],
    queryFn: getCompaniesAction,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCompany = (id: string) => {
  return useQuery<Company, AxiosError<ServerException>, Company>({
    queryKey: ['company', id],
    queryFn: () => getCompanyAction(id),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError<ServerException>, CreateCompanyDto>({
    mutationFn: createCompanyAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      Toast.show({
        type: 'success',
        text1: 'created',
        text2: data.name,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'createFailed',
        text2: error.response?.data.message || 'Unknown error',
      });
    },
  });
};

export const useUpdateCompany = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Company, AxiosError<ServerException>, UpdateCompanyDto>({
    mutationFn: (input) => updateCompanyAction(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      Toast.show({
        type: 'success',
        text1: 'updated',
        text2: data.name,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'updateFailed',
        text2: error.response?.data.message || 'Unknown error',
      });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, AxiosError<ServerException>, string>({
    mutationFn: deleteCompanyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      Toast.show({
        type: 'success',
        text1: 'companyDeleted',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'deleteFailed',
        text2: error.response?.data.message || 'Unknown error',
      });
    },
  });
};
