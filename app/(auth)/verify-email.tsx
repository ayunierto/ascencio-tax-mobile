import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthFormContainer } from "@/core/auth/components/AuthFormContainer";
import { ErrorBox } from "@/core/auth/components/ErrorBox";
import Header from "@/core/auth/components/Header";
import { useResendEmailCodeMutation } from "@/core/auth/hooks/useResendEmailCodeMutation";
import { useTimer } from "@/core/auth/hooks/useTimer";
import { useVerifyEmailMutation } from "@/core/auth/hooks/useVerifyEmailMutation";
import {
  VerifyCodeRequest,
  verifyCodeSchema,
} from "@/core/auth/schemas/verify-email-code.schema";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import { authStyles } from "@/core/auth/styles/authStyles";

const VerifyEmail = () => {
  const { tempEmail } = useAuthStore();
  const { timeRemaining, isRunning, startTimer, resetTimer } = useTimer(30);

  useEffect(() => {
    startTimer();

    return () => {
      resetTimer();
    };
  }, [resetTimer, startTimer]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<VerifyCodeRequest>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: tempEmail,
      code: "",
    },
  });

  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation();

  const handleEmailVerification = useCallback(
    async (data: VerifyCodeRequest) => {
      await verifyEmail(data, {
        onSuccess: () => {
          resetTimer();
        },
        onError: () => {
          resetTimer();
          startTimer();
          resetField("code");
        },
      });
    },
    [verifyEmail, resetTimer, startTimer, resetField]
  );

  const { mutate: resendEmailCode, isPending: isLoadingResend } =
    useResendEmailCodeMutation();

  const handleResendVerificationCode = useCallback(() => {
    if (tempEmail) {
      if (isRunning) return;
      resendEmailCode(tempEmail);

      resetTimer();
      startTimer();
    }
  }, [tempEmail, isRunning, resendEmailCode, resetTimer, startTimer]);

  const submitButtonText = useMemo(
    () => (isPending ? "Verifying..." : "Verify"),
    [isPending]
  );

  const resendButtonText = useMemo(
    () => (timeRemaining === 0 ? "Resend code" : `Resend in ${timeRemaining}s`),
    [timeRemaining]
  );

  if (!tempEmail) {
    return <Redirect href={"/(app)/(tabs)/home"} />;
  }

  return (
    <AuthFormContainer maxWidth={320}>
      <Header
        title={"Verify email"}
        subtitle={
          "Please check your email for a message with your code. Your code is 6 numbers long."
        }
      />

      <View style={authStyles.fieldsContainer}>
        <ErrorBox message={errors.root?.message || errors.email?.message} />

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Code"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(handleEmailVerification)}
              error={!!errors.code}
              errorMessage={errors.code?.message}
            />
          )}
        />
      </View>

      <View style={authStyles.buttonGroup}>
        <Button
          disabled={isPending}
          onPress={handleSubmit(handleEmailVerification)}
          isLoading={isPending}
        >
          <ButtonText>{submitButtonText}</ButtonText>
        </Button>

        <Button
          disabled={isLoadingResend || isRunning}
          onPress={handleResendVerificationCode}
          variant="outline"
        >
          <ButtonText>{resendButtonText}</ButtonText>
        </Button>
      </View>
    </AuthFormContainer>
  );
};

export default VerifyEmail;
