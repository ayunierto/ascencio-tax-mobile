import React from 'react';
import { View } from 'react-native';
import { theme } from '@/components/ui/theme';
import { InvoiceForm } from '@/core/accounting/invoices';
import { Invoice } from '@ascencio/shared/interfaces';

export default function NewInvoiceScreen() {
  // Create an empty invoice template for the form
  const emptyInvoice: Invoice = {
    id: 'new',
    userId: '',
    invoiceNumber: '',
    invoiceYear: new Date().getFullYear(),
    billToClientId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    subtotal: 0,
    taxRate: 13,
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lineItems: [],
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <InvoiceForm invoice={emptyInvoice} />
    </View>
  );
}
