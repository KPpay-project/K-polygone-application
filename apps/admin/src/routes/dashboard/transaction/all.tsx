import { createFileRoute } from '@tanstack/react-router';
import AllTransactions from '@/pages/dashboard/transaction/all-transactions';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/all')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <AllTransactions />
    </DashboardLayout>
  );
}
