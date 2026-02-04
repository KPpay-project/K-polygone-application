import { createFileRoute } from '@tanstack/react-router';
import ExchangeTransactions from '@/pages/dashboard/transaction/exchange';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/exchange')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <ExchangeTransactions />
    </DashboardLayout>
  );
}
