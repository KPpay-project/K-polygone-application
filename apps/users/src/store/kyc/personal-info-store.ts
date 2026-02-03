import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KycPersonalInfoState {
  firstName: string;
  lastName: string;
  maidenName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  countryOrTaxResidence: string;
  taxIdentificationNumber: string;
  occupation: string;
  currentEmployer: string;
  employmentStatus: string;
  setField: <K extends keyof Omit<KycPersonalInfoState, 'setField' | 'setAll' | 'update' | 'reset'>>(
    key: K,
    value: KycPersonalInfoState[K]
  ) => void;
  update: (data: Partial<Omit<KycPersonalInfoState, 'setField' | 'setAll' | 'update' | 'reset'>>) => void;
  setAll: (data: Omit<KycPersonalInfoState, 'setField' | 'setAll' | 'update' | 'reset'>) => void;
  reset: () => void;
}

const initialState: Omit<KycPersonalInfoState, 'setField' | 'setAll' | 'update' | 'reset'> = {
  firstName: '',
  lastName: '',
  maidenName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: '',
  countryOrTaxResidence: '',
  taxIdentificationNumber: '',
  occupation: '',
  currentEmployer: '',
  employmentStatus: 'Employed'
};

export const useKycPersonalInfoStore = create<KycPersonalInfoState>()(
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
      name: 'kyc-personal-info-store',
      partialize: (state) => ({
        firstName: state.firstName,
        lastName: state.lastName,
        maidenName: state.maidenName,
        dateOfBirth: state.dateOfBirth,
        placeOfBirth: state.placeOfBirth,
        nationality: state.nationality,
        countryOrTaxResidence: state.countryOrTaxResidence,
        taxIdentificationNumber: state.taxIdentificationNumber,
        occupation: state.occupation,
        currentEmployer: state.currentEmployer,
        employmentStatus: state.employmentStatus
      })
    }
  )
);
