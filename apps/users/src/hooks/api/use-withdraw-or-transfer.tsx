import { MutationHookOptions, useMutation } from '@apollo/client';
import { WITHDRAW_OR_TRANSFER } from '@repo/api';
import { WithdrawOrTransferResult, WithdrawOrTransferVariables } from '@repo/types';

export const useWithdrawOrTransfer = (
  options?: MutationHookOptions<WithdrawOrTransferResult, WithdrawOrTransferVariables>
) => {
  const [withdrawOrTransfer, { loading, error, data }] = useMutation<
    WithdrawOrTransferResult,
    WithdrawOrTransferVariables
  >(WITHDRAW_OR_TRANSFER, options);

  return {
    withdrawOrTransfer,
    loading,
    error,
    data
  };
};
