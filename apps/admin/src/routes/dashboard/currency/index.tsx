import { createFileRoute } from '@tanstack/react-router';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import CurrencyPage from '@/pages/dashboard/currency';

export const Route = createFileRoute('/dashboard/currency/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CurrencyPage />
    </DashboardLayout>
  );
}
