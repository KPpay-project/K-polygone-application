import { useMutation } from '@apollo/client';
import { CREATE_POLITICAL_EXPOSURE } from '../../lib/graphql/mutations/create-kyc';
import {
  CreatePoliticalExposureResult,
  CreatePoliticalExposureVariables,
} from '../../types/graphql';

export const useCreatePoliticalExposure = () => {
  const [createPoliticalExposure, { loading, error, data }] = useMutation<
    CreatePoliticalExposureResult,
    CreatePoliticalExposureVariables
  >(CREATE_POLITICAL_EXPOSURE);

  return {
    createPoliticalExposure,
    loading,
    error,
    data,
  };
};
