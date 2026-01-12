import { create } from "zustand";

type DraftState = {
  id: string;
  name: string;
  legalName: string;
  businessNumber: string;
  payrollAccountNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  mediaToken?: string; // Cloudinary public_id temporal
  setField: <K extends keyof DraftState>(k: K, v: DraftState[K]) => void;
  clearMedia: () => void;
};

export const useCompanyDraft = create<DraftState>((set) => ({
  id: "",
  name: "",
  legalName: "",
  businessNumber: "",
  payrollAccountNumber: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
  email: "",
  mediaToken: undefined,
  setField: (k, v) => set(() => ({ [k]: v } as any)),
  clearMedia: () => set({ mediaToken: undefined }),
}));
