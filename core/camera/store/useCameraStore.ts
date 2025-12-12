import { ImagePickerAsset } from 'expo-image-picker';
import { create } from 'zustand';

interface CameraState {
  selectedImage?: ImagePickerAsset;

  selectImage: (image: ImagePickerAsset) => void;
  removeImage: () => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  selectedImage: undefined,

  selectImage: (image: ImagePickerAsset) => {
    set({ selectedImage: image });
  },

  removeImage: () => set({ selectedImage: undefined }),
}));
