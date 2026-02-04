import { useMutation } from '@apollo/client';
import { UPDATE_BANK_INFO } from '../../lib/graphql/mutations/update-kyc';
import { UpdateBankInfoResult, UpdateBankInfoVariables } from '@repo/types';

export const useUpdateBankInfo = () => {
  const [updateBankInfo, { loading, error, data }] = useMutation<UpdateBankInfoResult, UpdateBankInfoVariables>(
    UPDATE_BANK_INFO
  );

  return {
    updateBankInfo,
    loading,
    error,
    data
  };
};
