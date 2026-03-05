import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/components/ui/theme';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { InvoicesList } from '@/core/accounting/invoices';
import { PremiumGuard } from '@/core/subscription';
import { PremiumFeature } from '@ascencio/shared';
import { TrialBanner } from '@/components/subscription/TrialBanner';

export default function InvoicesIndexScreen() {
  const navigation = useNavigation();

  // Add an Add button to the parent drawer/header
  useLayoutEffect(() => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const targetNav = parentNav ?? navigation;

    const headerLeft = () => (
      <HeaderButton
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ marginRight: 30 }}
      >
        <Ionicons name="menu" size={24} color={theme.foreground} />
      </HeaderButton>
    );

    const headerRight = () => (
      <View style={{ flexDirection: 'row', gap: theme.gap + 10 }}>
        <HeaderButton onPress={() => router.push('/(app)/invoices/create')}>
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        </HeaderButton>
      </View>
    );

    navigation.setOptions({
      headerLeft,
      headerRight,
    });

    return () => {
      try {
        targetNav.setOptions({ headerRight: undefined, headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

  return (
    <PremiumGuard feature={PremiumFeature.INVOICES}>
      <View style={{ flex: 1 }}>
        <TrialBanner
          feature={PremiumFeature.INVOICES}
          style={{ marginHorizontal: 16, marginTop: 8 }}
        />
        <InvoicesList />
      </View>
    </PremiumGuard>
  );
}
