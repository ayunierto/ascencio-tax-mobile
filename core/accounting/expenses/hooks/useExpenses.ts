import { ServerException } from '@/core/interfaces/server-exception.response';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getExpenses } from '../actions';
import { ExpenseResponse } from '../interfaces/expense.interface';

export const useExpenses = () => {
  const expensesQuery = useInfiniteQuery<
    ExpenseResponse[],
    AxiosError<ServerException>,
    InfiniteData<ExpenseResponse[], unknown>,
    string[],
    number
  >({
    queryKey: ['expenses', 'infinite'],
    queryFn: ({ pageParam }) => getExpenses(10, pageParam * 10),
    staleTime: 1000 * 60 * 60,

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
    retry: false,
  });

  return {
    expensesQuery,

    // Methods
    loadNextPage: expensesQuery.fetchNextPage,
  };
};
