import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';
import { useTranslation } from 'react-i18next';

export default function ProfileLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('settings'),
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: t('myAccount'),
        }}
      />
      <Stack.Screen
        name="subscriptions"
        options={{
          title: t('subscriptions'),
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: t('deleteAccount'),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
