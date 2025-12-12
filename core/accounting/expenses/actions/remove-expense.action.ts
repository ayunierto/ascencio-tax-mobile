import { api } from '@/core/api/api';
import { ExpenseResponse } from '../interfaces';

export const removeExpense = async (id: string): Promise<ExpenseResponse> => {
  const { data } = await api.delete<ExpenseResponse>(`/expenses/${id}`);
  return data;
};
