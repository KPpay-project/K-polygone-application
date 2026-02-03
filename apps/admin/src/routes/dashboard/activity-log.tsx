import { createFileRoute } from '@tanstack/react-router';
import ActivityLogPage from '@/pages/dashboard/activity-log';

export const Route = createFileRoute('/dashboard/activity-log')({
  component: RouteComponent
});

function RouteComponent() {
  return <ActivityLogPage />;
}
