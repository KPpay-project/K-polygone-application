import { createFileRoute } from '@tanstack/react-router';
import VerificationPage from '@/pages/dashboard/verifications-page';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/verifications/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <VerificationPage />
    </DashboardLayout>
  );
}
