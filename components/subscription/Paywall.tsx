/**
 * Paywall Component
 * Displays premium features and subscription options when a feature is locked
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PremiumFeature, TRIAL_LIMITS } from '@ascencio/shared';
import { theme } from '@/components/ui';

interface PaywallProps {
  feature?: PremiumFeature;
  onClose?: () => void;
  isModal?: boolean;
}

export function Paywall({ feature, onClose, isModal = false }: PaywallProps) {
  const { t } = useTranslation();

  const handleViewPlans = () => {
    if (onClose) onClose();
    router.push('/subscription');
  };

  const getFeatureName = (feature?: PremiumFeature): string => {
    if (!feature) return t('premiumFeatures');
    
    switch (feature) {
      case PremiumFeature.COMPANIES:
        return t('companies');
      case PremiumFeature.CLIENTS:
        return t('myClients');
      case PremiumFeature.EXPENSES:
        return t('expenses');
      case PremiumFeature.INVOICES:
        return t('invoices');
      case PremiumFeature.REPORTS:
        return t('reports');
      default:
        return t('premiumFeatures');
    }
  };

  const benefits = [
    {
      icon: 'business' as const,
      title: t('unlimitedCompanies'),
      description: t('manageAllYourCompanies'),
    },
    {
      icon: 'people' as const,
      title: t('unlimitedClients'),
      description: t('trackAllYourClients'),
    },
    {
      icon: 'cash' as const,
      title: t('unlimitedExpenses'),
      description: t('recordAllExpenses'),
    },
    {
      icon: 'document' as const,
      title: t('unlimitedInvoices'),
      description: t('createUnlimitedInvoices'),
    },
    {
      icon: 'bar-chart' as const,
      title: t('advancedReports'),
      description: t('detailedFinancialReports'),
    },
    {
      icon: 'shield-checkmark' as const,
      title: t('prioritySupport'),
      description: t('getDedicatedSupport'),
    },
  ];

  const Content = (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {isModal && onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.foreground} />
          </TouchableOpacity>
        )}

        <View style={styles.lockIconContainer}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            style={styles.lockIconGradient}
          >
            <Ionicons name="lock-closed" size={40} color="white" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>
          {feature ? t('unlockFeature', { feature: getFeatureName(feature) }) : t('unlockPremiumFeatures')}
        </Text>
        <Text style={styles.subtitle}>{t('upgradeToAccessAllFeatures')}</Text>
      </View>

      <View style={styles.trialBanner}>
        <Ionicons name="gift" size={24} color={theme.primary} />
        <View style={styles.trialTextContainer}>
          <Text style={styles.trialTitle}>{t('startFreeTrial')}</Text>
          <Text style={styles.trialSubtitle}>
            {t('trialDaysOffer', { days: TRIAL_LIMITS.TRIAL_DAYS })}
          </Text>
        </View>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>{t('whatYouGet')}</Text>

        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.benefitIconContainer}>
              <Ionicons name={benefit.icon} size={24} color={theme.primary} />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handleViewPlans} activeOpacity={0.8}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.ctaText}>{t('viewPlans')}</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('cancelAnytime')} • {t('securePayment')}</Text>
      </View>
    </ScrollView>
  );

  return Content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  lockIconContainer: {
    marginBottom: 20,
  },
  lockIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.foreground,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  trialTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 4,
  },
  trialSubtitle: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  ctaButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
});
