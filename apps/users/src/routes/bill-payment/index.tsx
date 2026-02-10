import { createFileRoute } from '@tanstack/react-router';
import BillPaymentPage from '@/pages/dashboard/bill-payment.tsx';
import DashboardLayout from '@/components/layouts/dashboard-layout.tsx';

export const Route = createFileRoute('/bill-payment/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <BillPaymentPage />
    </DashboardLayout>
  );
}
