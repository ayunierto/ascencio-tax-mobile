import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Controller } from "react-hook-form";
import { FlatList, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

import SimpleLogo from "@/components/SimpleLogo";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import { Button, ButtonText } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { AuthFormContainer } from "@/core/auth/components/AuthFormContainer";
import { ErrorBox } from "@/core/auth/components/ErrorBox";
import Header from "@/core/auth/components/Header";
import { useSignUp } from "@/core/auth/hooks";
import { SignUpResponse } from "@/core/auth/interfaces";
import {
  SignUpApiRequest,
  SignUpRequest,
} from "@/core/auth/schemas/sign-up.schema";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import { authStyles } from "@/core/auth/styles/authStyles";
import { useCountryCodes } from "@/core/hooks/useCountryCodes";
import { ServerException } from "@/core/interfaces/server-exception.response";

const SignUp = () => {
  const { countryCodes } = useCountryCodes();
  const { signUp } = useAuthStore();
  const { errors, control, handleSubmit, setError } = useSignUp();

  // Refs for input navigation
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const mutation = useMutation<
    SignUpResponse,
    AxiosError<ServerException>,
    SignUpApiRequest
  >({
    mutationFn: async (data) => {
      return await signUp(data);
    },
    onSuccess: () => {
      router.push("/auth/verify-email");
      Toast.show({
        type: "success",
        text1: "Sign up successful",
        text2: "Please verify your email to continue.",
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data.message ||
        error.message ||
        "An error occurred during sign up.";

      // Handle validation and conflict errors (400, 409)
      if (error.response?.status === 400 || error.response?.status === 409) {
        // Set error in root to display above the form
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        // For other errors, show toast
        Toast.show({
          type: "error",
          text1: "Sign up failed",
          text2: errorMessage,
        });
      }
    },
  });

  const onSignUp = useCallback(
    async (values: SignUpRequest): Promise<void> => {
      const { confirmPassword, ...rest } = values;
      await mutation.mutateAsync(rest);
    },
    [mutation]
  );

  const submitButtonText = useMemo(
    () => (mutation.isPending ? "Creating..." : "Create account"),
    [mutation.isPending]
  );

  return (
    <AuthFormContainer showTopSpacing={false}>
      <View style={authStyles.smallLogoContainer}>
        <SimpleLogo />
      </View>

      <Header
        title="Sign up for Ascencio Tax"
        link={"/login"}
        linkText="Sign in"
        subtitle="Already have an account? "
      />

      <View style={authStyles.fieldsContainer}>
        <ErrorBox message={errors.root?.message} />

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="First name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              errorMessage={errors.firstName?.message}
              error={!!errors.firstName}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={lastNameRef}
              label="Last name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="words"
              autoComplete="name-family"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              errorMessage={errors.lastName?.message}
              error={!!errors.lastName}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={emailRef}
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              blurOnSubmit={false}
              errorMessage={errors.email?.message}
              error={!!errors.email}
            />
          )}
        />

        <View style={authStyles.phoneContainer}>
          <Controller
            control={control}
            name={"countryCode"}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger placeholder="Select your country" />
                <SelectContent>
                  <FlatList
                    data={countryCodes}
                    keyExtractor={(item) => item.value + item.label}
                    renderItem={({ item: opt }) => (
                      <SelectItem
                        key={opt.value + opt.label}
                        label={opt.label}
                        value={opt.value}
                      />
                    )}
                  />
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={phoneRef}
                label="Phone Number"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                autoCapitalize="none"
                autoComplete="tel"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                rootStyle={authStyles.phoneInput}
                errorMessage={errors.phoneNumber?.message}
                error={!!errors.phoneNumber}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={passwordRef}
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              blurOnSubmit={false}
              errorMessage={errors.password?.message}
              error={!!errors.password}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={confirmPasswordRef}
              label="Confirm Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Confirm Password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSignUp)}
              errorMessage={errors.confirmPassword?.message}
              error={!!errors.confirmPassword}
            />
          )}
        />
      </View>

      <Button
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        onPress={handleSubmit(onSignUp)}
      >
        <ButtonText>{submitButtonText}</ButtonText>
      </Button>

      <TermsAndPrivacy />
    </AuthFormContainer>
  );
};

export default SignUp;
