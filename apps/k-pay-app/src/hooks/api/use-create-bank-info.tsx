import { useMutation } from '@apollo/client';
import { CREATE_BANK_INFO } from '@/lib/graphql/mutations';
import { CreateBankInfoResult, CreateBankInfoVariables } from '@/types/graphql';

export const useCreateBankInfo = () => {
  return useMutation<CreateBankInfoResult, CreateBankInfoVariables>(
    CREATE_BANK_INFO,
    {
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Create Bank Info error:', error);
      },
    }
  );
};
