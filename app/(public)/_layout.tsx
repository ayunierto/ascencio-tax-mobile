import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="features" options={{ title: "Features" }} />
      <Stack.Screen name="pricing" options={{ title: "Pricing" }} />
      <Stack.Screen name="about" options={{ title: "About Us" }} />
      <Stack.Screen name="contact" options={{ title: "Contact" }} />
    </Stack>
  );
}
