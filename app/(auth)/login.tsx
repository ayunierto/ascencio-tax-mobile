import { router } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { Controller } from "react-hook-form";
import { TextInput, View } from "react-native";

import SimpleLogo from "@/components/SimpleLogo";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import { Button, ButtonText } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { AuthFormContainer } from "@/core/auth/components/AuthFormContainer";
import { ErrorBox } from "@/core/auth/components/ErrorBox";
import Header from "@/core/auth/components/Header";
import { useSignIn } from "@/core/auth/hooks";
import { authStyles } from "@/core/auth/styles/authStyles";

const SignInScreen = () => {
  const { control, handleSubmit, formErrors, isPending, handleSignIn } =
    useSignIn();

  const passwordInputRef = useRef<TextInput>(null);

  const handleForgotPassword = useCallback(() => {
    if (!isPending) {
      router.push("/forgot-password");
    }
  }, [isPending]);

  const submitButtonText = useMemo(
    () => (isPending ? "Signing in..." : "Sign in"),
    [isPending]
  );

  return (
    <AuthFormContainer>
      <View style={authStyles.logoContainer}>
        <SimpleLogo />
      </View>

      <Header
        title={"Sign in to Ascencio Tax"}
        subtitle=" Don't have an account?"
        link="/register"
        linkText="Sign Up"
      />

      <View style={authStyles.fieldsContainer}>
        <ErrorBox message={formErrors.root?.message} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              leadingIcon="at-outline"
              label="Email"
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
              errorMessage={formErrors.email?.message}
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
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={true}
              autoComplete="password"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(handleSignIn)}
              error={!!formErrors.password}
              errorMessage={formErrors.password?.message}
            />
          )}
        />
      </View>

      <ThemedText style={authStyles.linkText} onPress={handleForgotPassword}>
        Forgot password?
      </ThemedText>

      <Button
        disabled={isPending}
        onPress={handleSubmit(handleSignIn)}
        isLoading={isPending}
      >
        <ButtonText>{submitButtonText}</ButtonText>
      </Button>

      <TermsAndPrivacy />
    </AuthFormContainer>
  );
};

export default SignInScreen;
