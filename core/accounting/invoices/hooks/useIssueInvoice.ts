import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueInvoiceAction } from '../actions';

export const useIssueInvoiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issueInvoiceAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
    },
  });
};
