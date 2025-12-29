import { View, Image, Text, StyleSheet } from 'react-native';
import { ContactCard } from './ContactCard';
import { FooterLink } from './FooterLink';
import { useTranslation } from 'react-i18next';

interface ContactInfo {
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string;
  text: string;
  secondaryText?: string;
  fullWidth?: boolean;
}

export function FooterSection() {
  const { t } = useTranslation();

  const CONTACT_INFO = [
    {
      icon: 'call' as const,
      label: t('phone'),
      text: '(416) 658-1208',
      secondaryText: '(416) 678-8098',
      fullWidth: true,
    },
    {
      icon: 'chatbubbles' as const,
      label: t('smsOnly'),
      text: '(877) 822-0871',
      fullWidth: true,
    },
    {
      icon: 'mail' as const,
      label: t('email'),
      text: 'ascenciotaxinc@gmail.com',
      fullWidth: true,
    },
    {
      icon: 'location' as const,
      label: t('address'),
      text: '1219 St Clair Ave West Suite G15\nToronto, ON M6E 1B5',
      fullWidth: true,
    },
  ];

  const RESOURCES = [
    t('canadaRevenueAgency'),
    t('questionsAnswers'),
    t('informationIntake'),
  ];

  const LEGAL = [t('termsOfUse'), t('privacyPolicy')];

  return (
    <View style={styles.footer}>
      {/* Logo */}
      <View style={styles.footerLogoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.footerLogo}
        />
      </View>

      {/* Contact Cards */}
      <View style={styles.contactCardsContainer}>
        {CONTACT_INFO.map((contact) => (
          <ContactCard
            key={contact.label}
            icon={contact.icon}
            label={contact.label}
            text={contact.text}
            secondaryText={contact.secondaryText}
            fullWidth={contact.fullWidth}
          />
        ))}
      </View>

      {/* Resources & Legal */}
      <View style={styles.footerLinksGrid}>
        <View style={styles.footerLinksColumn}>
          <Text style={styles.footerColumnTitle}>{t('resources')}</Text>
          {RESOURCES.map((resource) => (
            <FooterLink key={resource} text={resource} />
          ))}
        </View>

        <View style={styles.footerLinksColumn}>
          <Text style={styles.footerColumnTitle}>{t('legal')}</Text>
          {LEGAL.map((legal) => (
            <FooterLink key={legal} text={legal} />
          ))}
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.footerBottom}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerCopyright}>
          © 2025 Ascencio Tax Inc. {t('allRightsReserved')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#1a1a2e',
  },
  footerLogoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerLogo: {
    width: 200,
    height: 85,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  contactCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  footerLinksColumn: {
    flex: 1,
  },
  footerColumnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerBottom: {
    marginTop: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});
