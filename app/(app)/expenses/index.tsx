import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/components/ui/theme';
import ExpensesList from '@/core/accounting/expenses/components/ExpensesList';
import { Button, ButtonIcon } from '@/components/ui';

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
        <Button
          size="icon"
          variant="ghost"
          onPress={() => router.push('/(app)/expenses/create')}
        >
          <ButtonIcon
            name="add-circle-outline"
            style={{ color: theme.primary, fontSize: 24 }}
          />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onPress={() => router.push('/(app)/expenses/scan')}
        >
          <ButtonIcon
            name="camera-outline"
            style={{ color: theme.primary, fontSize: 24 }}
          />
        </Button>
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
