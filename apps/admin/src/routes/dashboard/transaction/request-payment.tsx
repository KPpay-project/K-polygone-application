import { createFileRoute } from '@tanstack/react-router';
import RequestPaymentTransactions from '@/pages/dashboard/transaction/request-payment';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/transaction/request-payment')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <RequestPaymentTransactions />
    </DashboardLayout>
  );
}
