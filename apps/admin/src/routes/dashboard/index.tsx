import DashboardLayout from '@/components/layouts/dashboard-layout';
import DashboardHome from '@/pages/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
