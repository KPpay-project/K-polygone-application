import { useMutation } from '@apollo/client';
import { CREATE_DECLARATION_AND_COMMITMENT } from '@repo/api';
import { CreateDeclarationAndCommitmentResult, CreateDeclarationAndCommitmentVariables } from '@repo/types';

export const useCreateDeclarationAndCommitment = () => {
  const [createDeclarationAndCommitment, { loading, error, data }] = useMutation<
    CreateDeclarationAndCommitmentResult,
    CreateDeclarationAndCommitmentVariables
  >(CREATE_DECLARATION_AND_COMMITMENT);

  return {
    createDeclarationAndCommitment,
    loading,
    error,
    data
  };
};
