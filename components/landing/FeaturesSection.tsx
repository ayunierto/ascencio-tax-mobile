import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import FeatureCard from "@/components/features/home/FeatureCard";

const FEATURES = [
  {
    icon: "calendar-outline" as const,
    title: "Easy Appointments",
    description: "Book and manage your appointments with ease",
  },
  {
    icon: "receipt-outline" as const,
    title: "Track Expenses",
    description: "Keep track of all your business expenses",
  },
  {
    icon: "document-text-outline" as const,
    title: "Manage Invoices",
    description: "Create and manage invoices on the go",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Secure & Private",
    description: "Your data is encrypted and secure",
  },
];

export function FeaturesSection() {
  return (
    <View style={styles.featuresSection}>
      <ThemedText style={styles.sectionTitle}>Why Choose Us?</ThemedText>

      <View style={styles.featuresList}>
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuresSection: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  featuresList: {
    gap: 16,
  },
});
