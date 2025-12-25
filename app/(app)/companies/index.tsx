import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyContent } from '@/core/components';
import {
  useCompanies,
  useDeleteCompany,
} from '@/core/accounting/companies/hooks/useCompanies';
import { Company } from '@ascencio/shared/interfaces';

const CompaniesList = () => {
  const {
    data: companies = [],
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCompanies();
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const handleDelete = (company: Company) => {
    Alert.alert('deleteTitle', 'deleteConfirm', [
      { text: 'cancel', onPress: () => {} },
      {
        text: 'delete',
        onPress: () => deleteCompany(company.id),
        style: 'destructive',
      },
    ]);
  };

  const renderCompanyCard = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={{
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
      }}
      onPress={() => router.push(`/(app)/(tabs)/invoices`)}
      disabled={isDeleting}
    >
      <View style={{ flex: 1 }}>
        <ThemedText numberOfLines={1}>{item.name}</ThemedText>
        {item.legalName && (
          <ThemedText style={{ marginTop: 4, opacity: 0.7 }} numberOfLines={1}>
            {item.legalName}
          </ThemedText>
        )}
        {item.businessNumber && (
          <ThemedText style={{ marginTop: 2, opacity: 0.6, fontSize: 12 }}>
            {item.businessNumber}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{ marginLeft: 12 }}
        disabled={isDeleting}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.destructive}
          style={{ opacity: isDeleting ? 0.5 : 1 }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isError) {
    return (
      <EmptyContent
        title="loadError"
        subtitle={error?.response?.data.message || error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <EmptyContent
        title="empty"
        subtitle="emptySubtitle"
        // onRetry={() => router.push('')}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={companies}
        renderItem={renderCompanyCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ThemedText>myCompanies</ThemedText>
            <TouchableOpacity
              // onPress={() => router.push('/companies')}
              style={{
                backgroundColor: theme.primary,
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default CompaniesList;
