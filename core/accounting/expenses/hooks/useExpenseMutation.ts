import { ServerException } from '@/core/interfaces/server-exception.response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUpdateExpense } from '../actions';
import { ExpenseResponse } from '../interfaces/expense.interface';
import { ExpenseFormFields } from '../schemas/expenseSchema';
import { router } from 'expo-router';

export const useExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseResponse,
    AxiosError<ServerException>,
    ExpenseFormFields
  >({
    mutationFn: createUpdateExpense,
    onSuccess: (data, variables) => {
      // Invalidate all queries related to expenses
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });

      // If creating a new expense, navigate to the edit screen
      if (variables.id === 'new') {
        setTimeout(() => {
          router.replace({
            pathname: '/(app)/expenses/[id]',
            params: { id: data.id },
          });
        }, 500);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
