import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { createLink as createAbsintheUploadLink } from 'apollo-absinthe-upload-link';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import { fromPromise } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME, REMEMBER_ME_COOKIE } from '@/constant';
import { REFRESH_TOKEN } from './graphql';
import { logoutUser } from '@/utils';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://move-bars.fly.dev/api/move-bars';

const absintheUploadLink = createAbsintheUploadLink({ uri: GRAPHQL_ENDPOINT });

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get(JWT_TOKEN_NAME);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const refreshClient = new ApolloClient({
  link: createHttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache()
});

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get(JWT_REFRESH_TOKEN_NAME);
  if (!refreshToken) return logoutUser();

  try {
    const { data } = await refreshClient.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken }
    });

    if (data?.refreshToken?.accessToken) {
      const remember = Cookies.get(REMEMBER_ME_COOKIE) === '1';
      if (remember) {
        Cookies.set(JWT_TOKEN_NAME, data.refreshToken.accessToken, { expires: 30 });
        Cookies.set(JWT_REFRESH_TOKEN_NAME, data.refreshToken.refreshToken, { expires: 30 });
      } else {
        Cookies.set(JWT_TOKEN_NAME, data.refreshToken.accessToken);
        Cookies.set(JWT_REFRESH_TOKEN_NAME, data.refreshToken.refreshToken);
      }
      return data.refreshToken.accessToken;
    }

    logoutUser();
    return null;
  } catch (err) {
    console.error('Token refresh failed:', err);
    return logoutUser();
  }
};

export const scheduleTokenRefresh = () => {
  const token = Cookies.get(JWT_TOKEN_NAME);
  if (!token) return;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const expTime = decoded.exp * 1000;
    const now = Date.now();

    const refreshTime = expTime - now - 180_000;

    if (refreshTime > 0) {
      setTimeout(async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) return;
        scheduleTokenRefresh();
      }, refreshTime);
    } else {
      logoutUser();
    }
  } catch (err) {
    console.error('Error scheduling token refresh:', err);
  }
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (
    graphQLErrors?.some(
      (e) => e.message === 'Not authenticated' || e.message === 'Requires admin or super-admin or manager role'
    )
  ) {
    return fromPromise(
      refreshAccessToken()
        .then((newToken) => {
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

          return false;
        })
        .catch(() => {
          logoutUser();
          return false;
        })
    ).flatMap((shouldForward) => (shouldForward ? forward(operation) : (undefined as any)));
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(absintheUploadLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' }
  }
});
