import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';
import { useTranslation } from 'react-i18next';

export default function InvoicesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.foreground },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('myInvoices') }} />
      <Stack.Screen name="new" options={{ title: t('newInvoice') }} />
      <Stack.Screen name="[id]" options={{ title: t('invoiceDetails') }} />
    </Stack>
  );
}
