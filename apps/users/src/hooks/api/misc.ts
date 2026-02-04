import { USER_ROLE } from '@/constant';
import Cookies from 'js-cookie';

type AccountRole = 'user' | 'merchant' | null;
export const getRoleFromCookie = (): AccountRole => {
  const raw = Cookies.get(USER_ROLE) || '';
  const role = raw.toLowerCase();
  if (role.includes('merchant')) return 'merchant';
  if (role.includes('user')) return 'user';
  return null;
};

const useCheckRole = (): AccountRole => {
  return getRoleFromCookie();
};

export { useCheckRole };
