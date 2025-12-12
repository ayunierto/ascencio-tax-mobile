import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Loader from "@/components/Loader";
import { theme } from "@/components/ui/theme";
import { useCategories } from "@/core/accounting/categories/hooks/useCategories";
import ExpenseForm from "@/core/accounting/expenses/components/ExpenseForm/ExpenseForm";
import { useExpenseStore } from "@/core/accounting/expenses/store/useExpenseStore";
import { EmptyContent } from "@/core/components";

export default function NewExpenseScreen() {
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
    }, [removeImage, reset])
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

  // Create a new expense with scanned details if available
  const newExpense = {
    id: "new",
    imageUrl: imageUrl || "",
    merchant: merchant || "",
    date: date || new Date().toISOString(),
    total: total || 0,
    tax: tax || 0,
    category: categories.find((cat) => cat.id === categoryId) || undefined,
    subcategory:
      categories
        .find((cat) => cat.id === categoryId)
        ?.subcategories.find((sub) => sub.id === subcategoryId) || undefined,
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <View style={styles.container}>
      <ExpenseForm expense={newExpense} categories={categories} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
