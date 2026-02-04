import { create } from 'zustand';

interface TicketFormState {
  attachmentError: string | null;
  setAttachmentError: (msg: string | null) => void;
  reset: () => void;
}

export const useTicketFormStore = create<TicketFormState>((set) => ({
  attachmentError: null,
  setAttachmentError: (msg) => set({ attachmentError: msg }),
  reset: () => set({ attachmentError: null })
}));
