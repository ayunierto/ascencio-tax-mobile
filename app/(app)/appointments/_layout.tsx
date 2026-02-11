import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { theme } from '@/components/ui/theme';

export default function AppointmentsLayout() {
  const { t } = useTranslation();
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
          title: t('myAppointments'),
        }}
      />
      <Stack.Screen
        name="past"
        options={{
          title: t('pastAppointments'),
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
