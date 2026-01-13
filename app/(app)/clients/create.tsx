import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Client } from '@ascencio/shared';
import { ClientForm } from '@/core/accounting/clients/components';
import { theme } from '@/components/ui';

const CreateClientScreen = () => {
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

  return <ClientForm client={newClient} />;
};

export default CreateClientScreen;
