import { createFileRoute } from '@tanstack/react-router';
import TransferTransactions from '@/pages/dashboard/transaction/transfer';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/transfer')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <TransferTransactions />
    </DashboardLayout>
  );
}
