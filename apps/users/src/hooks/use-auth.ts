//@ts-nocheck
import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { USER_ROLE } from '@/constant';
import { scheduleTokenRefresh } from '@/lib/apollo-client';
import { clearAuthTokens, getAccessToken, setAccessToken, setRefreshToken } from '@/utils/token-storage';
import { useUserStore, type UserAccount } from '@/store/user-store';

const ACCESS_TOKEN_EXP_MINUTES = 15;
const REFRESH_TOKEN_EXP_DAYS = 1;

export function useAuth() {
  const navigate = useNavigate();
  const { setUserAccount, clearUserAccount } = useUserStore();

  const setAuthTokens = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const logUser = (userAccount: UserAccount) => {
    Cookies.set(USER_ROLE, userAccount.role, {
      secure: true,
      sameSite: 'strict',
      expires: REFRESH_TOKEN_EXP_DAYS,
      path: '/'
    });

    scheduleTokenRefresh(ACCESS_TOKEN_EXP_MINUTES);

    const transformedUserAccount: UserAccount = {
      ...userAccount,
      user: userAccount.user ?? null,
      merchant: userAccount.merchant ?? null,
      admin: userAccount.admin ?? null
    };

    setUserAccount(transformedUserAccount);
  };

  const invalidate = () => {
    clearAuthTokens();

    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName);
    });

    clearUserAccount();
    navigate({ to: '/onboarding/login', replace: true });
  };

  const checkSession = () => {
    const token = getAccessToken();

    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        invalidate();
        return false;
      }

      return true;
    } catch {
      invalidate();
      return false;
    }
  };

  return {
    setAuthTokens,
    logUser,
    invalidate,
    checkSession
  };
}
