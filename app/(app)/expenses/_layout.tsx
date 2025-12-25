import { Stack } from "expo-router";
import { theme } from "@/components/ui/theme";

export default function ExpensesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: "New Expense",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Expense",
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          title: "Scan Receipt",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
