import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { AppointmentCard } from "@/components/bookings/AppointmentCard";
import { AppointmentListSkeleton } from "@/components/bookings/AppointmentCardSkeleton";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/Button";
import { theme } from "@/components/ui/theme";
import { ThemedText } from "@/components/themed-text";
import { cancelAppointment } from "@/core/appointments/actions/cancel-appointment.action";
import { getUserAppointments } from "@/core/appointments/actions/get-user-appointments.action";
import { Appointment } from "@/core/appointments/interfaces/appointmentResponse";
import { EmptyContent } from "@/core/components";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function AppointmentsIndexScreen() {
  const queryClient = useQueryClient();

  const {
    data: pendingAppointments,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Appointment[], AxiosError<ServerException>>({
    queryKey: ["pendingAppts"],
    queryFn: async () => {
      const data = await getUserAppointments("pending");
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 min
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingAppts"] });
      queryClient.invalidateQueries({ queryKey: ["PastAppts"] });
      Toast.show({
        type: "success",
        text1: "Appointment Cancelled",
        text2: "Your appointment has been cancelled successfully.",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to cancel appointment",
      });
    },
  });

  const handleCancelAppointment = async (
    appointmentId: string,
    reason?: string
  ) => {
    await cancelMutation.mutateAsync({ id: appointmentId, reason });
  };

  const handleBookNew = () => {
    router.push("/(app)/(tabs)/appointments/new/availability");
  };

  const handleViewPast = () => {
    router.push("/(app)/(tabs)/appointments/past");
  };

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          error.response?.data.message || error.message || "An error occurred"
        }
        icon="alert-circle-outline"
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  if (!pendingAppointments || pendingAppointments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyContent
          title="No Appointments"
          subtitle="You don't have any upcoming appointments. Book one now!"
          icon="calendar-outline"
        />
        <View style={styles.buttonContainer}>
          <Button onPress={handleBookNew} style={styles.buttonSpacing}>
            <ButtonIcon name="add-circle-outline" />
            <ButtonText>Book Appointment</ButtonText>
          </Button>
          <Button onPress={handleViewPast} variant="outline">
            <ButtonIcon name="time-outline" />
            <ButtonText>View History</ButtonText>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          Upcoming Appointments
        </ThemedText>
        <Button onPress={handleViewPast} variant="ghost" size="sm">
          <ButtonText size="sm">View History</ButtonText>
          <ButtonIcon name="arrow-forward" />
        </Button>
      </View>

      <FlatList
        data={pendingAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onCancel={handleCancelAppointment}
          />
        )}
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

      <View style={styles.fab}>
        <Button onPress={handleBookNew}>
          <ButtonIcon name="add-circle-outline" />
          <ButtonText>Book New</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  buttonSpacing: {
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    left: 16,
  },
});
