import { useMutation } from '@apollo/client';
import { UPDATE_FINANCIAL_INFO } from '../../lib/graphql/mutations/update-kyc';
import {
  UpdateFinancialInfoResult,
  UpdateFinancialInfoVariables,
} from '../../types/graphql';

export const useUpdateFinancialInfo = () => {
  const [updateFinancialInfo, { loading, error, data }] = useMutation<
    UpdateFinancialInfoResult,
    UpdateFinancialInfoVariables
  >(UPDATE_FINANCIAL_INFO);

  return {
    updateFinancialInfo,
    loading,
    error,
    data,
  };
};
