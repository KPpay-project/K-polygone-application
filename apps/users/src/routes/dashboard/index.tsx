import DashboardHome from '@/pages/dashboard';
import { createFileRoute } from '@tanstack/react-router';
import { UserRoleEnum } from '@/constant';
import { ensureUserRole } from '@/utils/route-guards';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: () => {
    ensureUserRole([UserRoleEnum.User, UserRoleEnum.Client]);
  }
});

function RouteComponent() {
  return <DashboardHome />;
}
