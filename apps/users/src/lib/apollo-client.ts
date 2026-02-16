import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createLink } from 'apollo-absinthe-upload-link';
import { fromPromise } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { BASE_ENDPOINT_URL } from '@/constant';
import { REFRESH_TOKEN } from '@repo/api';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/token-storage';

const GRAPHQL_ENDPOINT = BASE_ENDPOINT_URL;
const uploadLink = createLink({ uri: GRAPHQL_ENDPOINT });

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const refreshClient = new ApolloClient({
  link: createLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache()
});

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await refreshClient.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken }
    });

    if (data?.refreshToken?.accessToken) {
      setAccessToken(data.refreshToken.accessToken);
      setRefreshToken(data.refreshToken.refreshToken);
      return data.refreshToken.accessToken;
    }

    return null;
  } catch (err) {
    console.error('Token refresh failed:', err);
    return null;
  }
};

export const scheduleTokenRefresh = () => {
  const token = getAccessToken();
  if (!token) return;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const expTime = decoded.exp * 1000;
    const now = Date.now();

    const refreshTime = expTime - now - 180_000;

    if (refreshTime > 0) {
      setTimeout(async () => {
        await refreshAccessToken();
        scheduleTokenRefresh();
      }, refreshTime);
    }
  } catch (err) {
    console.error('Error scheduling token refresh:', err);
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    if (graphQLErrors.some((e) => e.message === 'Not authenticated')) {
      return fromPromise(
        refreshAccessToken().then((newToken) => {
          if (newToken) {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${newToken}`
              }
            }));
            scheduleTokenRefresh();
            return true;
          }
          throw new Error('Token refresh failed');
        })
      ).flatMap(() => forward(operation));
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(uploadLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' }
  }
});
