import { Stack } from "expo-router";
import { theme } from "@/components/ui/theme";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[serviceId]"
        options={{
          title: "Service Details",
        }}
      />
    </Stack>
  );
}
