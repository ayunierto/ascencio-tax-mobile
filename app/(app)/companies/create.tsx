import React from 'react';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Company } from '@ascencio/shared';
import { CompanyForm } from '@/core/accounting/companies/components';
import { theme, CustomHeader, HeaderButton } from '@/components/ui';

const CreateCompanyScreen = ({}) => {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const newCompany: Company = {
    id: 'new',
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    email: '',
    phone: '',
    businessNumber: '',
    legalName: '',
    logoUrl: '',
    users: [],
    deletedAt: '',
    payrollAccountNumber: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CustomHeader
        title={t('createCompany')}
        left={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <HeaderButton onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </HeaderButton>
            <HeaderButton
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons name="menu" size={24} color="#ffffff" />
            </HeaderButton>
          </View>
        }
      />
      <CompanyForm company={newCompany} />
    </View>
  );
};

export default CreateCompanyScreen;
