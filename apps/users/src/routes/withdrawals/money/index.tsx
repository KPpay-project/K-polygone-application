import DashboardLayout from '@/components/layouts/dashboard-layout';
import WithdrawalsMoney from '@/pages/dashboard/withdrawals/money';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/withdrawals/money/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <WithdrawalsMoney />
    </DashboardLayout>
  );
}
