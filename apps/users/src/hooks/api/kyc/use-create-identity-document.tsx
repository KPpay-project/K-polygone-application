import { useMutation } from '@apollo/client';
import { CREATE_IDENTITY_DOCUMENT } from '@/lib/graphql';
import { CreateIdentityDocumentResult, CreateIdentityDocumentVariables } from '@repo/types';
export const useCreateIdentityDocument = () => {
  const [createIdentityDocument, { loading, error, data }] = useMutation<
    CreateIdentityDocumentResult,
    CreateIdentityDocumentVariables
  >(CREATE_IDENTITY_DOCUMENT, {
    context: {
      hasUpload: true
    }
  });

  return {
    createIdentityDocument,
    loading,
    error,
    data
  };
};
