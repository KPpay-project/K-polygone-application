import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  __typename?: string;
  admin?: any;
  currentSignInAt?: string;
  currentSignInIp?: string;
  id: string;
  insertedAt?: string;
  lastSignInAt?: string;
  lastSignInIp?: string | null;
  merchant?: any;
  role?: string;
  signInCount?: number;
  signInIp?: string | null;
  status?: string | null;
  updatedAt?: string;
  user: {
    __typename?: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
  wallets: Array<{
    __typename?: string;
    balances: Array<{
      __typename?: string;
      availableBalance: string;
      currency: {
        __typename?: string;
        code: string;
        countryCode: string;
        precision: number;
      };
      id: string;
      totalBalance: string;
    }>;
    dailyLimit?: string;
    freezeReason?: string | null;
    id: string;
    insertedAt?: string;
    isFrozen?: boolean;
    monthlyLimit?: string;
    ownerId?: string;
    ownerType?: string;
    status?: string;
    updatedAt?: string;
    walletCode?: string;
    [key: string]: any;
  }>;
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile: Profile) => {
        set({ profile });
      },
      clearProfile: () => {
        set({ profile: null });
      },
      updateProfile: (updates: Partial<Profile>) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, ...updates } });
        }
      },
      fetchProfile: async () => {
        try {
          const { ME } = await import('@/lib/graphql/operations');
          const { apolloClient } = await import('@/lib/apollo-client');
          const response = await apolloClient.query({ query: ME, fetchPolicy: 'network-only' });
          if (response.data?.me) {
            set({ profile: response.data.me });
          }
        } catch {
          //..
        }
      }
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({ profile: state.profile })
    }
  )
);

export const useProfile = () => useProfileStore((state) => state.profile);
