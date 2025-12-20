import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui/Card/Card';
import { CardContent } from '@/components/ui/Card/CardContent';
import { SimpleCardHeader } from '@/components/ui/Card/SimpleCardHeader';
import { SimpleCardHeaderTitle } from '@/components/ui/Card/SimpleCardHeaderTitle';
import { theme } from '@/components/ui/theme';
import { useExpenseCard } from '@/core/accounting/expenses/hooks/useExpenseCard';
import { ExpenseResponse } from '@/core/accounting/expenses/interfaces';

interface ExpenseCardProps {
  expense: ExpenseResponse;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const { dateToLocaleDateTimeString } = useExpenseCard();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/(tabs)/expenses/${expense.id}`)}
      style={{ marginBottom: 10 }}
    >
      <Card>
        <CardContent>
          <SimpleCardHeader>
            <Ionicons
              name={'receipt-outline'}
              size={20}
              color={theme.foreground}
            />
            <SimpleCardHeaderTitle>{expense.merchant}</SimpleCardHeaderTitle>
          </SimpleCardHeader>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Date</Text>
            <Text style={styles.metricValue}>{`${dateToLocaleDateTimeString(
              expense.date,
            )}`}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricValue}>${expense.total}</Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricLabel: {
    color: theme.foreground,
  },
  metricValue: {
    fontWeight: 'bold',
    color: theme.foreground,
  },
});

export default ExpenseCard;
