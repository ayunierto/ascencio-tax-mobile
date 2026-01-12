import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { theme } from '@/components/ui/theme';
import { EmployeeForm, useEmployee } from '@/core/accounting/employees';
import Loader from '@/components/Loader';
import { EmptyContent } from '@/core/components';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: employee, isPending, isError, error } = useEmployee(id!);

  if (isPending) return <Loader />;

  if (isError) {
    return (
      <EmptyContent
        title="Error loading employee"
        subtitle={error?.message || 'Unknown error'}
        icon="alert-circle-outline"
      />
    );
  }

  if (!employee) {
    return (
      <EmptyContent
        title="Employee not found"
        subtitle="The employee you're looking for doesn't exist"
        icon="person-outline"
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <EmployeeForm employee={employee} />
    </View>
  );
}
