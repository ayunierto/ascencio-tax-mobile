import React, { use, useEffect, useLayoutEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { theme } from '@/components/ui/theme';
import {
  useCreateCompany,
  useUpdateCompany,
  useCompany,
} from '@/core/accounting/companies/hooks/useCompanies';
import {
  CreateCompanyRequest,
  createCompanySchema,
  UpdateCompanyRequest,
} from '@ascencio/shared/schemas';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { BottomBar } from '@/components/BottomBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loader from '@/components/Loader';

interface CompanyFormProps {
  isEditing?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isEditing = false }) => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: company, isPending: isLoadingCompany } = useCompany(id || '');
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyRequest>({
    resolver: zodResolver(createCompanySchema),
  });

  const { mutate: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany(
    id || '',
  );

  const isLoading = isCreating || isUpdating || isLoadingCompany;

  useEffect(() => {
    if (company && isEditing) {
      reset({
        name: company.name,
        legalName: company.legalName || '',
        businessNumber: company.businessNumber || '',
        address: company.address || '',
        city: company.city || '',
        province: company.province || '',
        postalCode: company.postalCode || '',
        phone: company.phone || '',
        email: company.email || '',
        payrollAccountNumber: company.payrollAccountNumber || '',
        logoUrl: company.logoUrl || '',
      });
    }
  }, [company, isEditing, reset]);

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

    const headerRight = () => (
      <Button
        variant="ghost"
        onPress={() => handleSubmit(onSubmit)()}
        style={{
          marginRight: 12,
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Ionicons name={'save-outline'} size={24} color="white" />
      </Button>
    );

    const headerLeft = () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {navigation.canGoBack && navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 8, marginRight: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.foreground} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={openDrawer}
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          <Ionicons name="menu" size={24} color={theme.foreground} />
        </TouchableOpacity>
      </View>
    );

    targetNav.setOptions({ headerRight, headerLeft });

    return () => {
      try {
        targetNav.setOptions({ headerRight: undefined, headerLeft: undefined });
      } catch (e) {
        // ignore
      }
    };
  }, [navigation, isEditing, isCreating, isUpdating]);

  const onSubmit = (data: CreateCompanyRequest) => {
    console.log({ data });
    if (isEditing && id) {
      updateCompany(data as UpdateCompanyRequest, {
        onSuccess: () => {
          setTimeout(() => router.back(), 500);
        },
      });
    } else {
      createCompany(data, {
        onSuccess: () => {
          setTimeout(() => router.back(), 500);
        },
      });
    }
  };

  if (isLoadingCompany) {
    return <Loader />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        // paddingTop: insets.top,
        paddingBottom: insets.bottom + 43,
      }}
    >
      <ScrollView style={{ flex: 1, padding: 16, marginBottom: 16 }}>
        <Controller
          control={control}
          name="logoUrl"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={'logoUrl'}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              label={'logoUrl'}
              error={!!errors.logoUrl}
              errorMessage={errors.logoUrl?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={t('name')}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              label={t('name')}
              error={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="legalName"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={`${t('legalName')}`}
              label={`${t('legalName')}`}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.legalName}
              errorMessage={errors.legalName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="businessNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={`${t('businessNumber')} (123456789RC0001)`}
              label={`${t('businessNumber')} (123456789RC0001)`}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.businessNumber}
              errorMessage={t(errors.businessNumber?.message || '')}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('email')}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              editable={!isLoading}
              error={!!errors.email}
              errorMessage={t(errors.email?.message || '')}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('phone')}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              editable={!isLoading}
              error={!!errors.phone}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('address')}
              onChangeText={onChange}
              value={value}
              multiline
              editable={!isLoading}
              error={!!errors.address}
              errorMessage={errors.address?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('city')}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.city}
              errorMessage={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="province"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('province')}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.province}
              errorMessage={errors.province?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('postalCode')}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.postalCode}
              errorMessage={errors.postalCode?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="payrollAccountNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('payrollAccountNumber')}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
              error={!!errors.payrollAccountNumber}
            />
          )}
        />
      </ScrollView>

      <BottomBar>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? theme.accent : theme.primary,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          isLoading={isLoading}
        >
          <ButtonIcon name="add" />
          <ThemedText
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {isLoading ? t('saving') : isEditing ? t('save') : t('create')}
          </ThemedText>
        </Button>
      </BottomBar>
    </KeyboardAvoidingView>
  );
};

export default CompanyForm;
