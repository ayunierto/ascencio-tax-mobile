import React from 'react';

import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { FieldError } from 'react-hook-form';

interface ErrorMessageProps {
  fieldErrors?: FieldError;
  message?: string;
}

const ErrorMessage = ({ fieldErrors, message }: ErrorMessageProps) => {
  return (
    <>
      {fieldErrors && (
        <ThemedText style={{ color: theme.destructive, marginTop: -6 }}>
          {fieldErrors?.message}
        </ThemedText>
      )}
      {message && (
        <ThemedText style={{ color: theme.destructive }}>{message}</ThemedText>
      )}
    </>
  );
};

export default ErrorMessage;
