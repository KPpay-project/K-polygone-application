import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Merchant {
  businessName: string;
  businessType: string;
}

export interface Admin {
  id: string;
  name: string;
}

export interface UserAccount {
  id: string;
  role: string;
  status: string | null;
  user?: User | null;
  merchant?: Merchant | null;
  admin?: Admin | null;
}

interface UserStore {
  userAccount: UserAccount | null;
  isAuthenticated: boolean;
  setUserAccount: (userAccount: UserAccount) => void;
  clearUserAccount: () => void;
  updateUserAccount: (updates: Partial<UserAccount>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userAccount: null,
      isAuthenticated: false,

      setUserAccount: (userAccount: UserAccount) => {
        set({
          userAccount,
          isAuthenticated: true,
        });
      },

      clearUserAccount: () => {
        set({
          userAccount: null,
          isAuthenticated: false,
        });
      },

      updateUserAccount: (updates: Partial<UserAccount>) => {
        const current = get().userAccount;
        if (current) {
          set({
            userAccount: { ...current, ...updates },
          });
        }
      },
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: 'user-store',
      partialize: (state) => ({
        userAccount: state.userAccount,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useFullUserDetails = () =>
  useUserStore((state) => state.userAccount);
export const useUserId = () => useUserStore((state) => state.userAccount?.id);
export const useUser = () => useUserStore((state) => state.userAccount?.user);
export const useMerchant = () =>
  useUserStore((state) => state.userAccount?.merchant);
export const useAdmin = () => useUserStore((state) => state.userAccount?.admin);
export const useUserRole = () =>
  useUserStore((state) => state.userAccount?.role);
export const useUserStatus = () =>
  useUserStore((state) => state.userAccount?.status);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated);
