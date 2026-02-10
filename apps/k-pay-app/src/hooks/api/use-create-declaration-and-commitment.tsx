import { useMutation } from '@apollo/client';
import { CREATE_DECLARATION_AND_COMMITMENT } from '@/lib/graphql/mutations/kyc';
import {
  CreateDeclarationAndCommitmentResult,
  CreateDeclarationAndCommitmentVariables,
} from '../../types/graphql.js';

export const useCreateDeclarationAndCommitment = () => {
  const [createDeclarationAndCommitment, { loading, error, data }] =
    useMutation<
      CreateDeclarationAndCommitmentResult,
      CreateDeclarationAndCommitmentVariables
    >(CREATE_DECLARATION_AND_COMMITMENT);

  return {
    createDeclarationAndCommitment,
    loading,
    error,
    data,
  };
};
