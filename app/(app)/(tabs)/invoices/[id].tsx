import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@/components/ui/theme";
import { EmptyContent } from "@/core/components";

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <EmptyContent
        title="Coming Soon"
        subtitle="Invoice details view is under development"
        icon="construct-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
