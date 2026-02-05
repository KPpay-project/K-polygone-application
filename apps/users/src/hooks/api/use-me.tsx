import { useQuery } from '@apollo/client';
import { ME } from '@repo/api';
import { UserAccountType } from '@repo/types';

interface MeQueryResult {
  me: UserAccountType & {
    kycApplications?: Array<{
      id: string;
      bankInfoStatus?: string;
      contactInfoStatus?: string;
      errors?: string[] | null;
      financialInfoStatus?: string;
      identityStatus?: string;
      insertedAt: string;
      kycClientId?: string;
      kycClientType?: string;
      message?: string | null;
      personalInfoStatus?: string;
      rejectionReason?: string | null;
      status: string;
      updatedAt: string;
    }>;
    walletCode?: string;
    wallets?: Array<{
      id: string;
      ownerId: string;
      ownerType: string;
      status: string;
      isFrozen: boolean;
      freezeReason?: string;
      dailyLimit?: string;
      monthlyLimit?: string;
      insertedAt: string;
      updatedAt: string;
      balances: Array<{
        id: string;
        availableBalance: string;
        totalBalance: string;
        currency: {
          code: string;
          countryCode: string;
          precision: number;
        };
      }>;
    }>;
  };
}

export const useMe = () => {
  return useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};
