import { ServerException } from '@/core/interfaces/server-exception.response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUpdateExpense } from '../actions';
import { ExpenseResponse } from '../interfaces/expense.interface';
import { ExpenseFormFields } from '../schemas/expenseSchema';

export const useExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseResponse,
    AxiosError<ServerException>,
    ExpenseFormFields
  >({
    mutationFn: createUpdateExpense,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
