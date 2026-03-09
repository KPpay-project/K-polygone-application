import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface CurrencyStore {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  getSelectedCurrency: () => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'USD',

      setSelectedCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
      },

      getSelectedCurrency: () => {
        return get().selectedCurrency;
      },
    }),
    {
      name: 'currency-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
