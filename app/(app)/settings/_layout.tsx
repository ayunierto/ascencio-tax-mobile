import { Stack } from "expo-router";
import { theme } from "@/components/ui/theme";

export default function ProfileLayout() {
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
        name="account"
        options={{
          title: "My Account",
        }}
      />
      <Stack.Screen
        name="subscriptions"
        options={{
          title: "Subscriptions",
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: "Delete Account",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
