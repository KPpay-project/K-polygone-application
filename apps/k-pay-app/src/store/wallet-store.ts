import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Wallet {
  id: string;
  ownerId: string;
  ownerType: string;
  status: string;
  dailyLimit: string;
  monthlyLimit: string;
  isFrozen: boolean;
  freezeReason: string | null;
  insertedAt: string;
  updatedAt: string;
  balances: any[];
}

interface WalletStore {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  clearWallet: () => void;
  updateWallet: (updates: Partial<Wallet>) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      wallet: null,
      setWallet: (wallet: Wallet) => {
        set({ wallet });
      },
      clearWallet: () => {
        set({ wallet: null });
      },
      updateWallet: (updates: Partial<Wallet>) => {
        const current = get().wallet;
        if (current) {
          set({ wallet: { ...current, ...updates } });
        }
      },
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({ wallet: state.wallet }),
    }
  )
);

export const useWallet = () => useWalletStore((state) => state.wallet);
