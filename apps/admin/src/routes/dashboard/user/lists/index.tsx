import UsersListPage from '@/pages/dashboard/users-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/user/lists/')({
  component: RouteComponent
});

function RouteComponent() {
  return <UsersListPage />;
}
