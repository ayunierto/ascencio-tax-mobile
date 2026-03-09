import { useLocalSearchParams } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { InvoiceForm, useInvoice } from '@/core/accounting/invoices';
import Loader from '@/components/Loader';
import { EmptyContent } from '@/core/components';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
            <Ionicons color="#ffffff" size={24} name="chevron-back" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={openDrawer}
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          <Ionicons color="#ffffff" size={24} name="menu" />
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
  const { data: invoice, isPending, isError, error } = useInvoice(id!);

  if (isPending) return <Loader />;

  if (isError) {
    return (
      <EmptyContent
        title="Error loading invoice"
        subtitle={error?.message || 'Unknown error'}
        icon="alert-circle-outline"
      />
    );
  }

  if (!invoice) {
    return (
      <EmptyContent
        title="Invoice not found"
        subtitle="The invoice you're looking for doesn't exist"
        icon="document-text-outline"
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <InvoiceForm invoice={invoice} />
    </View>
  );
}
