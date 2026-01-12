import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

export default function InvoicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
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
          title: 'New Invoice',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Invoice Details',
        }}
      />
    </Stack>
  );
}
