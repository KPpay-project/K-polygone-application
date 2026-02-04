import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KycContactInfoState {
  country: string;
  street: string;
  city: string;
  postalCode: string;
  mailingAddress1: string;
  mailingAddress2: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  setField: <K extends keyof Omit<KycContactInfoState, 'setField' | 'setAll' | 'update' | 'reset'>>(
    key: K,
    value: KycContactInfoState[K]
  ) => void;
  update: (data: Partial<Omit<KycContactInfoState, 'setField' | 'setAll' | 'update' | 'reset'>>) => void;
  setAll: (data: Omit<KycContactInfoState, 'setField' | 'setAll' | 'update' | 'reset'>) => void;
  reset: () => void;
}

const initialState: Omit<KycContactInfoState, 'setField' | 'setAll' | 'update' | 'reset'> = {
  country: 'nigeria',
  street: '',
  city: '',
  postalCode: '',
  mailingAddress1: '',
  mailingAddress2: '',
  primaryPhone: '',
  secondaryPhone: '',
  email: ''
};

export const useKycContactInfoStore = create<KycContactInfoState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setField: (key, value) => {
        set({ [key]: value } as any);
      },
      update: (data) => {
        set({ ...get(), ...data });
      },
      setAll: (data) => {
        set({ ...data });
      },
      reset: () => {
        set({ ...initialState });
      }
    }),
    {
      name: 'kyc-contact-info-store',
      partialize: (state) => ({
        country: state.country,
        street: state.street,
        city: state.city,
        postalCode: state.postalCode,
        mailingAddress1: state.mailingAddress1,
        mailingAddress2: state.mailingAddress2,
        primaryPhone: state.primaryPhone,
        secondaryPhone: state.secondaryPhone,
        email: state.email
      })
    }
  )
);
