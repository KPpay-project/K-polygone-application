import DashboardLayout from '@/components/layouts/dashboard-layout';
import Exchange from '@/pages/dashboard/exchange';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/exchange/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <Exchange />
    </DashboardLayout>
  );
}
