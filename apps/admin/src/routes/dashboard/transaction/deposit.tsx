import { createFileRoute } from '@tanstack/react-router';
import DepositTransactions from '@/pages/dashboard/transaction/deposit';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/deposit')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <DepositTransactions />
    </DashboardLayout>
  );
}
