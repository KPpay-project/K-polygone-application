import { useQuery } from '@apollo/client';
import { GET_KYC_APPLICATION_BY_ID } from '@repo/api';
import { KycApplicationByIdQueryResult, KycApplicationByIdVariables } from '@repo/types';

export const useKycApplicationById = (kycApplicationId: string) => {
  return useQuery<KycApplicationByIdQueryResult, KycApplicationByIdVariables>(GET_KYC_APPLICATION_BY_ID, {
    variables: { kycApplicationId },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    skip: !kycApplicationId
  });
};
