import CreatePaymentLink from '@/components/actions/merchants/create-payment-link';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-payment-link/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CreatePaymentLink />
    </DashboardLayout>
  );
}
