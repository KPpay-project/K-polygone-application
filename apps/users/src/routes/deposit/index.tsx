import DashboardLayout from '@/components/layouts/dashboard-layout';
import DepositScreen from '@/pages/dashboard/deposit/index';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/deposit/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <DepositScreen />
    </DashboardLayout>
  );
}
