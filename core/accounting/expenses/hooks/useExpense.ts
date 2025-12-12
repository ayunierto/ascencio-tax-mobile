import { ServerException } from '@/core/interfaces/server-exception.response';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ExpenseResponse } from '../interfaces';
import { getExpenseByIdAction } from '../actions/get-expense-by-id.action';

export const useExpense = (id: string) => {
  return useQuery<
    ExpenseResponse,
    AxiosError<ServerException>,
    ExpenseResponse
  >({
    queryKey: ['expense', id],
    queryFn: async () => await getExpenseByIdAction(id),
    // staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
};
