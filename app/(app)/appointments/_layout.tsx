import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

export default function AppointmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'My Appointments',
        }}
      />
      <Stack.Screen
        name="past"
        options={{
          title: 'Past Appointments',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
