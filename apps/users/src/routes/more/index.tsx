import DashboardLayout from '@/components/layouts/dashboard-layout';
import MorePage from '@/pages/dashboard/more';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/more/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <MorePage />
    </DashboardLayout>
  );
}
