import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client/link/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN } from './graphql/mutations/auth';

export const JWT_TOKEN_NAME = 'access_token';
export const JWT_REFRESH_TOKEN_NAME = 'refresh_token';
const API_URL = 'https://move-bars-wispy-fog-4442.fly.dev/api/move-bars';
const TOKEN_REFRESH_BUFFER = 180_000;
const MAX_REFRESH_ATTEMPTS = 3;

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface RefreshTokenResponse {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
}

const httpLink = createHttpLink({
  uri: API_URL,
});

const refreshClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

let globalLogoutCallback: (() => void) | null = null;
export const setLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

let isRefreshing = false;
let refreshAttempts = 0;

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return null;
  }

  isRefreshing = true;
  refreshAttempts += 1;

  try {
    const refreshToken = await AsyncStorage.getItem(JWT_REFRESH_TOKEN_NAME);
    if (!refreshToken) {
      console.warn('No refresh token available');
      triggerLogout();
      return null;
    }

    const { data } = await refreshClient.mutate<RefreshTokenResponse>({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken },
    });

    if (data?.refreshToken?.accessToken) {
      await AsyncStorage.multiSet([
        [JWT_TOKEN_NAME, data.refreshToken.accessToken],
        [JWT_REFRESH_TOKEN_NAME, data.refreshToken.refreshToken],
      ]);
      refreshAttempts = 0;
      return data.refreshToken.accessToken;
    }

    console.warn('Invalid refresh token response');
    triggerLogout();
    return null;
  } catch (err) {
    console.error('Token refresh failed:', err);
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.warn('Max refresh attempts reached');
      triggerLogout();
      return null;
    }
    return null;
  } finally {
    isRefreshing = false;
  }
};

const triggerLogout = () => {
  if (globalLogoutCallback) {
    globalLogoutCallback();
  }
};

export const scheduleTokenRefresh = async () => {
  const token = await AsyncStorage.getItem(JWT_TOKEN_NAME);
  if (!token) {
    console.warn('No access token available for scheduling refresh');
    return;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const expTime = decoded.exp * 1000;
    const now = Date.now();
    const refreshTime = expTime - now - TOKEN_REFRESH_BUFFER;

    if (refreshTime <= 0) {
      console.warn('Token already expired or close to expiry');
      await refreshAccessToken();
      return;
    }

    setTimeout(async () => {
      await refreshAccessToken();
      scheduleTokenRefresh();
    }, refreshTime);
  } catch (err) {
    console.error('Error scheduling token refresh:', err);
  }
};

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(JWT_TOKEN_NAME);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.some((e) => e.message === 'Not authenticated')) {
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.warn('Max refresh attempts reached in error link');
      triggerLogout();
      return;
    }

    return fromPromise(
      refreshAccessToken().then((newToken) => {
        if (newToken) {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));
          scheduleTokenRefresh();
          return true;
        }

        console.warn('Token refresh failed in error link');
        triggerLogout();
        throw new Error('Token refresh failed');
      })
    ).flatMap(() => forward(operation));
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  },
});

export const setTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.multiSet([
      [JWT_TOKEN_NAME, accessToken],
      [JWT_REFRESH_TOKEN_NAME, refreshToken],
    ]);
    scheduleTokenRefresh();
  } catch (err) {
    console.error('Failed to set tokens:', err);
    throw err;
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME]);
  } catch (err) {
    console.error('Failed to clear tokens:', err);
    throw err;
  }
};

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(JWT_TOKEN_NAME);
  } catch (err) {
    console.error('Failed to get access token:', err);
    return null;
  }
};
