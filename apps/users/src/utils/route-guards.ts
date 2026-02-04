import { USER_ROLE, UserRoleEnum } from '@/constant';
import { redirect } from '@tanstack/react-router';
import Cookies from 'js-cookie';

export const ensureUserRole = (requiredRole: UserRoleEnum | UserRoleEnum[]) => {
  const userRole = Cookies.get(USER_ROLE)?.trim().toLowerCase();

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!userRole || !allowedRoles.includes(userRole as UserRoleEnum)) {
    throw redirect({
      to:
        userRole === UserRoleEnum.User || userRole === UserRoleEnum.Client
          ? '/dashboard'
          : userRole === UserRoleEnum.Merchant
            ? '/merchant'
            : '/'
    });
  }
};
