import { useMutation } from '@apollo/client';
import { CREATE_CONTACT_DETAIL } from '@repo/api';
import { CreateContactDetailResult, CreateContactDetailVariables } from '@repo/types';

export const useCreateContactDetail = () => {
  const [createContactDetail, { loading, error, data }] = useMutation<
    CreateContactDetailResult,
    CreateContactDetailVariables
  >(CREATE_CONTACT_DETAIL);

  return {
    createContactDetail,
    loading,
    error,
    data
  };
};
