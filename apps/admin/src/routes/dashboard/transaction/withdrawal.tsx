import { createFileRoute } from '@tanstack/react-router';
import WithdrawalTransactions from '@/pages/dashboard/transaction/withdrawal';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/withdrawal')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <WithdrawalTransactions />
    </DashboardLayout>
  );
}
