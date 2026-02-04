import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user-store';
import { JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME, REMEMBER_ME_COOKIE } from '@/constant';
import { useNavigate } from '@tanstack/react-router';

export const useLogout = () => {
  const { clearUserAccount } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove(JWT_TOKEN_NAME);
    Cookies.remove(JWT_REFRESH_TOKEN_NAME);
    Cookies.remove(REMEMBER_ME_COOKIE);

    clearUserAccount();
    localStorage.clear();
    navigate({ to: '/auth/login' });
  };

  return { logout };
};

export const logoutUser = () => {
  Cookies.remove(JWT_TOKEN_NAME);
  Cookies.remove(JWT_REFRESH_TOKEN_NAME);
  Cookies.remove(REMEMBER_ME_COOKIE);

  useUserStore.getState().clearUserAccount();
  localStorage.clear();
  window.location.href = '/auth/login';
};
