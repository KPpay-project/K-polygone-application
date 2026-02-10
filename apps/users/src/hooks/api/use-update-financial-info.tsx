import { useMutation } from '@apollo/client';
import { UPDATE_FINANCIAL_INFO } from '@repo/api';
import { UpdateFinancialInfoResult, UpdateFinancialInfoVariables } from '@repo/types';

export const useUpdateFinancialInfo = () => {
  const [updateFinancialInfo, { loading, error, data }] = useMutation<
    UpdateFinancialInfoResult,
    UpdateFinancialInfoVariables
  >(UPDATE_FINANCIAL_INFO);

  return {
    updateFinancialInfo,
    loading,
    error,
    data
  };
};
