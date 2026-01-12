import React, { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/components/ui/theme';
import { InvoicesList } from '@/core/accounting/invoices';

export default function InvoicesIndexScreen() {
  const navigation = useNavigation();

  // Add an Add button to the parent drawer/header
  useLayoutEffect(() => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const targetNav = parentNav ?? navigation;

    const headerLeft = () => (
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ marginRight: 30 }}
      >
        <Ionicons name="menu" size={24} color={theme.foreground} />
      </TouchableOpacity>
    );

    const headerRight = () => (
      <TouchableOpacity onPress={() => router.push('/(app)/invoices/new')}>
        <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerLeft,
      headerRight,
    });

    return () => {
      try {
        targetNav.setOptions({ headerRight: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

  return <InvoicesList />;
}
