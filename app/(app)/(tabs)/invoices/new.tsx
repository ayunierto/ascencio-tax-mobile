import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@/components/ui/theme";
import { EmptyContent } from "@/core/components";

export default function NewInvoiceScreen() {
  return (
    <View style={styles.container}>
      <EmptyContent
        title="Coming Soon"
        subtitle="Invoice creation feature is under development"
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
