import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/components/ui/theme';
import ExpensesList from '@/core/accounting/expenses/components/ExpensesList';

const ExpensesScreen = () => {
  const navigation = useNavigation();

  // Configure header with drawer and action buttons
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
      <View style={{ flexDirection: 'row', gap: theme.gap + 10 }}>
        <TouchableOpacity onPress={() => router.push('/(app)/expenses/create')}>
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(app)/expenses/scan')}>
          <Ionicons name="camera-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
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

  return <ExpensesList />;
};

export default ExpensesScreen;
