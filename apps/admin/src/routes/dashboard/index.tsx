import DashboardLayout from '@/components/layouts/dashboard-layout';
import DashboardHome from '@/pages/dashboard';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const dashboardSearchSchema = z.object({
  filter: z.string().optional().catch('')
});

export const Route = createFileRoute('/dashboard/')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: RouteComponent
});

function RouteComponent() {
  const { filter } = Route.useSearch();
  return (
    <DashboardLayout>
      <DashboardHome filter={filter} />
    </DashboardLayout>
  );
}
