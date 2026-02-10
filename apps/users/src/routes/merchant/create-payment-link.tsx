import MerchantDashboardLayout from '@/components/layouts/dashboard/merchant-dashboard-layout';
import CreatePaymentLinkRoutePage from '@/pages/merchants/create-payment-link';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/merchant/create-payment-link')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <MerchantDashboardLayout>
      <CreatePaymentLinkRoutePage />
    </MerchantDashboardLayout>
  );
}
