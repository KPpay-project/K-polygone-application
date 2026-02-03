import { useCreatePersonalInfo } from './use-create-personal-info';

export const useKyc = () => {
  const {
    createPersonalInfo,
    loading: createPersonalInfoLoading,
    error: createPersonalInfoError,
    data: createPersonalInfoData
  } = useCreatePersonalInfo();

  return {
    createPersonalInfo,
    createPersonalInfoLoading,
    createPersonalInfoError,
    createPersonalInfoData
  };
};
