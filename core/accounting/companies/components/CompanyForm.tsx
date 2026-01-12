import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  ImageUploader,
  ImageUploaderRef,
  theme,
} from '@/components/ui';
import {
  createCompanyMutation,
  deleteCompanyMutation,
  updateCompanyMutation,
} from '../hooks';

interface CompanyFormProps {
  company: Company;
}

export const CompanyForm = ({ company }: CompanyFormProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  // For existing companies, use logoUrl as the initial image value
  // For new companies, mediaToken will be undefined initially
  const initialMediaToken = company.id !== 'new' ? company.logoUrl : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyRequest>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      ...company,
      // Use logoUrl for display when editing existing company
      mediaToken: initialMediaToken,
    },
  });
  const createCompany = createCompanyMutation();
  const updateCompany = updateCompanyMutation();
  const deleteCompany = deleteCompanyMutation();

  const onSubmit = async (values: CreateCompanyRequest) => {
    // Only send mediaToken if it's a new temp upload (starts with temp_files/)
    // If it's the same as logoUrl, don't send it (no change)
    const mediaTokenToSend =
      values.mediaToken?.startsWith('temp_files/') ? values.mediaToken : undefined;

    const submitData = {
      ...values,
      mediaToken: mediaTokenToSend,
    };

    if (values.id !== 'new') {
      await updateCompany.mutateAsync(submitData, {
        onSuccess: () => {
          // Mark image as saved to prevent cleanup
          imageUploaderRef.current?.markAsSaved();
          toast.success(t('companyUpdatedSuccessfully'));
          setTimeout(() => router.back(), 500);
        },
        onError: (error) => {
          toast.error(
            t(error.response?.data.message || 'unknownErrorOccurred'),
          );
        },
      });
      return;
    }

    await createCompany.mutateAsync(submitData, {
      onSuccess: () => {
        // Mark image as saved to prevent cleanup
        imageUploaderRef.current?.markAsSaved();
        toast.success(t('companyCreatedSuccessfully'));
        setTimeout(() => router.back(), 500);
      },
      onError: (error) => {
        toast.error(t(error.response?.data.message || 'unknownErrorOccurred'));
      },
    });
  };

  const handleDeleteCompany = async () => {
    setIsDeleting(true);
    try {
      await deleteCompany.mutateAsync(company.id, {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
          setTimeout(() => router.back(), 500);
        },
        onError: (error) => {
          toast.error(
            t(error.response?.data?.message || error.message || 'canNotDelete'),
          );
          setIsDeleting(false);
        },
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(t('unknownErrorOccurred'));
      setIsDeleting(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: company.id === 'new' ? t('newCompany') : t('companyDetails'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={createCompany.isPending || isDeleting}
          >
            {createCompany.isPending ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="save-outline" size={24} color={theme.primary} />
            )}
          </TouchableOpacity>

          {company.id !== 'new' && (
            <TouchableOpacity
              onPress={handleDeleteCompany}
              disabled={createCompany.isPending || isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={theme.destructive} />
              ) : (
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={theme.destructive}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [
    company.id,
    t,
    handleSubmit,
    onSubmit,
    handleDeleteCompany,
    createCompany.isPending,
    isDeleting,
  ]);

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
        <View style={{ flex: 1, gap: 16 }}>
          <Controller
            control={control}
            name="mediaToken"
            render={({ field: { onChange, value } }) => (
              <ImageUploader
                ref={imageUploaderRef}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
