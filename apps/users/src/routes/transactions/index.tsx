import TransactionTable from '@/components/common/transaction-table/transaction-table';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/transactions/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <TransactionTable />
    </DashboardLayout>
  );
}
