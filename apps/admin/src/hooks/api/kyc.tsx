import { useQuery } from '@apollo/client';
import { GET_ALL_KYC_APPLICATIONS, GET_KYC_BY_ID } from '@/lib/graphql/queries/kyc';

const useGetAllKyc = () => {
  return useQuery(GET_ALL_KYC_APPLICATIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

const useGetMyKyc = () => {
  return useQuery(GET_KYC_BY_ID, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export { useGetAllKyc, useGetMyKyc };
