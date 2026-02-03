import { useMutation } from '@apollo/client';
import { CREATE_FINANCIAL_INFO } from '@/lib/graphql/mutations/kyc/';
import {
  CreateFinancialInfoResult,
  CreateFinancialInfoVariables,
} from '../../types/graphql.js';

export const useCreateFinancialInfo = () => {
  const [createFinancialInfo, { loading, error, data }] = useMutation<
    CreateFinancialInfoResult,
    CreateFinancialInfoVariables
  >(CREATE_FINANCIAL_INFO);

  return {
    createFinancialInfo,
    loading,
    error,
    data,
  };
};
