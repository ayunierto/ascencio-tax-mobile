import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { InvoiceForm } from '@/core/accounting/invoices';
import { Invoice } from '@ascencio/shared/interfaces';

export default function CreateInvoiceScreen() {
  const navigation: any = useNavigation();

  useLayoutEffect(() => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const targetNav = parentNav ?? navigation;

    const openDrawer = () => {
      const drawerNav = navigation.getParent ? navigation.getParent() : null;
      if (drawerNav && typeof drawerNav.openDrawer === 'function') {
        drawerNav.openDrawer();
      } else if (typeof navigation.openDrawer === 'function') {
        navigation.openDrawer();
      }
    };

    const headerLeft = () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {navigation.canGoBack && navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 8, marginRight: 8 }}
          >
            <Ionicons color={theme.foreground} size={24} name="chevron-back" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={openDrawer}
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          <Ionicons color={theme.foreground} size={24} name="menu" />
        </TouchableOpacity>
      </View>
    );

    targetNav.setOptions({ headerLeft });

    return () => {
      try {
        targetNav.setOptions({ headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

  // Create an empty invoice template for the form
  const emptyInvoice: Invoice = {
    id: 'new',
    userId: '',
    fromCompanyId: '', // Required field
    invoiceNumber: '',
    invoiceYear: new Date().getFullYear(),
    billToClientId: '',
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    subtotal: 0,
    taxRate: 13,
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
    status: 'draft',
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
