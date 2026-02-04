import { useQuery } from '@apollo/client';
import { useState, useCallback } from 'react';
import { ME } from '../../lib/graphql/operations';
import type { UserAccountType } from '../../types/graphql';

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

export const useMe = (options?: {
  pollInterval?: number;
  enablePolling?: boolean;
}) => {
  const { pollInterval = 30000, enablePolling = true } = options || {};

  return useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    pollInterval: enablePolling ? pollInterval : 0,
    notifyOnNetworkStatusChange: true,
  });
};

export const useMeWithRefresh = () => {
  const [refreshing, setRefreshing] = useState(false);

  const queryResult = useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryResult.refetch();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [queryResult]);

  return {
    ...queryResult,
    refreshing,
    onRefresh,
  };
};
