import DashboardLayout from '@/components/layouts/dashboard-layout';
import WithdrawalList from '@/pages/dashboard/withdrawals/list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/withdrawals/list/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <WithdrawalList />
    </DashboardLayout>
  );
}
