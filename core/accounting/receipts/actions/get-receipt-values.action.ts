import { api } from '@/core/api/api';
import { AnalyzedExpense } from '../../expenses/interfaces';

export const getReceiptValues = async (
  imageUrl: string
): Promise<AnalyzedExpense> => {
  const { data } = await api.post<AnalyzedExpense>(
    '/expenses/analyze-image-url',
    {
      imageUrl,
    }
  );
  return data;
};
