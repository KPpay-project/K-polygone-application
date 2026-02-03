import { createFileRoute } from '@tanstack/react-router';
import WalletPage from '@/pages/dashboard/wallet.tsx';
import DashboardLayout from '@/components/layouts/dashboard-layout.tsx';

export const Route = createFileRoute('/wallet/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <WalletPage />
    </DashboardLayout>
  );
}
