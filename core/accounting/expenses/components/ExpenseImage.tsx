import React, { useState } from 'react';

import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button, ButtonIcon } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import { SinglePhotoViewer } from '@/core/components/SinglePhotoViewer';
import Toast from 'react-native-toast-message';
import { useReceiptImageMutation } from '../hooks/useReceiptImageMutation';

type ExpenseImageProps = {
  imageUrl?: string;
  onChange: (image: string | undefined) => void;
  expenseId: string;
};

const ReceiptUploader = ({
  imageUrl,
  onChange,
  expenseId,
}: ExpenseImageProps) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const { removeReceiptImageMutation } = useReceiptImageMutation();

  const openViewer = () => setIsViewerVisible(true);
  const closeViewer = () => setIsViewerVisible(false);

  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    await removeReceiptImageMutation.mutateAsync(
      { imageUrl },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Image removed',
          });
          onChange(undefined);
        },
        onError: (error) => {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: error.response?.data.message || error.message,
          });
        },
      },
    );
  };

  return (
    <View style={styles.imageContainer}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {imageUrl ? (
          <>
            <TouchableOpacity onPress={openViewer}>
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.radius,
                }}
              />
            </TouchableOpacity>

            <SinglePhotoViewer
              imageUrl={imageUrl}
              isVisible={isViewerVisible}
              onClose={closeViewer}
            />
          </>
        ) : (
          <ThemedText>No receipt image selected</ThemedText>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            variant="default"
            size="icon"
            onPress={() =>
              router.replace({
                pathname: '/(app)/expenses/scan',
                params: { id: expenseId },
              })
            }
          >
            <ButtonIcon name="camera-outline" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onPress={() => handleRemoveImage()}
            disabled={!imageUrl}
          >
            <ButtonIcon name="trash-outline" />
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderColor: theme.foreground,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default ReceiptUploader;
