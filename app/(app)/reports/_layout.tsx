import { theme } from '@/components/ui';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ReportsLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.foreground },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('reports') }} />
    </Stack>
  );
}
