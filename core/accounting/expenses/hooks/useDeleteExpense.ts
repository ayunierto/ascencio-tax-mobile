import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { removeExpense } from '../actions';
import { ExpenseResponse } from '../interfaces';

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<ExpenseResponse, AxiosError<ServerException>, string>({
    mutationFn: removeExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};
