import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import {
  Company,
  CreateCompanyRequest,
  createCompanySchema,
} from '@ascencio/shared';
import { Input } from '@/components/ui/Input';
import { useCompanyMutation } from '../hooks';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ImageUploader, theme } from '@/components/ui';

interface CompanyFormProps {
  company: Company;
}

export const CompanyForm = ({ company }: CompanyFormProps) => {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyRequest>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      ...company,
    },
  });

  const companyMutation = useCompanyMutation();

  const onSubmit = async (values: CreateCompanyRequest) => {
    await companyMutation.mutateAsync(values, {
      onSuccess: () => {
        toast.success(
          values.id === 'new'
            ? t('companyCreatedSuccessfully')
            : t('companyUpdatedSuccessfully'),
        );
        setTimeout(() => router.back(), 500);
      },
      onError: (error) => {
        toast.error(
          t(
            error.response?.data.message ||
              error.message ||
              'unknownErrorOccurred',
          ),
        );
      },
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: company.id === 'new' ? t('newCompany') : t('companyDetails'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            {companyMutation.isPending ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="save-outline" size={24} color={theme.primary} />
            )}
          </TouchableOpacity>

          {company.id !== 'new' && (
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.destructive}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
    >
      <ScrollView
        style={{ padding: 16, paddingTop: 8 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="logoUrl"
          render={({ field: { onChange, value } }) => (
            <ImageUploader
              value={value}
              onChange={onChange}
              folder="temp_files"
              // label={t('companyLogo')}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              label={t('name')}
              error={!!errors.name}
              errorMessage={getErrorMessage(errors.name)}
            />
          )}
        />

        <Controller
          control={control}
          name="legalName"
          render={({ field: { onChange, value } }) => (
            <Input
              label={`${t('legalName')}`}
              onChangeText={onChange}
              value={value}
              error={!!errors.legalName}
              errorMessage={getErrorMessage(errors.legalName)}
            />
          )}
        />

        <Controller
          control={control}
          name="businessNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('businessNumber')}
              onChangeText={onChange}
              value={value}
              error={!!errors.businessNumber}
              errorMessage={getErrorMessage(errors.businessNumber)}
              helperText="(123456789RC0001)"
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
              autoCapitalize="none"
              error={!!errors.email}
              errorMessage={getErrorMessage(errors.email)}
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
              error={!!errors.phone}
              errorMessage={getErrorMessage(errors.phone)}
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
              error={!!errors.address}
              errorMessage={getErrorMessage(errors.address)}
            />
          )}
        />

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('city')}
                onChangeText={onChange}
                value={value}
                error={!!errors.city}
                errorMessage={getErrorMessage(errors.city)}
                style={{ flex: 1 }}
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
                error={!!errors.province}
                errorMessage={getErrorMessage(errors.province)}
                style={{ flex: 1 }}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('postalCode')}
              onChangeText={onChange}
              value={value}
              error={!!errors.postalCode}
              errorMessage={getErrorMessage(errors.postalCode)}
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
              error={!!errors.payrollAccountNumber}
              errorMessage={getErrorMessage(errors.payrollAccountNumber)}
            />
          )}
        />

        {/* <Button onPress={handleSubmit(onSubmit)}>
          <ButtonIcon name="save-outline" />
          <ButtonText>{t('createCompany')}</ButtonText>
        </Button> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
