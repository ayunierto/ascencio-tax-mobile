import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/components/ui/theme";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui";
import { CardContent } from "@/components/ui/Card/CardContent";
import { EmptyContent } from "@/core/components";

export default function InvoicesIndexScreen() {
  // Mock data - replace with actual data fetching
  const invoices: any[] = [];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>My Invoices</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(app)/(tabs)/invoices/new")}
        >
          <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {invoices.length === 0 ? (
        <EmptyContent
          title="No invoices yet"
          subtitle="Create your first invoice to get started"
          icon="document-text-outline"
        />
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
        >
          {invoices.map((invoice) => (
            <TouchableOpacity
              key={invoice.id}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(tabs)/invoices/[id]",
                  params: { id: invoice.id },
                })
              }
            >
              <Card style={styles.invoiceCard}>
                <CardContent style={styles.invoiceContent}>
                  <View style={styles.invoiceInfo}>
                    <ThemedText style={styles.invoiceNumber}>
                      #{invoice.number}
                    </ThemedText>
                    <ThemedText style={styles.invoiceClient}>
                      {invoice.clientName}
                    </ThemedText>
                    <ThemedText style={styles.invoiceDate}>
                      {invoice.date}
                    </ThemedText>
                  </View>
                  <View style={styles.invoiceRight}>
                    <ThemedText style={styles.invoiceAmount}>
                      ${invoice.total}
                    </ThemedText>
                    <View
                      style={[
                        styles.statusBadge,
                        invoice.status === "paid" && styles.statusPaid,
                        invoice.status === "pending" && styles.statusPending,
                      ]}
                    >
                      <ThemedText style={styles.statusText}>
                        {invoice.status}
                      </ThemedText>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  addButton: {
    padding: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  invoiceCard: {
    marginBottom: 8,
  },
  invoiceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceInfo: {
    flex: 1,
    gap: 4,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  invoiceClient: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  invoiceDate: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  invoiceRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.muted,
  },
  statusPaid: {
    backgroundColor: "#22c55e20",
  },
  statusPending: {
    backgroundColor: "#f59e0b20",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
