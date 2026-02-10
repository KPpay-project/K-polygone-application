import { useMutation } from '@apollo/client';
import {
  CreatePersonalInfoResult,
  CreatePersonalInfoVariables,
} from '../../types/graphql.js';
import { CREATE_PERSONAL_INFO } from '@/lib/graphql/mutations/kyc';

export const useCreatePersonalInfo = () => {
  const [createPersonalInfo, { loading, error, data }] = useMutation<
    CreatePersonalInfoResult,
    CreatePersonalInfoVariables
  >(CREATE_PERSONAL_INFO);

  return {
    createPersonalInfo,
    loading,
    error,
    data,
  };
};
