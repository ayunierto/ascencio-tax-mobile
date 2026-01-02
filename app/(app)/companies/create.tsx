import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Company } from '@ascencio/shared';
import { CompanyForm } from '@/core/accounting/companies/components';
import { theme } from '@/components/ui';

const CreateCompanyScreen = ({}) => {
  const navigation: any = useNavigation();

  useLayoutEffect(() => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const targetNav = parentNav ?? navigation;

    const openDrawer = () => {
      const drawerNav = navigation.getParent ? navigation.getParent() : null;
      if (drawerNav && typeof drawerNav.openDrawer === 'function') {
        drawerNav.openDrawer();
      } else if (typeof navigation.openDrawer === 'function') {
        navigation.openDrawer();
      }
    };

    const headerLeft = () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {navigation.canGoBack && navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 8, marginRight: 8 }}
          >
            <Ionicons color={theme.foreground} size={24} name="chevron-back" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={openDrawer}
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          <Ionicons color={theme.foreground} size={24} name="menu" />
        </TouchableOpacity>
      </View>
    );

    targetNav.setOptions({ headerLeft });

    return () => {
      try {
        targetNav.setOptions({ headerRight: undefined, headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation]);

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

  return <CompanyForm company={newCompany} />;
};

export default CreateCompanyScreen;
