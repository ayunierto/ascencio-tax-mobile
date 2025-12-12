import { zodResolver } from '@hookform/resolvers/zod';
import { getLocales } from 'expo-localization';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import { SignUpRequest, signUpSchema } from '../schemas/sign-up.schema';

export const useSignUp = () => {
  const { location } = useIPGeolocation();
  const [callingCode, setCallingCode] = useState<string | undefined>();

  // Set the initial calling code based on the user's location
  useEffect(() => {
    if (location) {
      if ('error' in location) return;
      setCallingCode(`+${location.location.calling_code}`);
      setValue('countryCode', `+${location.location.calling_code}`);
    }
  }, [location]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: getLocales()[0].languageTag,
    },
  });

  return {
    control,
    errors,
    callingCode,
    setError,
    handleSubmit,
    setValue,
  };
};
