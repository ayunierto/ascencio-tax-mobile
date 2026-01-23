import React, { useLayoutEffect, useState } from 'react';

import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { DrawerActions } from '@react-navigation/core';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { ServiceCard } from '@/components/home/ServiceCard';
import { ServiceListSkeleton } from '@/components/home/ServiceCardSkeleton';
import { theme } from '@/components/ui/theme';
import { EmptyContent } from '@/core/components';
import { useServices } from '@/core/services/hooks/useServices';
import { Service } from '@ascencio/shared/interfaces';
import { Button, ButtonIcon, Input } from '@/components/ui';

const ServicesScreen = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Add an Add button to the parent drawer/header
  useLayoutEffect(() => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const targetNav = parentNav ?? navigation;

    const headerLeft = () => (
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ marginRight: 30 }}
      >
        <Ionicons name="menu" size={24} color={theme.foreground} />
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerLeft,
    });

    return () => {
      try {
        targetNav.setOptions({ headerRight: undefined, headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

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
        action={
          <Button onPress={refetch}>
            <ButtonIcon name="reload" />
            {t('retry')}
          </Button>
        }
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
          <Input
            placeholder={t('searchServices')}
            placeholderTextColor={theme.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leadingIcon="search-outline"
            clearable
            rootStyle={{ marginBottom: theme.gap }}
          />
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
