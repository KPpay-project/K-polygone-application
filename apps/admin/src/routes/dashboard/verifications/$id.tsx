import { createFileRoute } from '@tanstack/react-router';
import KycDetailsPage from '@/pages/dashboard/kyc-details-page';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export const Route = createFileRoute('/dashboard/verifications/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.id
    };
  }
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <DashboardLayout>
      <KycDetailsPage id={id} />
    </DashboardLayout>
  );
}
