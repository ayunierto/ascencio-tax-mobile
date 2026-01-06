import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

import { Button, ButtonIcon } from './Button';
import { ThemedText } from './ThemedText';
import { theme } from './theme';
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
} from './AlertDialog';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

type ImageSource = 'camera' | 'gallery';

interface ImageUploaderProps {
  /**
   * Current image URL (Cloudinary URL)
   */
  value?: string;

  /**
   * Callback when image URL changes
   */
  onChange: (imageUrl: string | undefined) => void;

  /**
   * Cloudinary folder for upload (defaults to 'temp_files')
   */
  folder?: string;

  /**
   * Label to display when no image is selected
   */
  label?: string;

  /**
   * Allow camera capture
   */
  allowCamera?: boolean;

  /**
   * Allow gallery selection
   */
  allowGallery?: boolean;
}

/**
 * ImageUploader Component
 *
 * A controlled component for uploading images to Cloudinary with camera and gallery support.
 *
 * Features:
 * - Uploads to Cloudinary immediately on selection
 * - Stores images in temporary folder by default
 * - Auto-cleanup of temp images on unmount
 * - Camera and gallery support with permission handling
 * - Loading states and error handling
 * - Delete functionality
 *
 * Usage:
 * ```tsx
 * <Controller
 *   control={control}
 *   name="logoUrl"
 *   render={({ field: { onChange, value } }) => (
 *     <ImageUploader
 *       value={value}
 *       onChange={onChange}
 *       folder="temp_files"
 *       label={t('companyLogo')}
 *     />
 *   )}
 * />
 * ```
 *
 * Important: When saving the form, move images from temp to permanent folder:
 * ```ts
 * if (data.logoUrl?.includes('/temp_files/')) {
 *   await filesService.move(publicId, `companies/${filename}`);
 * }
 * ```
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'temp_files',
  label,
  allowCamera = true,
  allowGallery = true,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Track the temp image URL to delete on unmount if not saved
  const tempImageRef = useRef<string | undefined>(undefined);

  /**
   * Extract publicId from Cloudinary URL
   * Example: https://res.cloudinary.com/.../ temp_files/abc123.jpg -> temp_files/abc123
   */
  const extractPublicId = (url: string): string | null => {
    try {
      const parts = url.split('/upload/');
      if (parts.length < 2) return null;

      const pathParts = parts[1].split('/');
      // Remove version (v1234567890) if present
      const relevantParts = pathParts.filter((part) => !part.startsWith('v'));

      // Get folder and filename, remove extension
      const filename = relevantParts[relevantParts.length - 1].split('.')[0];
      const folderPath = relevantParts.slice(0, -1).join('/');

      return folderPath ? `${folderPath}/${filename}` : filename;
    } catch (error) {
      console.error('Error extracting publicId:', error);
      return null;
    }
  };

  /**
   * Delete image from Cloudinary
   */
  const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
      throw new Error('Invalid image URL');
    }

    try {
      await axios.delete(`${API_URL}/files/${encodeURIComponent(publicId)}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  /**
   * Upload image to Cloudinary
   */
  const uploadImage = async (uri: string): Promise<string> => {
    const formData = new FormData();

    // Get file extension
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    formData.append('folder', folder);

    try {
      const response = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  /**
   * Handle image selection from camera or gallery
   */
  const handleSelectImage = async (source: ImageSource): Promise<void> => {
    setUploading(true);

    try {
      // Request permissions
      let permissionResult;
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert(
          t('permissionRequired'),
          t(
            source === 'camera'
              ? 'cameraPermissionMessage'
              : 'galleryPermissionMessage',
          ),
        );
        setUploading(false);
        return;
      }

      // Launch picker
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (result.canceled) {
        setUploading(false);
        return;
      }

      const selectedUri = result.assets[0].uri;

      // Delete old temp image if exists
      if (tempImageRef.current) {
        try {
          await deleteImageFromCloudinary(tempImageRef.current);
        } catch (error) {
          console.error('Error deleting old temp image:', error);
        }
      }

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImage(selectedUri);

      // Track this as temp image
      tempImageRef.current = cloudinaryUrl;

      // Update form value
      onChange(cloudinaryUrl);
      setImageLoadError(false);

      toast.success(t('imageUploadedSuccessfully'));
    } catch (error) {
      console.error('Error selecting/uploading image:', error);
      toast.error(t('imageUploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle delete image
   */
  const handleDeleteImage = async (): Promise<void> => {
    if (!value) return;
    try {
      await deleteImageFromCloudinary(value);
      onChange(undefined);
      tempImageRef.current = undefined;
      toast.success(t('imageDeletedSuccessfully'));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(t('imageDeleteFailed'));
    }
  };

  /**
   * Cleanup temp image on unmount if not saved
   */
  useEffect(() => {
    return () => {
      // Only cleanup if the image is still in temp folder
      const currentTemp = tempImageRef.current;
      if (currentTemp && currentTemp.includes(`/${folder}/`)) {
        deleteImageFromCloudinary(currentTemp).catch((error) => {
          console.error('Error cleaning up temp image on unmount:', error);
        });
      }
    };
  }, []); // Empty deps - only run on unmount

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View style={styles.imageContainer}>
        {value && !imageLoadError ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: value }}
              style={styles.image}
              onError={() => setImageLoadError(true)}
              resizeMode="cover"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  style={{ position: 'absolute', top: 12, right: 12 }}
                  variant="destructive"
                  disabled={uploading}
                  size="icon"
                  // isLoading={isDeleting}
                >
                  <ButtonIcon name="trash-outline" />
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
                  <AlertDialogAction onPress={handleDeleteImage}>
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name="image-outline"
              size={50}
              color={theme.mutedForeground}
            />
            <ThemedText style={styles.placeholderText}>
              {imageLoadError ? t('imageLoadError') : t('noImageSelected')}
            </ThemedText>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          {allowCamera && (
            <Button
              size="icon"
              onPress={() => handleSelectImage('camera')}
              disabled={uploading}
            >
              <ButtonIcon name="camera-outline" />
            </Button>
          )}

          {allowGallery && (
            <Button
              size="icon"
              onPress={() => handleSelectImage('gallery')}
              disabled={uploading}
            >
              <ButtonIcon name="images-outline" />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    marginTop: 12,
    textAlign: 'center',
    color: theme.mutedForeground,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    justifyContent: 'flex-end',
  },
});
