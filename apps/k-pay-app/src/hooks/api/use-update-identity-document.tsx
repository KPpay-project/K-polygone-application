import { useMutation } from '@apollo/client';
import { UPDATE_IDENTITY_DOCUMENT } from '../../lib/graphql/mutations/update-kyc';
import {
  UpdateIdentityDocumentResult,
  UpdateIdentityDocumentVariables,
} from '../../types/graphql';

export const useUpdateIdentityDocument = () => {
  const [updateIdentityDocument, { loading, error, data }] = useMutation<
    UpdateIdentityDocumentResult,
    UpdateIdentityDocumentVariables
  >(UPDATE_IDENTITY_DOCUMENT);

  return {
    updateIdentityDocument,
    loading,
    error,
    data,
  };
};
