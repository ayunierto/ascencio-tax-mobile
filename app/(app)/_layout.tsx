import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const { user, authStatus } = useAuthStore();

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
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
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
          drawerLabel: 'Companies',
          title: 'Companies',
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
          drawerLabel: 'Expenses',
          title: 'Expenses',
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
          drawerLabel: 'Invoices',
          title: 'Invoices',
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
          drawerLabel: 'Appointments',
          title: 'Appointments',
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
          drawerLabel: 'Services',
          title: 'Services',
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
          drawerLabel: 'Settings',
          title: 'Settings',
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
