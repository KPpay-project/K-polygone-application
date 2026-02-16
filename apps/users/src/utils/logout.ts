import Cookies from 'js-cookie';
import { useUserStore } from '@/store/user-store';
import { USER_ROLE } from '@/constant';
import { useNavigate } from '@tanstack/react-router';
import { clearAuthTokens } from '@/utils/token-storage';

export const useLogout = () => {
  const { clearUserAccount } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    clearAuthTokens();
    Cookies.remove(USER_ROLE);

    clearUserAccount();
    localStorage.clear();
    navigate({ to: '/onboarding/get-started' });
  };

  return { logout };
};

export const logoutUser = () => {
  clearAuthTokens();

  useUserStore.getState().clearUserAccount();
  localStorage.clear();
  window.location.href = '/onboarding/get-started';
};
