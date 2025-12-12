import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loader from "@/components/Loader";
import { theme } from "@/components/ui/theme";
import ExpensesList from "@/core/accounting/expenses/components/ExpensesList";
import { useExpenses } from "@/core/accounting/expenses/hooks/useExpenses";
import { ThemedText } from "@/components/themed-text";

export default function ExpensesIndexScreen() {
  const { expensesQuery, loadNextPage } = useExpenses();
  const insets = useSafeAreaInsets();

  if (expensesQuery.isLoading) {
    return <Loader message="Loading expenses..." />;
  }

  const expenses = expensesQuery.data?.pages.flatMap((page) => page) ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Expenses</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(app)/(tabs)/expenses/new")}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(app)/(tabs)/expenses/scan")}
          >
            <Ionicons name="camera-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ExpensesList expenses={expenses} loadNextPage={loadNextPage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});
