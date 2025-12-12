import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, authStatus } = useAuthStore();

  // Show loading while checking auth
  if (authStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (authStatus !== "authenticated" || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
