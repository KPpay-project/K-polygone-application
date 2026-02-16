import Cookies from 'js-cookie';
import { JWT_REFRESH_TOKEN_NAME, JWT_TOKEN_NAME } from '@/constant';

const isBrowser = () => typeof window !== 'undefined';

const persistToken = (key: string, value: string) => {
  if (!isBrowser()) return;
  sessionStorage.setItem(key, value);
  Cookies.remove(key);
};

const migrateTokenFromCookie = (key: string) => {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) return null;

  if (isBrowser()) {
    sessionStorage.setItem(key, cookieValue);
  }

  Cookies.remove(key);
  return cookieValue;
};

const readToken = (key: string) => {
  if (!isBrowser()) return null;
  const token = sessionStorage.getItem(key);
  if (token) return token;
  return migrateTokenFromCookie(key);
};

const removeToken = (key: string) => {
  if (isBrowser()) {
    sessionStorage.removeItem(key);
  }
  Cookies.remove(key);
};

export const setAccessToken = (token: string) => persistToken(JWT_TOKEN_NAME, token);
export const setRefreshToken = (token: string) => persistToken(JWT_REFRESH_TOKEN_NAME, token);
export const getAccessToken = () => readToken(JWT_TOKEN_NAME);
export const getRefreshToken = () => readToken(JWT_REFRESH_TOKEN_NAME);
export const clearAuthTokens = () => {
  removeToken(JWT_TOKEN_NAME);
  removeToken(JWT_REFRESH_TOKEN_NAME);
};
