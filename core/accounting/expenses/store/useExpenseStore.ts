import { create } from 'zustand';
import { removeReceiptImage } from '../actions/remove-receipt-image.action';

interface ExpenseState {
  merchant?: string;
  date?: string;
  total?: number;
  tax?: number;
  localImageUri?: string;
  imageUrl?: string;
  categoryId?: string;
  subcategoryId?: string;

  setDetails: (details: {
    merchant?: string;
    date?: string;
    total?: number;
    tax?: number;
    imageUrl?: string;
    categoryId?: string;
    subcategoryId?: string;
  }) => void;
  removeImage: () => void;
  reset: () => void;
}

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  merchant: undefined,
  date: undefined,
  total: undefined,
  tax: undefined,
  imageUrl: undefined,
  localImageUri: undefined,
  categoryId: undefined,
  subcategoryId: undefined,

  removeImage: async () => {
    const imageUrl = get().imageUrl;
    if (imageUrl) {
      await removeReceiptImage({ imageUrl });
    }
    set({
      imageUrl: undefined,
      localImageUri: undefined,
    });
  },

  setDetails: (details: {
    merchant?: string;
    date?: string;
    total?: number;
    tax?: number;
    imageUrl?: string;
  }) => {
    set({ ...details });
  },

  reset: () =>
    set({
      merchant: undefined,
      date: undefined,
      total: undefined,
      tax: undefined,
      imageUrl: undefined,
      localImageUri: undefined,
    }),
}));
