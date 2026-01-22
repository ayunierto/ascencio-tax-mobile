import React, { useCallback, useLayoutEffect } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { Button, ButtonIcon, ButtonText } from '@/components/ui';
import { useCategories } from '@/core/accounting/categories/hooks/useCategories';
import ExpenseForm from '@/core/accounting/expenses/components/ExpenseForm/ExpenseForm';
import { useExpense } from '@/core/accounting/expenses/hooks/useExpense';
import { useExpenseStore } from '@/core/accounting/expenses/store/useExpenseStore';
import { EmptyContent } from '@/core/components';

export default function EditExpenseScreen() {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();

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

  // Configure header with drawer toggle
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
        targetNav.setOptions({ headerRight: undefined, headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

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

  // Validate that ID exists
  React.useEffect(() => {
    if (!id) {
      toast.error(t('invalidExpenseId'));
      router.replace('/(app)/expenses');
    }
  }, [id, t]);

  if (isLoading || isLoadingCategories) {
    return <Loader />;
  }

  if (isError || !expense) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          gap: 16,
        }}
      >
        <EmptyContent
          title="Error"
          subtitle={
            error?.response?.data.message ||
            error?.message ||
            t('expenseNotFound')
          }
          icon="sad-outline"
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button variant="outline" onPress={() => refetch()}>
            <ButtonIcon name="refresh-outline" />
            <ButtonText>{t('retry')}</ButtonText>
          </Button>
          <Button onPress={() => router.back()}>
            <ButtonIcon name="arrow-back-outline" />
            <ButtonText>{t('goBack')}</ButtonText>
          </Button>
        </View>
      </View>
    );
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
  );
}
