import { useMutation } from '@apollo/client';
import { CREATE_POLITICAL_EXPOSURE } from '../../../lib/graphql/mutations/CREATE_PERSONAL_INFO.ts';
import { CreatePoliticalExposureResult, CreatePoliticalExposureVariables } from '../../../types/graphql.ts';

export const useCreatePoliticalExposure = () => {
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
