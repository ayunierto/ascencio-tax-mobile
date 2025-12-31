import React from 'react';

import SimpleLogo from '@/components/SimpleLogo';
import TermsAndPrivacy from '@/components/TermsAndPrivacy';
import { AuthFormContainer } from '@/core/auth/components/AuthFormContainer';
import Header from '@/core/auth/components/Header';
import { authStyles } from '@/core/auth/styles/authStyles';
import { SignInForm } from '@/core/auth/components/SignInForm';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const SignInScreen = () => {
  const { t } = useTranslation();

  return (
    <AuthFormContainer>
      <View style={authStyles.logoContainer}>
        <SimpleLogo />
      </View>

      <Header
        title={t('signInScreenTitle')}
        subtitle={` ${t('dontHaveAccount')}`}
        link="/register"
        linkText={t('signUp')}
      />

      <SignInForm />

      <TermsAndPrivacy />
    </AuthFormContainer>
  );
};

export default SignInScreen;
