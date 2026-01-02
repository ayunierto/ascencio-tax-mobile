import React, { useCallback, useMemo, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { SignInRequest } from '@ascencio/shared';
import { useSignIn } from '../hooks';
import { ErrorBox } from './ErrorBox';
import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonText } from '@/components/ui/Button';
import { authStyles } from '../styles/authStyles';
import { resendCode } from '../actions';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const SignInForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, formErrors, isPending, setError, signIn } =
    useSignIn();

  const passwordInputRef = useRef<TextInput>(null);

  const onForgotPassword = () => {
    if (!isPending) {
      router.push('/forgot-password');
    }
  };

  const onSignIn = (values: SignInRequest) => {
    signIn.mutateAsync(values, {
      onSuccess: () => {
        toast.success(t('signInSuccess'));
        router.replace('/(app)/(dashboard)');
      },
      onError: (error, variables) => {
        // If the response indicates that the email is not verified,
        // redirect to the verification page
        if (error.response?.data.message === 'emailNotVerified') {
          toast.info(
            t(error.response?.data.message || 'Please verify your email.'),
          );
          resendCode(variables.email);
          router.push('/verify-email');
          return;
        }

        // Handle 401 Unauthorized errors (incorrect credentials)
        const errorMessageKey =
          error.response?.data.message ||
          error.message ||
          'An unexpected error occurred.';

        if (error.response?.status === 401) {
          // Set error in root to display above the form
          setError('root', {
            type: 'manual',
            message: t(errorMessageKey),
          });
        } else {
          // For other errors, show toast
          toast.error(t(errorMessageKey));
        }
      },
    });
  };

  return (
    <>
      <View style={authStyles.fieldsContainer}>
        <ErrorBox message={formErrors.root?.message} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leadingIcon="at-outline"
              label={t('email')}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              error={!!formErrors.email}
              errorMessage={getErrorMessage(formErrors.email)}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={passwordInputRef}
              leadingIcon="lock-closed-outline"
              label={t('password')}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={true}
              autoComplete="password"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSignIn)}
              error={!!formErrors.password}
              errorMessage={getErrorMessage(formErrors.password)}
            />
          )}
        />
      </View>

      <ThemedText style={authStyles.linkText} onPress={onForgotPassword}>
        {t('forgotPassword')}
      </ThemedText>

      <Button
        disabled={isPending}
        onPress={handleSubmit(onSignIn)}
        isLoading={isPending}
      >
        <ButtonText>{isPending ? t('signingIn') : t('signIn')}</ButtonText>
      </Button>
    </>
  );
};
