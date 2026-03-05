import React, { useCallback } from 'react';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useCategories } from '@/core/accounting/categories/hooks/useCategories';
import ExpenseForm from '@/core/accounting/expenses/components/ExpenseForm/ExpenseForm';
import { useExpenseStore } from '@/core/accounting/expenses/store/useExpenseStore';
import { EmptyContent } from '@/core/components';
import Loader from '@/components/Loader';
import { theme, CustomHeader, HeaderButton } from '@/components/ui';
import { Expense } from '@ascencio/shared';

export default function CreateExpenseScreen() {
  const navigation: any = useNavigation();
  const { t } = useTranslation();
  const {
    imageUrl,
    merchant,
    date,
    total,
    tax,
    categoryId,
    subcategoryId,
    reset,
    removeImage,
  } = useExpenseStore();

  const {
    data: categories,
    isError: isErrorCategories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useCategories();

  // Handle cleanup when screen is unfocused
  useFocusEffect(
    useCallback(() => {
      // Screen focused
      return () => {
        // Handle cleanup on screen unfocus
        removeImage();
        reset();
      };
    }, [removeImage, reset]),
  );

  if (isErrorCategories) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          errorCategories.response?.data.message || errorCategories.message
        }
        icon="sad-outline"
      />
    );
  }

  if (isLoadingCategories) {
    return <Loader />;
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyContent
        title="Info"
        subtitle="No categories available. Please contact support."
        icon="information-circle-outline"
      />
    );
  }

  // Create a new expense with scanned details if available
  const newExpense: Expense = {
    id: 'new',
    imageUrl: imageUrl || '',
    merchant: merchant || '',
    date: date || new Date().toISOString(),
    total: total || 0,
    tax: tax || 0,
    category: categories.find((cat) => cat.id === categoryId) || undefined,
    subcategory:
      categories
        .find((cat) => cat.id === categoryId)
        ?.subcategories.find((sub) => sub.id === subcategoryId) || undefined,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: '',
    userId: '',
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CustomHeader
        title={t('createExpense')}
        left={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <HeaderButton onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.foreground}
              />
            </HeaderButton>
            <HeaderButton
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={24} color={theme.foreground} />
            </HeaderButton>
          </View>
        }
      />
      <ExpenseForm expense={newExpense} categories={categories} />
    </View>
  );
}
