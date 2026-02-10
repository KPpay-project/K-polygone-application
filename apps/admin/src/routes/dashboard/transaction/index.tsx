import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import AllTransactions from '@/pages/dashboard/transaction/all-transactions';

export const Route = createFileRoute('/dashboard/transaction/')({ component: RouteComponent });

function RouteComponent() {
  return (
    <DashboardLayout>
      <AllTransactions />
    </DashboardLayout>
  );
}
