import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';
import { UploadSignaturePayload } from '@ascencio/shared';
import { api } from '@/core/api/api';

import { Button, ButtonIcon } from './Button';
import { ThemedText } from './ThemedText';
import { theme } from './theme';
import { SinglePhotoViewer } from '@/core/components/SinglePhotoViewer';
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

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

type ImageSource = 'camera' | 'gallery';

const isUrl = (value?: string) => !!value && value.startsWith('http');

const resolveCloudinaryUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  if (isUrl(value)) return value;
  if (!CLOUDINARY_CLOUD_NAME) return undefined;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${value}`;
};

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
 * Ref handle for ImageUploader to mark image as saved
 */
export interface ImageUploaderRef {
  /**
   * Call this after the form is successfully saved to prevent
   * the cleanup effect from deleting the promoted image.
   */
  markAsSaved: () => void;
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
export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  (
    {
      value,
      onChange,
      folder = 'temp_files',
      label,
      allowCamera = true,
      allowGallery = true,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [localImageUrl, setLocalImageUrl] = useState<string | undefined>(
      resolveCloudinaryUrl(value),
    );

    // Track the temp image publicId to delete on unmount if not saved
    const tempImageRef = useRef<string | undefined>(undefined);
    // Track if the image has been saved (promoted on backend)
    const savedRef = useRef<boolean>(false);

    // Expose markAsSaved method via ref
    useImperativeHandle(ref, () => ({
      markAsSaved: () => {
        savedRef.current = true;
      },
    }));

    // Sync local state with value prop
    useEffect(() => {
      setLocalImageUrl(resolveCloudinaryUrl(value));
      if (value && !isUrl(value)) {
        tempImageRef.current = value;
      }
    }, [value]);

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
    const deleteImageFromCloudinary = async (
      imageRef: string,
    ): Promise<void> => {
      const publicId = isUrl(imageRef) ? extractPublicId(imageRef) : imageRef;
      if (!publicId) {
        throw new Error('Invalid image reference');
      }

      try {
        await api.delete(`/files/${encodeURIComponent(publicId)}`);
      } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    };

    /**
     * Upload image to Cloudinary
     */
    const requestSignature = async (): Promise<UploadSignaturePayload> => {
      const { data } = await api.post<UploadSignaturePayload>(
        '/files/signature',
        {
          folder,
        },
      );
      return data;
    };

    const uploadImage = async (
      uri: string,
    ): Promise<{ secureUrl: string; publicId: string }> => {
      const signed = await requestSignature();
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1] || 'jpg';

      formData.append('file', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as unknown as Blob);

      formData.append('api_key', signed.apiKey);
      formData.append('timestamp', String(signed.timestamp));
      formData.append('signature', signed.signature);
      formData.append('public_id', signed.publicId);
      formData.append('folder', signed.folder);

      const response = await fetch(signed.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error?.message || 'Cloudinary upload failed');
      }

      return {
        secureUrl: json.secure_url as string,
        publicId: json.public_id as string,
      };
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
            // aspect: [1, 1],
            quality: 0.8,
          });
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            // aspect: [1, 1],
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
        const { secureUrl, publicId } = await uploadImage(selectedUri);

        // Track this as temp image (store publicId for cleanup)
        tempImageRef.current = publicId;

        // Update form value with publicId (mediaToken)
        onChange(publicId);
        setLocalImageUrl(secureUrl);
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
      if (!value && !tempImageRef.current) return;
      const imageToDelete = tempImageRef.current || value;
      if (!imageToDelete) return;

      try {
        setLocalImageUrl(undefined);
        onChange(undefined);
        tempImageRef.current = undefined;
        await deleteImageFromCloudinary(imageToDelete);
        toast.success(t('imageDeletedSuccessfully'));
      } catch (error) {
        console.error('Error deleting image:', error);
        setLocalImageUrl(resolveCloudinaryUrl(value));
        onChange(value);
        toast.error(t('imageDeleteFailed'));
      }
    };

    /**
     * Cleanup temp image on unmount if not saved
     * Only deletes if the image hasn't been promoted/saved on backend
     */
    useEffect(() => {
      return () => {
        const currentTemp = tempImageRef.current;
        // Only cleanup if:
        // 1. There's a temp image
        // 2. It hasn't been saved (promoted on backend)
        // 3. It's still in temp_files folder
        if (
          currentTemp &&
          !savedRef.current &&
          currentTemp.startsWith('temp_files/')
        ) {
          deleteImageFromCloudinary(currentTemp).catch((error) => {
            console.error('Error cleaning up temp image on unmount:', error);
          });
        }
      };
    }, []);

    return (
      <View style={styles.container}>
        {label && <ThemedText style={styles.label}>{label}</ThemedText>}

        <View style={styles.imageContainer}>
          {localImageUrl && !imageLoadError ? (
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                onPress={() => setIsViewerVisible(true)}
                style={{ flex: 1 }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: localImageUrl }}
                  style={styles.image}
                  onError={() => setImageLoadError(true)}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <SinglePhotoViewer
                imageUrl={localImageUrl}
                isVisible={isViewerVisible}
                onClose={() => setIsViewerVisible(false)}
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
  },
);

// Display name for debugging
ImageUploader.displayName = 'ImageUploader';

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
