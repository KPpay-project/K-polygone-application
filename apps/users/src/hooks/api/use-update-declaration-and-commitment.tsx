import { useMutation } from '@apollo/client';
import { UPDATE_DECLARATION_AND_COMMITMENT } from '../../lib/graphql/mutations/update-kyc';
import { UpdateDeclarationAndCommitmentResult, UpdateDeclarationAndCommitmentVariables } from '@repo/types';

export const useUpdateDeclarationAndCommitment = () => {
  const [updateDeclarationAndCommitment, { loading, error, data }] = useMutation<
    UpdateDeclarationAndCommitmentResult,
    UpdateDeclarationAndCommitmentVariables
  >(UPDATE_DECLARATION_AND_COMMITMENT);

  return {
    updateDeclarationAndCommitment,
    loading,
    error,
    data
  };
};
