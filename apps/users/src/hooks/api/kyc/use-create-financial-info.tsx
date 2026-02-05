import { useMutation } from '@apollo/client';
import { CREATE_FINANCIAL_INFO } from '@repo/api';
import { CreateFinancialInfoResult, CreateFinancialInfoVariables } from '@repo/types';

export const useCreateFinancialInfo = () => {
  const [createFinancialInfo, { loading, error, data }] = useMutation<
    CreateFinancialInfoResult,
    CreateFinancialInfoVariables
  >(CREATE_FINANCIAL_INFO);

  return {
    createFinancialInfo,
    loading,
    error,
    data
  };
};
