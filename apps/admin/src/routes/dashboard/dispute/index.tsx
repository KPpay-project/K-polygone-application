import { createFileRoute } from '@tanstack/react-router';
import DisputePage from '@/pages/dashboard/dispute.tsx';

export const Route = createFileRoute('/dashboard/dispute/')({
  component: RouteComponent
});

function RouteComponent() {
  return <DisputePage />;
}
