import DashboardLayout from '@/components/layouts/dashboard-layout';
import MerchantDashboard from '@/components/modules/marchants/dashboard/table/marchant-dashboard';
import { createFileRoute } from '@tanstack/react-router';
import { UserRoleEnum } from '@/constant';
import { ensureUserRole } from '@/utils/route-guards';

export const Route = createFileRoute('/merchant/')({
  component: RouteComponent,
  beforeLoad: () => {
    ensureUserRole(UserRoleEnum.Merchant);
  }
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <MerchantDashboard />
    </DashboardLayout>
  );
}
