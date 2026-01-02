import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { useCategories } from '@/core/accounting/categories/hooks/useCategories';
import ExpenseForm from '@/core/accounting/expenses/components/ExpenseForm/ExpenseForm';
import { useExpense } from '@/core/accounting/expenses/hooks/useExpense';
import { useExpenseStore } from '@/core/accounting/expenses/store/useExpenseStore';
import { EmptyContent } from '@/core/components';

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
    data: expense,
    isLoading,
    isError,
    error,
    refetch,
  } = useExpense(id || '');

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
      refetch();
      return () => {
        // Handle cleanup on screen unfocus
        removeImage();
        reset();
      };
    }, [refetch, removeImage, reset]),
  );

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }

  if (isLoading) {
    return <Loader message="Loading expense..." />;
  }

  if (!expense) {
    router.replace('/(app)/expenses');
    return null;
  }

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
    return <Loader message="Loading categories..." />;
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

  return (
    <View style={styles.container}>
      <ExpenseForm
        expense={{
          ...expense,
          // Override with scanned details if available
          imageUrl: imageUrl || expense.imageUrl,
          merchant: merchant || expense.merchant,
          date: date || expense.date,
          total: total || expense.total,
          tax: tax || expense.tax,
          category:
            categories.find((cat) => cat.id === categoryId) || expense.category,
          subcategory:
            categories
              .find((cat) => cat.id === categoryId)
              ?.subcategories.find((sub) => sub.id === subcategoryId) ||
            expense.subcategory,
          notes: expense.notes,
        }}
        categories={categories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
