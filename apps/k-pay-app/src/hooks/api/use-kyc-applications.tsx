import { useQuery } from '@apollo/client';
import { GET_ALL_KYC_APPLICATIONS } from '@/lib/graphql/queries/kyc';
import { KycApplicationsQueryResult } from '@/types/graphql';

export const useKycApplications = () => {
  return useQuery<KycApplicationsQueryResult>(GET_ALL_KYC_APPLICATIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
};
