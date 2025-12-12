import { api } from '@/core/api/api';

export const removeReceiptImage = async ({
  imageUrl,
}: {
  imageUrl: string;
}): Promise<void> => {
  const { data } = await api.post('/expenses/delete-receipt-image', {
    imageUrl,
  });
  return data;
};
