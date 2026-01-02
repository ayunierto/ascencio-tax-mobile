import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { Card, CardContent, theme } from '@/components/ui';
import { Company } from '@ascencio/shared';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { useTranslation } from 'react-i18next';

interface CompanyCardProps {
  company: Company;
  isDeleting: boolean;
  handleDelete: (companyId: string) => void;
}

export const CompanyCard = ({
  company,
  isDeleting,
  handleDelete,
}: CompanyCardProps) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/companies/${company.id}`)}
      disabled={isDeleting}
    >
      <Card>
        <CardContent style={styles.cardContent}>
          <View>
            <ThemedText
              numberOfLines={1}
              style={{ fontWeight: 'bold', marginBottom: 4 }}
            >
              {company.name}
            </ThemedText>

            <ThemedText style={styles.subtitle} numberOfLines={1}>
              {company.legalName}
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              {company.businessNumber}
            </ThemedText>
          </View>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={isDeleting}
                isLoading={isDeleting}
              >
                <ButtonIcon
                  name="trash-outline"
                  style={{ color: theme.destructive }}
                />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('thisActionCannotBeUndone')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onPress={() => handleDelete(company.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: { color: theme.muted, fontSize: 12 },
});
