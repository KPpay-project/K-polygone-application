import { useMutation } from '@apollo/client';
import { CREATE_IDENTITY_DOCUMENT } from '@/lib/graphql/mutations/kyc';
import {
  CreateIdentityDocumentResult,
  CreateIdentityDocumentVariables,
} from '../../types/graphql.js';

export const useCreateIdentityDocument = () => {
  const [createIdentityDocument, { loading, error, data }] = useMutation<
    CreateIdentityDocumentResult,
    CreateIdentityDocumentVariables
  >(CREATE_IDENTITY_DOCUMENT);

  return {
    createIdentityDocument,
    loading,
    error,
    data,
  };
};
