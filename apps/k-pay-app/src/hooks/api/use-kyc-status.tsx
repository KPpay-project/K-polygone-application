import { useMemo } from 'react';
import { useMe } from './use-me';
import getSimpleKycStatus from '../../utils/kyc/simple';
import type { KycStatus, SimpleKycApplication } from '../../utils/kyc/simple';

export interface UseKycStatusReturn extends KycStatus {
  loading: boolean;
  error?: any;
  kycApplications?: SimpleKycApplication[];
}

/**
 * Hook to get KYC status information for the current user
 * @returns KycStatus object with loading and error states
 */
export const useKycStatus = (): UseKycStatusReturn => {
  const { data, loading, error } = useMe();

  const kycStatus = useMemo(() => {
    const kycApplications = data?.me?.kycApplications as
      | SimpleKycApplication[]
      | undefined;
    return getSimpleKycStatus(kycApplications);
  }, [data?.me?.kycApplications]);

  return {
    ...kycStatus,
    loading,
    error,
    kycApplications: data?.me?.kycApplications as
      | SimpleKycApplication[]
      | undefined,
  };
};

/**
 * Hook to check if KYC is required (not complete)
 * @returns boolean indicating if KYC completion is required
 */
export const useKycRequired = (): boolean => {
  const { isComplete } = useKycStatus();
  return !isComplete;
};
