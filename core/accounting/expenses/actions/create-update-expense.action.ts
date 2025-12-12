import { api } from '@/core/api/api';
import { ExpenseResponse } from '../interfaces';
import { ExpenseFormFields } from '../schemas';

export const createUpdateExpense = async (expense: ExpenseFormFields) => {
  const { id, ...rest } = expense;
  const { data } = await api<ExpenseResponse>({
    method: id === 'new' ? 'POST' : 'PATCH',
    url: id === 'new' ? '/expenses' : `/expenses/${id}`,
    data: rest,
  });
  return data;
};
