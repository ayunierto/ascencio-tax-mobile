import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Image, RefreshControl, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ServiceCard } from '@/components/home/ServiceCard';
import { ServiceListSkeleton } from '@/components/home/ServiceCardSkeleton';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { EmptyContent } from '@/core/components';
import { useServices } from '@/core/services/hooks/useServices';
import { Service } from '@ascencio/shared/interfaces';

const ServicesScreen = () => {
  const { t } = useTranslation();
  const { authStatus, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: servicesResponse,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useServices();

  const selectService = (service: Service): void => {
    router.push({
      pathname: `/services/[id]`,
      params: { id: service.id },
    });
  };

  // Filter services based on search query
  const filteredServices = servicesResponse?.items.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  if (isError)
    return (
      <EmptyContent
        title={t('error')}
        subtitle={error.response?.data.message || error.message}
      />
    );

  if (isPending) return <ServiceListSkeleton />;

  if (!servicesResponse || servicesResponse.items.length === 0) {
    return (
      <EmptyContent
        title={t('noServicesTitle')}
        subtitle={t('noServicesSubtitle')}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={filteredServices}
        renderItem={({ item }) => (
          <ServiceCard
            key={item.id}
            service={item}
            selectService={selectService}
          />
        )}
        ListHeaderComponent={
          <>
            {/* Logo - Scrollable */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <Image
                source={require('@/assets/images/logo.png')}
                style={{
                  width: '70%',
                  maxWidth: 250,
                  resizeMode: 'contain',
                  height: 120,
                }}
              />
            </View>

            {/* Greeting Header */}
            {authStatus === 'authenticated' && user && (
              <View style={{ marginBottom: 20 }}>
                <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {getGreeting()}
                  {user.firstName ? `, ${user.firstName}!` : '!'}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 14, color: theme.mutedForeground }}
                >
                  {t('bookAppointment')}
                </ThemedText>
              </View>
            )}

            {/* Search Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.card,
                borderRadius: theme.radius,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 12,
                marginBottom: 20,
                height: 48,
              }}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.mutedForeground}
              />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: theme.foreground,
                }}
                placeholder={t('searchServices')}
                placeholderTextColor={theme.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.mutedForeground}
                  onPress={() => setSearchQuery('')}
                />
              )}
            </View>

            {/* Results count */}
            <ThemedText
              style={{
                fontSize: 14,
                color: theme.mutedForeground,
                marginBottom: 12,
              }}
            >
              {filteredServices?.length || 0}{' '}
              {filteredServices?.length === 1 ? t('service') : t('services')}{' '}
              {t('available')}
            </ThemedText>
          </>
        }
        ListEmptyComponent={
          <EmptyContent
            title={t('noResultsFound')}
            subtitle={t('tryAdjustingSearch')}
          />
        }
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 40,
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
};

export default ServicesScreen;
