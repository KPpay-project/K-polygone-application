import { useMutation } from '@apollo/client';
import { UPDATE_PERSONAL_INFO } from '@repo/api';
import { UpdatePersonalInfoResult, UpdatePersonalInfoVariables } from '@repo/types';

export const useUpdatePersonalInfo = () => {
  const [updatePersonalInfo, { loading, error, data }] = useMutation<
    UpdatePersonalInfoResult,
    UpdatePersonalInfoVariables
  >(UPDATE_PERSONAL_INFO);

  return {
    updatePersonalInfo,
    loading,
    error,
    data
  };
};
