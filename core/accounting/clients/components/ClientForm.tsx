import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import {
  Client,
  CreateClientRequest,
  createClientSchema,
} from '@ascencio/shared';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Button, ButtonIcon, theme } from '@/components/ui';
import {
  createClientMutation,
  deleteClientMutation,
  updateClientMutation,
} from '../hooks';
import { DeleteConfirmationDialog } from '@/core/components';

interface ClientFormProps {
  client: Client;
}

export const ClientForm = ({ client }: ClientFormProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientRequest>({
    resolver: zodResolver(createClientSchema),
    defaultValues: client,
  });

  const createMutation = createClientMutation();
  const updateMutation = updateClientMutation();
  const deleteMutation = deleteClientMutation();

  const onSubmit = async (values: CreateClientRequest) => {
    if (values.id !== 'new') {
      await updateMutation.mutateAsync(values, {
        onSuccess: () => {
          toast.success(t('clientUpdatedSuccessfully'));
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

    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        toast.success(t('clientCreatedSuccessfully'));
        setTimeout(() => router.back(), 500);
      },
      onError: (error) => {
        toast.error(t(error.response?.data.message || 'unknownErrorOccurred'));
      },
    });
  };

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(client.id, {
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
      console.error('Error deleting client:', error);
      toast.error(t('unknownErrorOccurred'));
      setIsDeleting(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: client.id === 'new' ? t('newClient') : t('clientDetails'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Button
            size="icon"
            variant="ghost"
            onPress={handleSubmit(onSubmit)}
            isLoading={createMutation.isPending || updateMutation.isPending}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending
            }
          >
            <ButtonIcon name="save-outline" style={{ color: theme.primary }} />
          </Button>

          {client.id !== 'new' && (
            <DeleteConfirmationDialog onDelete={handleDeleteClient}>
              <Button
                size="icon"
                variant="ghost"
                disabled={updateMutation.isPending || deleteMutation.isPending}
                isLoading={deleteMutation.isPending}
              >
                <ButtonIcon
                  name="trash-outline"
                  style={{ color: theme.destructive }}
                />
              </Button>
            </DeleteConfirmationDialog>
          )}
        </View>
      ),
    });
  }, [
    client.id,
    t,
    handleSubmit,
    onSubmit,
    handleDeleteClient,
    createMutation.isPending,
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
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                label={t('fullName')}
                error={!!errors.fullName}
                errorMessage={getErrorMessage(errors.fullName)}
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

          <View style={{ flexDirection: 'row', gap: 16 }}>
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
                  style={{ flex: 1 }}
                />
              )}
            />

            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={t('country')}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.country}
                  errorMessage={getErrorMessage(errors.country)}
                  style={{ flex: 1 }}
                />
              )}
            />
          </View>

          {/* Campos opcionales para individuos */}
          <Controller
            control={control}
            name="sin"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('sin')}
                onChangeText={onChange}
                value={value}
                helperText="XXX-XXX-XXX"
                error={!!errors.sin}
                errorMessage={getErrorMessage(errors.sin)}
              />
            )}
          />

          {/* Campo opcional para empresas */}
          <Controller
            control={control}
            name="businessNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('businessNumber')}
                onChangeText={onChange}
                value={value}
                helperText="123456789RC0001"
                error={!!errors.businessNumber}
                errorMessage={getErrorMessage(errors.businessNumber)}
              />
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
