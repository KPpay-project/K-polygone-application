import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useUserStore } from '@/store/user-store';
import { useProfileStore } from '@/store/profile-store';
import { useWalletStore } from '@/store/wallet-store';
import { ME } from '@repo/api';
import { handleGraphQLError } from '@/utils/error-handling';
import Cookies from 'js-cookie';
import { JWT_TOKEN_NAME } from '@/constant';

export const useInitializeUser = () => {
  const { setUserAccount, clearUserAccount, userAccount } = useUserStore();
  const { setWallet, clearWallet } = useWalletStore();
  const { setProfile, clearProfile } = useProfileStore();
  const [getMe, { loading, error }] = useLazyQuery(ME);

  const initializeUser = async () => {
    const token = Cookies.get(JWT_TOKEN_NAME);

    if (!token) {
      clearUserAccount();
      clearWallet();
      clearProfile();
      return;
    }

    if (userAccount) {
      return;
    }

    try {
      const response = await getMe();

      if (response.data?.me) {
        setUserAccount(response.data.me);
        setProfile(response.data.me);
        if (response.data.me.wallets && response.data.me.wallets.length > 0) {
          setWallet(response.data.me.wallets[0]);
        } else {
          clearWallet();
        }
      } else if (response.errors) {
        clearUserAccount();
        clearWallet();
        clearProfile();
        Cookies.remove(JWT_TOKEN_NAME);
        handleGraphQLError(response, 'Failed to authenticate user');
      }
    } catch (err) {
      clearUserAccount();
      clearWallet();
      clearProfile();
      Cookies.remove(JWT_TOKEN_NAME);
      console.error('Failed to initialize user:', err);
    }
  };

  const refetchUser = async () => {
    try {
      const response = await getMe({ fetchPolicy: 'network-only' });

      if (response.data?.me) {
        setUserAccount(response.data.me);

        setProfile(response.data.me);
        if (response.data.me.wallets && response.data.me.wallets.length > 0) {
          setWallet(response.data.me.wallets[0]);
        } else {
          clearWallet();
        }
      }
    } catch (err) {
      handleGraphQLError(err, 'Failed to refresh user data');
    }
  };

  return {
    initializeUser,
    refetchUser,
    loading,
    error
  };
};

export const useAutoInitializeUser = () => {
  const { initializeUser, loading } = useInitializeUser();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return { loading };
};
