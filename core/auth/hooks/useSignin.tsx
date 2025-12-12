import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { resendCode } from "../actions/resend-code.action";
import { SignInRequest, signInSchema } from "../schemas/sign-in.schema";
import { useAuthStore } from "../store/useAuthStore";
import { useSignInMutation } from "./useSignInMutation";

export const useSignIn = () => {
  const { user } = useAuthStore();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors: formErrors },
  } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
    },
  });

  const { mutate: signIn, isPending, isError, error } = useSignInMutation();

  const handleSignIn = (values: SignInRequest) => {
    signIn(values, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Sign in successful",
          text2: "Welcome back!",
        });
        router.replace("/(app)/(tabs)/home");
      },
      onError: (error, variables) => {
        // If the response indicates that the email is not verified,
        // redirect to the verification page
        if (error.response?.data.error === "Email Not Verified") {
          resendCode(variables.email);
          router.replace("/auth/verify-email");
          Toast.show({
            type: "info",
            text1: "Email not verified",
            text2: "Please verify your email to continue.",
          });
          return;
        }

        // Handle 401 Unauthorized errors (incorrect credentials)
        const errorMessage =
          error.response?.data.message ||
          error.message ||
          "An unexpected error occurred.";

        if (error.response?.status === 401) {
          // Set error in root to display above the form
          setError("root", {
            type: "manual",
            message: errorMessage,
          });
        } else {
          // For other errors, show toast
          Toast.show({
            type: "error",
            text1: "Sign in failed",
            text2: errorMessage,
          });
        }
      },
    });
  };

  return {
    formErrors,
    control,
    isPending,
    isError,
    error,
    handleSignIn,
    handleSubmit,
  };
};
