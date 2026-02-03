import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      }
    }),
    {
      name: 'currency-store',
      version: 1
    }
  )
);
