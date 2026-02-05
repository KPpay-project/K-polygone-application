import { useQuery } from '@apollo/client';
import { GET_ALL_KYC_APPLICATIONS } from '@repo/api';
import { KycApplicationsQueryResult } from '@repo/types';

export const useKycApplications = () => {
  return useQuery<KycApplicationsQueryResult>(GET_ALL_KYC_APPLICATIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only'
  });
};
