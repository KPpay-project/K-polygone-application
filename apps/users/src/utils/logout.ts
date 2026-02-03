import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user-store';
import { JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME } from '@/constant';
import { useNavigate } from '@tanstack/react-router';

export const useLogout = () => {
  const { clearUserAccount } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove(JWT_TOKEN_NAME);
    Cookies.remove(JWT_REFRESH_TOKEN_NAME);

    clearUserAccount();
    localStorage.clear();
    navigate({ to: '/onboarding/get-started' });
  };

  return { logout };
};

export const logoutUser = () => {
  Cookies.remove(JWT_TOKEN_NAME);
  Cookies.remove(JWT_REFRESH_TOKEN_NAME);

  useUserStore.getState().clearUserAccount();
  localStorage.clear();
  window.location.href = '/onboarding/get-started';
};
