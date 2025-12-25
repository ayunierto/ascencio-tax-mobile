import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

interface CompanyFormProps {
  isEditing?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isEditing = false }) => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: company, isPending: isLoadingCompany } = useCompany(id || '');

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

  const onSubmit = (data: CreateCompanyRequest) => {
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="chevron-back" size={24} color={theme.primary} />
            </TouchableOpacity>
            <ThemedText>{isEditing ? 'editTitle' : 'createTitle'}</ThemedText>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 16 }}>
            {/* Name - Required */}
            <View>
              <ThemedText style={{ marginBottom: 8, fontWeight: 'bold' }}>
                name *
              </ThemedText>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: errors.name
                        ? theme.destructive
                        : theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="nameHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.name && (
                <ThemedText style={{ color: theme.destructive, marginTop: 4 }}>
                  {errors.name.message}
                </ThemedText>
              )}
            </View>

            {/* Legal Name */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>legalName</ThemedText>
              <Controller
                control={control}
                name="legalName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="legalNameHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Business Number */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>
                businessNumber
              </ThemedText>
              <Controller
                control={control}
                name="businessNumber"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="businessNumberHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Email */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>email</ThemedText>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="emailHint"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Phone */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>phone</ThemedText>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="phoneHint"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Address */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>address</ThemedText>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="addressHint"
                    onChangeText={onChange}
                    value={value}
                    multiline
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* City */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>city</ThemedText>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="cityHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Province */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>province</ThemedText>
              <Controller
                control={control}
                name="province"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="provinceHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Postal Code */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>postalCode</ThemedText>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="postalCodeHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>

            {/* Payroll Account Number */}
            <View>
              <ThemedText style={{ marginBottom: 8 }}>
                payrollAccountNumber
              </ThemedText>
              <Controller
                control={control}
                name="payrollAccountNumber"
                render={({ field: { onChange, value } }) => (
                  <Input
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                    }}
                    placeholder="payrollAccountNumberHint"
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer - Submit Button */}
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
          }}
        >
          <TouchableOpacity
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
          >
            {isLoading ? (
              <ActivityIndicator color="white" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons
                name={isEditing ? 'checkmark' : 'add'}
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <ThemedText
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {isLoading ? 'saving' : isEditing ? 'save' : 'create'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CompanyForm;
