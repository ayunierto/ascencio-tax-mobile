import { useCameraStore } from '@/core/camera/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { createUpdateExpense } from '../actions';

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();
  const { removeImage } = useCameraStore();

  return useMutation({
    mutationFn: createUpdateExpense,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });

      // To update dashboard
      await queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['logs'],
      });

      Toast.show({
        type: 'success',
        text1: `Receipt ${data.merchant} saved.`,
        text2: 'Receipt was saved correctly',
      });
      removeImage();
      router.replace('/(app)/(tabs)/expenses');
    },
    onError() {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error saving receipt. Please try again later.',
      });
    },
  });
};
