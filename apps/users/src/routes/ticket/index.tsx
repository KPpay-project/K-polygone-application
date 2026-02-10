import { createFileRoute } from '@tanstack/react-router';
import TicketPage from '@/pages/dashboard/ticket.tsx';

export const Route = createFileRoute('/ticket/')({
  component: RouteComponent
});

function RouteComponent() {
  return <TicketPage />;
}
