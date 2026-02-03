import AdminListPage from '@/pages/dashboard/admin-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/user/admin/')({
  component: RouteComponent
});

function RouteComponent() {
  return <AdminListPage />;
}
