import React from 'react';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Client } from '@ascencio/shared';
import { ClientForm } from '@/core/accounting/clients/components';
import { theme, CustomHeader, HeaderButton } from '@/components/ui';

const CreateClientScreen = () => {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const newClient: Client = {
    id: 'new',
    fullName: '',
    email: '',
    phone: '',
    address: undefined,
    city: undefined,
    province: undefined,
    postalCode: undefined,
    country: 'Canada',
    dateOfBirth: undefined,
    sin: undefined,
    businessNumber: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CustomHeader
        title={t('createClient')}
        left={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <HeaderButton onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.foreground}
              />
            </HeaderButton>
            <HeaderButton
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={24} color={theme.foreground} />
            </HeaderButton>
          </View>
        }
      />
      <ClientForm client={newClient} />
    </View>
  );
};

export default CreateClientScreen;
