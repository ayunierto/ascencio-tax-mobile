import React from 'react';
import { View } from 'react-native';
import { EmptyContent } from '@/core/components';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true });
  });

  return (
    <View style={{ flex: 1 }}>
      <EmptyContent title={t('comingSoon')} subtitle={t('stayTuned')} />
    </View>
  );
}
