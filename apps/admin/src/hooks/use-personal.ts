import { useUserStore } from '@/store/user-store';

const useAbstractedUser = () => {
  const { userAccount } = useUserStore();

  return {
    userData: userAccount
  };
};

export { useAbstractedUser };
