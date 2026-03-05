import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { theme } from '@/components/ui/theme';
import { useTranslation } from 'react-i18next';

export default function InvoicesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { 
          backgroundColor: theme.background,
        },
        headerTitleStyle: { color: theme.foreground },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        ...Platform.select({
          ios: {
            headerLargeTitle: false,
            headerBlurEffect: undefined,
          },
        }),
      }}
    >
      <Stack.Screen name="index" options={{ title: t('myInvoices') }} />
      <Stack.Screen name="create" options={{ title: t('newInvoice') }} />
      <Stack.Screen name="[id]" options={{ title: t('invoiceDetails') }} />
    </Stack>
  );
}
