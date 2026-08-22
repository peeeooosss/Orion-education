import { create } from "zustand";

interface EnquiryModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useEnquiryStore = create<EnquiryModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
