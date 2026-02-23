/**
 * Subscription Screen
 * Displays available subscription plans and allows users to purchase
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '@/core/subscription/SubscriptionContext';
import { theme } from '@/components/ui';
import { TRIAL_LIMITS } from '@ascencio/shared';

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

function PlanCard({
  title,
  price,
  period,
  features,
  isPopular,
  onPress,
  isLoading,
}: PlanCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
      style={[styles.planCard, isPopular && styles.popularCard]}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MÁS POPULAR</Text>
        </View>
      )}

      <Text style={styles.planTitle}>{title}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <LinearGradient
        colors={isPopular ? [theme.primary, theme.secondary] : ['#4a5568', '#2d3748']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.selectButton}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.selectButtonText}>Seleccionar Plan</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const { offerings, purchasePackage, restorePurchases, subscriptionStatus } = useSubscription();
  const [purchasingPackageId, setPurchasingPackageId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      setPurchasingPackageId(pkg.identifier);
      const success = await purchasePackage(pkg);

      if (success) {
        Alert.alert(
          t('subscriptionActivated'),
          t('youNowHaveAccessToAllFeatures'),
          [
            {
              text: t('ok'),
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(t('error'), t('couldNotCompletePurchase'));
    } finally {
      setPurchasingPackageId(null);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const success = await restorePurchases();

      if (success) {
        Alert.alert(t('subscriptionRestored'), t('yourSubscriptionHasBeenRestored'));
      } else {
        Alert.alert(t('noSubscriptionFound'), t('noActiveSubscriptionToRestore'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('couldNotRestorePurchases'));
    } finally {
      setIsRestoring(false);
    }
  };

  const benefits = [
    { icon: 'infinite' as const, text: t('unlimitedCompanies') },
    { icon: 'people' as const, text: t('unlimitedClients') },
    { icon: 'cash' as const, text: t('unlimitedExpenses') },
    { icon: 'document' as const, text: t('unlimitedInvoices') },
    { icon: 'bar-chart' as const, text: t('advancedReports') },
    { icon: 'shield-checkmark' as const, text: t('prioritySupport') },
  ];

  return (
    <LinearGradient colors={[theme.background, theme.card]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.foreground} />
          </TouchableOpacity>

          <Text style={styles.title}>Desbloquea Todo el Potencial</Text>
          <Text style={styles.subtitle}>
            Elige el plan perfecto para tu negocio
          </Text>
        </View>

        {/* Trial Banner */}
        <View style={styles.trialBanner}>
          <Ionicons name="gift" size={32} color={theme.primary} />
          <View style={styles.trialTextContainer}>
            <Text style={styles.trialTitle}>
              {TRIAL_LIMITS.TRIAL_DAYS} Días de Prueba Gratis
            </Text>
            <Text style={styles.trialSubtitle}>
              Prueba todas las funciones premium sin compromiso
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Lo que obtendrás:</Text>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name={benefit.icon} size={24} color="#4ade80" />
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {offerings?.current?.availablePackages.map((pkg, index) => {
            const isPopular = pkg.packageType === 'ANNUAL';
            const isLoading = purchasingPackageId === pkg.identifier;

            return (
              <PlanCard
                key={pkg.identifier}
                title={pkg.product.title}
                price={pkg.product.priceString}
                period={pkg.packageType === 'ANNUAL' ? 'año' : 'mes'}
                features={[
                  'Empresas ilimitadas',
                  'Clientes ilimitados',
                  'Gastos ilimitados',
                  'Facturas ilimitadas',
                  'Reportes avanzados',
                  'Soporte prioritario',
                ]}
                isPopular={isPopular}
                onPress={() => handlePurchase(pkg)}
                isLoading={isLoading}
              />
            );
          })}

          {!offerings?.current && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Cargando planes...</Text>
            </View>
          )}
        </View>

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Text style={styles.restoreText}>Restaurar Compras</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cancela en cualquier momento • Pago seguro • Acceso inmediato
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
  },
  trialTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  trialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 4,
  },
  trialSubtitle: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 15,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: theme.foreground,
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
  popularCard: {
    borderColor: theme.primary,
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  period: {
    fontSize: 18,
    color: theme.mutedForeground,
    marginLeft: 5,
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: theme.foreground,
    flex: 1,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: theme.mutedForeground,
    fontSize: 16,
  },
  restoreButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  restoreText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
});
