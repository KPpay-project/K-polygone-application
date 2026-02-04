import NotFoundComponent from '@/pages/not-found';
import GetStarted from '@/pages/onboarding/get-started';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { USER_ROLE, UserRoleEnum } from '@/constant';
import Cookies from 'js-cookie';

export const Route = createFileRoute('/')({
  component: Index,
  notFoundComponent: NotFoundComponent(),
  beforeLoad: () => {
    const userRole = Cookies.get(USER_ROLE);

    if (
      userRole?.trim().toLowerCase() === UserRoleEnum.User ||
      userRole?.trim().toLowerCase() === UserRoleEnum.Client
    ) {
      throw redirect({
        to: '/dashboard'
      });
    } else if (userRole?.trim().toLowerCase() === UserRoleEnum.Merchant) {
      throw redirect({
        to: '/merchant'
      });
    }
  }
});

function Index() {
  return <GetStarted />;
}
