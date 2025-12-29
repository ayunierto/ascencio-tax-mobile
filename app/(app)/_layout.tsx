import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { theme } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
  const { user, authStatus } = useAuthStore();
  const {t} = useTranslation();

  // Show loading while checking auth
  if (authStatus === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (authStatus !== 'authenticated' || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: theme.background },
        drawerActiveTintColor: theme.primary,
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.foreground },
      }}
    >
      <Drawer.Screen
        name="(dashboard)/index"
        options={{
          drawerLabel: t('dashboard'),
          title: t('dashboard'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color}
            />
          ),
          
        }}
      />

      <Drawer.Screen
        name="companies"
        options={{
          drawerLabel: t('companies'),
          title: t('companies'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'business' : 'business-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="expenses"
        options={{
          drawerLabel: t('expenses'),
          title: t('expenses'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cash' : 'cash-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="invoices"
        options={{
          drawerLabel: t('invoices'),
          title: t('invoices'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'document' : 'document-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="appointments"
        options={{
          drawerLabel: t('appointments'),
          title: t('appointments'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="services"
        options={{
          drawerLabel: t('services'),
          title: t('services'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: t('settings'),
          title: t('settings'),
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}
