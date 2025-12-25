import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { CustomTheme } from '@/theme/CustomTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Valores por defecto conservadores
      staleTime: 0,
      gcTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export const unstable_settings = {
  // This is needed when using file-based routing with (group) syntax
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={CustomTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Root index - handles initial routing logic */}
            <Stack.Screen name="index" options={{ headerShown: false }} />

            {/* Auth routes - accessible without authentication */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* Public routes - accessible without authentication */}
            <Stack.Screen name="(public)" options={{ headerShown: false }} />

            {/* Protected routes - requires authentication */}
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>

          <StatusBar style="light" />

          <Toast />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
