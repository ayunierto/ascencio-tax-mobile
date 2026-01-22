import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';

import { AppointmentCard } from '@/components/bookings/AppointmentCard';
import { AppointmentListSkeleton } from '@/components/bookings/AppointmentCardSkeleton';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { theme } from '@/components/ui/theme';
import { getUserAppointments } from '@/core/appointments/actions/get-user-appointments.action';
import { Appointment } from '@/core/appointments/interfaces/appointmentResponse';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function PastAppointmentsScreen() {
  const {
    data: pastAppointments,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Appointment[], AxiosError<ServerException>>({
    queryKey: ['PastAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('past');
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const handleBookNew = () => {
    router.push('/(app)/(dashboard)');
  };

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          error.response?.data.message || error.message || 'An error occurred'
        }
        icon="alert-circle-outline"
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  if (!pastAppointments || pastAppointments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyContent
          title="No Past Appointments"
          subtitle="Your appointment history will appear here."
          icon="time-outline"
        />
        <View style={styles.buttonContainer}>
          <Button onPress={handleBookNew}>
            <ButtonIcon name="add-circle-outline" />
            <ButtonText>Book Appointment</ButtonText>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard appointment={item} isPast />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
