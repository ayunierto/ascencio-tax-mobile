import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { theme } from '@/components/ui/theme';

export default function HomeLayout() {
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
          headerShown: false,
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
