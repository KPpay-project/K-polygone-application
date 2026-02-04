import { useQuery } from '@apollo/client';
import { GET_KYC_STATUS } from '@/lib/graphql/queries/kyc';

interface KycStatusQueryResult {
  getKycStatus: {
    id: string;
    status: string;
    insertedAt: string;
    updatedAt: string;
  };
}

export const useKycStatus = () => {
  return useQuery<KycStatusQueryResult>(GET_KYC_STATUS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only'
  });
};
