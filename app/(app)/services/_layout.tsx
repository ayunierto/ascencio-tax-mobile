import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { theme } from '@/components/ui/theme';

export default function ServicesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.foreground },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('services'),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: t('serviceDetails'),
        }}
      />
    </Stack>
  );
}
