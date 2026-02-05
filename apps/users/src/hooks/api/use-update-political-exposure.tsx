import { useMutation } from '@apollo/client';
import { CREATE_POLITICAL_EXPOSURE } from '@repo/api';
import { CreatePoliticalExposureResult, CreatePoliticalExposureVariables } from '@repo/types';

export const useUpdatePoliticalExposure = () => {
  const [createPoliticalExposure, { loading, error, data }] = useMutation<
    CreatePoliticalExposureResult,
    CreatePoliticalExposureVariables
  >(CREATE_POLITICAL_EXPOSURE);

  return {
    createPoliticalExposure,
    loading,
    error,
    data
  };
};
