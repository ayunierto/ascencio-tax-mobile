import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { useEffect } from 'react';
import { theme } from '@/components/ui/theme';
import {
  HeroSection,
  FeaturesSection,
  QuickLinksSection,
  FooterSection,
} from '@/components/landing';

export default function LandingPage() {
  const { authStatus, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace('/(app)/(tabs)/home');
    }
  }, [authStatus]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <HeroSection />
      <FeaturesSection />
      <QuickLinksSection />
      <FooterSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
