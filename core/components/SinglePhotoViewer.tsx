// Import necessary components
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';

interface SinglePhotoViewerProps {
  imageUrl: string | undefined;
  isVisible: boolean;
  onClose: () => void;
}

// Define the component
export const SinglePhotoViewer = ({
  imageUrl,
  isVisible,
  onClose,
}: SinglePhotoViewerProps) => {
  // Prepare the image data structure required by ImageViewer
  // It expects an array of objects, even for a single image.
  const images: IImageInfo[] = imageUrl ? [{ url: imageUrl }] : [];

  if (!isVisible || !imageUrl) {
    return null; // Don't render anything if not visible or no URL
  }

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <ImageViewer
        imageUrls={images}
        enableSwipeDown={true} // Allows closing by swiping down
        onSwipeDown={onClose} // Call onClose when swiped down
        renderHeader={() => (
          // Optional: Add a custom header (e.g., a close button)
          <View style={styles.header}>
            <Button title="Close" onPress={onClose} color="#fff" />
          </View>
        )}
        // Optional: Show a loading indicator while the image loads
        loadingRender={() => <ActivityIndicator size="large" color="#fff" />}
        // Optional: Customize the rendering for failed image loads
        failImageSource={{
          // Display a placeholder if the image fails to load
          url: 'https://placehold.co/300x300?text=Load+Error&font=source-sans-pro', // Example placeholder URL
          width: 300,
          height: 300,
        }}
        // You might not need an index indicator for a single image,
        // but you can hide it explicitly if it appears
        // renderIndicator={(currentIndex, allSize) => null}
      />
    </Modal>
  );
};

// Basic styles (customize as needed)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 40, // Adjust based on status bar height or safe area
    right: 20,
    zIndex: 1, // Ensure it's above the image viewer
  },
});
