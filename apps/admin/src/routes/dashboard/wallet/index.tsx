import DashboardLayout from '@/components/layouts/dashboard-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/wallet/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Wallet</h1>
      </div>
    </DashboardLayout>
  );
}
