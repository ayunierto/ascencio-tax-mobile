import React, { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/Card/CardContent';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import {
  UpdateProfileRequest,
  updateProfileSchema,
} from '@/core/auth/schemas/update-profile.schema';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';
import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import { useUpdateProfileMutation } from '@/core/user/hooks/useUpdateProfileMutation';
import Toast from 'react-native-toast-message';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { countryCodes } = useCountryCodes();
  const [callingCode, setCallingCode] = useState<string | undefined>();

  const { location } = useIPGeolocation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber || '',
      countryCode: user?.countryCode || callingCode || '',
    },
  });

  useEffect(() => {
    if (location) {
      if ('error' in location) return;
      setCallingCode(`+${location.location.calling_code}`);
      setValue('countryCode', `+${location.location.calling_code}`);
    }
  }, [location, setValue]);

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const handleUpdateProfile = async (values: UpdateProfileRequest) => {
    updateProfile(values, {
      onSuccess: (response) => {
        Toast.show({
          type: 'success',
          text1: 'Profile updated',
          text2: response.message,
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Profile update failed',
          text2:
            error.response?.data.message ||
            error.message ||
            'An error occurred while updating the profile.',
        });
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={{ marginBottom: 8 }}>
              <ThemedText
                style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}
              >
                Edit Profile
              </ThemedText>
              <ThemedText
                style={{ fontSize: 14, color: theme.mutedForeground }}
              >
                Update your personal information
              </ThemedText>
            </View>

            {/* Personal Information Section */}
            <Card>
              <CardContent>
                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.primary}
                    />
                    <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                      Personal Information
                    </ThemedText>
                  </View>

                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="First Name"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Enter your first name"
                        autoCapitalize="words"
                        autoComplete="name"
                        error={!!errors.firstName}
                        errorMessage={errors.firstName?.message || ''}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Last Name"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Enter your last name"
                        autoCapitalize="words"
                        autoComplete="name-family"
                        error={!!errors.lastName}
                        errorMessage={errors.lastName?.message || ''}
                      />
                    )}
                  />
                </View>
              </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card>
              <CardContent>
                <View style={{ gap: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.primary}
                    />
                    <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                      Contact Information
                    </ThemedText>
                  </View>

                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <Input
                          label="Email"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          readOnly={true}
                          error={!!errors.email}
                          errorMessage={errors.email?.message || ''}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 6,
                            backgroundColor: theme.muted + '30',
                            padding: 8,
                            borderRadius: theme.radius / 2,
                          }}
                        >
                          <Ionicons
                            name="information-circle-outline"
                            size={16}
                            color={theme.mutedForeground}
                          />
                          <ThemedText
                            style={{
                              fontSize: 12,
                              color: theme.mutedForeground,
                              flex: 1,
                            }}
                          >
                            Email cannot be changed for security reasons
                          </ThemedText>
                        </View>
                      </View>
                    )}
                  />

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Controller
                      control={control}
                      name={'countryCode'}
                      render={({ field: { onChange, value } }) => (
                        <View style={{ flex: 1 }}>
                          <Select
                            value={value}
                            onValueChange={onChange}
                            error={!!errors.countryCode}
                            errorMessage={errors.countryCode?.message}
                          >
                            <SelectTrigger
                              placeholder="Code"
                              labelText="Country Code"
                            />
                            <SelectContent>
                              {countryCodes.map((opt) => (
                                <SelectItem
                                  key={opt.value + opt.label}
                                  label={opt.label}
                                  value={opt.value}
                                />
                              ))}
                            </SelectContent>
                          </Select>
                        </View>
                      )}
                    />

                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          label="Phone Number"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="phone-pad"
                          placeholder="Enter phone number"
                          autoCapitalize="none"
                          autoComplete="tel"
                          rootStyle={{ flex: 2 }}
                          errorMessage={errors.phoneNumber?.message}
                          error={!!errors.phoneNumber}
                        />
                      )}
                    />
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
              <CardContent>
                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.primary}
                    />
                    <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                      Security
                    </ThemedText>
                  </View>

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View>
                        <Input
                          label="New Password"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          placeholder="Enter new password (optional)"
                          autoCapitalize="none"
                          secureTextEntry
                          autoComplete="password-new"
                          error={!!errors.password}
                          errorMessage={errors.password?.message || ''}
                        />

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 6,
                            backgroundColor: theme.muted + '30',
                            padding: 8,
                            borderRadius: theme.radius / 2,
                          }}
                        >
                          <Ionicons
                            name="shield-checkmark-outline"
                            size={16}
                            color={theme.mutedForeground}
                          />

                          <ThemedText
                            style={{
                              fontSize: 12,
                              color: theme.mutedForeground,
                              flex: 1,
                            }}
                          >
                            Leave blank to keep current password
                          </ThemedText>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <View style={{ gap: 12, marginTop: 8 }}>
              <Button
                disabled={isPending}
                onPress={handleSubmit(handleUpdateProfile)}
              >
                <ButtonIcon name="save-outline" />
                <ButtonText>
                  {isPending ? 'Updating Profile...' : 'Save Changes'}
                </ButtonText>
              </Button>

              <Divider />

              {/* Danger Zone */}
              <View
                style={{
                  backgroundColor: theme.destructive + '15',
                  padding: 12,
                  borderRadius: theme.radius,
                  borderWidth: 1,
                  borderColor: theme.destructive + '30',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="warning-outline"
                    size={20}
                    color={theme.destructive}
                  />
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: theme.destructive,
                    }}
                  >
                    Danger Zone
                  </ThemedText>
                </View>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: theme.mutedForeground,
                    marginBottom: 12,
                  }}
                >
                  Deleting your account is permanent and cannot be undone
                </ThemedText>
                <Link
                  href={'/(app)/(tabs)/profile/delete-account'}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={theme.destructive}
                  />
                  {'  '}Delete Account
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 10,
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto',
    gap: 16,
  },
  deleteButton: {
    color: theme.destructive,
    padding: 12,
    borderColor: theme.destructive,
    borderWidth: 1,
    borderRadius: theme.radius,
    height: 44,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: theme.card,
  },
});
