import { useMutation } from '@apollo/client';
import { CREATE_FINANCIAL_INFO } from '../../lib/graphql/mutations/CREATE_PERSONAL_INFO.ts';
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
