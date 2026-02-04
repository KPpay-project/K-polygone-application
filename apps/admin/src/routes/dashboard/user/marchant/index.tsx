import MarchantListPage from '@/pages/dashboard/marchant-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/user/marchant/')({
  component: RouteComponent
});

function RouteComponent() {
  return <MarchantListPage />;
}
