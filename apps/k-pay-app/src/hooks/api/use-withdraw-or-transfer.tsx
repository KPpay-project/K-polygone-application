import { useMutation } from '@apollo/client';
import { WITHDRAW_OR_TRANSFER } from '@/lib/graphql/mutations/withdraw';
import {
  WithdrawOrTransferResult,
  WithdrawOrTransferVariables,
} from '@/types/graphql';

export const useWithdrawOrTransfer = () => {
  const [withdrawOrTransfer, { loading, error, data }] = useMutation<
    WithdrawOrTransferResult,
    WithdrawOrTransferVariables
  >(WITHDRAW_OR_TRANSFER);
  return {
    withdrawOrTransfer,
    loading,
    error,
    data,
  };
};
