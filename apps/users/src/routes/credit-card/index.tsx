import DashboardLayout from '@/components/layouts/dashboard-layout';
import CreditCardPage from '@/pages/dashboard/card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/credit-card/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CreditCardPage />
    </DashboardLayout>
  );
}
