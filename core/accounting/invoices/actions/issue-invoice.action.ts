import { api } from '@/core/api';
import { Invoice } from '@ascencio/shared/interfaces';

export const issueInvoiceAction = async (
  id: string,
  issueDate?: string
): Promise<Invoice> => {
  const { data } = await api.post<Invoice>(`/invoices/${id}/issue`, {
    issueDate,
  });
  return data;
};
