import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ME } from '../lib/graphql/queries/user';
import { JWT_TOKEN_NAME } from '../lib/apollo-client';
import { useAuth } from '../contexts/auth-context';
import { MeResponse } from '../types/auth';

export const useInitializeUser = () => {
  // We'll need to extend the auth context to handle GraphQL user data
  const { logout } = useAuth();
  const [getMe, { loading, error, data }] = useLazyQuery<{ me: MeResponse }>(
    ME,
    {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = await AsyncStorage.getItem(JWT_TOKEN_NAME);
        if (token) {
          getMe();
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        logout();
      }
    };

    initializeUser();
  }, [getMe, logout]);

  useEffect(() => {
    if (data?.me) {
      //
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching user data:', error);
      if (error.graphQLErrors?.some((e) => e.message === 'Not authenticated')) {
        logout();
      }
    }
  }, [error, logout]);

  return {
    loading,
    error,
    refetch: getMe,
  };
};
