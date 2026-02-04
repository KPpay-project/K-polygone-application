import { useMutation } from '@apollo/client';
import { CREATE_PERSONAL_INFO } from '../../lib/graphql/mutations/CREATE_PERSONAL_INFO.ts';
import { CreatePersonalInfoResult, CreatePersonalInfoVariables } from '@repo/types';

export const useCreatePersonalInfo = () => {
  const [createPersonalInfo, { loading, error, data }] = useMutation<
    CreatePersonalInfoResult,
    CreatePersonalInfoVariables
  >(CREATE_PERSONAL_INFO);

  return {
    createPersonalInfo,
    loading,
    error,
    data
  };
};
