import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card/Card';
import { CardContent } from '@/components/ui/Card/CardContent';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import ListItem from '@/core/settings/components/ListItem';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ProfileIndexScreen() {
  const { logout, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ErrorBoundary>
      <View
        style={[
          styles.container,
          { paddingBottom: insets.bottom, paddingTop: insets.top },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Header */}
          <Card>
            <CardContent style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={32} color={theme.primary} />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </ThemedText>
                <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.mutedForeground}
              />
            </CardContent>
          </Card>

          {/* Account Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <Card>
              <CardContent style={styles.cardContent}>
                <ListItem
                  icon="diamond-outline"
                  label="Subscriptions"
                  onPress={() => router.push('/(app)/settings/subscriptions')}
                />
              </CardContent>
            </Card>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Legal</ThemedText>
            <Card>
              <CardContent style={styles.cardContent}>
                <ListItem
                  icon="book-outline"
                  label="Terms of use"
                  external
                  onPress={() =>
                    Linking.openURL('https://www.ascenciotax.com/termsofuse')
                  }
                />
                <View style={styles.divider} />
                <ListItem
                  icon="shield-checkmark-outline"
                  label="Privacy policy"
                  external
                  onPress={() =>
                    Linking.openURL('https://www.ascenciotax.com/privacy')
                  }
                />
              </CardContent>
            </Card>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <ThemedText style={styles.appInfoText}>Version 1.0.0</ThemedText>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button variant="destructive" fullWidth onPress={handleLogout}>
            <ButtonIcon name="log-out-outline" />
            <ButtonText>Log out</ButtonText>
          </Button>
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    gap: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.foreground,
  },
  userEmail: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  cardContent: {
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: 50,
    opacity: 0.5,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 'auto',
  },
  appInfoText: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  footer: {
    padding: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.background,
  },
});
