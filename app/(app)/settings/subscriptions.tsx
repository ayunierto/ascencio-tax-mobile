import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';

const SubscriptionManager = () => {
  // Mock data - Replace with your actual subscription state
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock subscription data
  const subscriptionData = isPro
    ? {
        plan: 'Pro Annual',
        status: 'Active',
        nextBilling: 'December 14, 2025',
        amount: '$99.99/year',
        store: Platform.OS === 'ios' ? 'App Store' : 'Google Play',
      }
    : null;

  const openSubscriptionManagement = async () => {
    Alert.alert(
      'Manage Subscription',
      "You'll be redirected to your app store's subscription settings.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              let url = '';
              if (Platform.OS === 'ios') {
                url = 'itms-apps://apps.apple.com/account/subscriptions';
              } else if (Platform.OS === 'android') {
                url = 'https://play.google.com/store/account/subscriptions';
              }

              if (url) {
                await Linking.openURL(url);
              }
            } catch (error) {
              console.error('Error opening subscription management:', error);
              Alert.alert(
                'Error',
                'Could not open subscription management. Please do it manually from your app store.',
              );
            }
          },
        },
      ],
    );
  };

  const handleUpgradeToPro = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement your subscription/purchase logic here
      // For now, just simulate a purchase
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsPro(true);
      Alert.alert(
        'Success!',
        'You are now a Pro user. Enjoy all premium features!',
        [{ text: 'Great!', style: 'default' }],
      );
    } catch (error) {
      console.error('Error upgrading:', error);
      Alert.alert('Error', 'Could not process upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="diamond" size={48} color={theme.primary} />
        <ThemedText style={styles.title}>Subscription</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage your plan and billing
        </ThemedText>
      </View>

      {/* Current Plan Card */}
      <Card style={styles.card}>
        <CardContent>
          {isPro ? (
            <>
              {/* Active Subscription */}
              <View style={styles.statusBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.success}
                />
                <ThemedText style={[styles.statusText, styles.activeStatus]}>
                  {subscriptionData?.status}
                </ThemedText>
              </View>

              <View style={styles.planInfo}>
                <ThemedText style={styles.planName}>
                  {subscriptionData?.plan}
                </ThemedText>
                <ThemedText style={styles.planPrice}>
                  {subscriptionData?.amount}
                </ThemedText>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Next billing date
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscriptionData?.nextBilling}
                </ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Billed via</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscriptionData?.store}
                </ThemedText>
              </View>

              <Button
                variant="outline"
                fullWidth
                onPress={openSubscriptionManagement}
                style={styles.manageButton}
              >
                <ButtonIcon name="settings-outline" />
                <ButtonText>Manage in Store</ButtonText>
              </Button>
            </>
          ) : (
            <>
              {/* No Subscription */}
              <View style={styles.statusBadge}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={theme.mutedForeground}
                />
                <ThemedText style={[styles.statusText, styles.inactiveStatus]}>
                  Free Plan
                </ThemedText>
              </View>

              <ThemedText style={styles.freePlanText}>
                You&apos;re currently on the free plan with limited features.
              </ThemedText>
            </>
          )}
        </CardContent>
      </Card>

      {/* Features Section */}
      {!isPro && (
        <>
          <ThemedText style={styles.sectionTitle}>
            Upgrade to Pro and unlock:
          </ThemedText>

          <Card style={styles.card}>
            <CardContent>
              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Unlimited receipt scanning
                </ThemedText>
              </View>

              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Advanced expense reports
                </ThemedText>
              </View>

              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Priority support
                </ThemedText>
              </View>

              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Export to multiple formats
                </ThemedText>
              </View>

              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Cloud backup & sync
                </ThemedText>
              </View>

              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.primary}
                />
                <ThemedText style={styles.featureText}>
                  Ad-free experience
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          {/* Upgrade Button */}
          <Button
            fullWidth
            onPress={handleUpgradeToPro}
            disabled={isLoading}
            style={styles.upgradeButton}
          >
            <ButtonIcon name="sparkles" />
            <ButtonText>
              {isLoading ? 'Processing...' : 'Upgrade to Pro'}
            </ButtonText>
          </Button>
        </>
      )}

      {/* Footer Note */}
      <ThemedText style={styles.footerText}>
        Subscriptions are managed through the{' '}
        {Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'}. You can
        cancel or modify your subscription at any time.
      </ThemedText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 10,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
  },
  card: {
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  activeStatus: {
    color: theme.success,
  },
  inactiveStatus: {
    color: theme.mutedForeground,
  },
  planInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    color: theme.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: theme.mutedForeground,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  manageButton: {
    marginTop: 20,
  },
  freePlanText: {
    fontSize: 15,
    color: theme.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  upgradeButton: {
    marginBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: theme.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default SubscriptionManager;
