import TicketPage from '@/pages/dashboard/ticket';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ ticket/')({
  component: RouteComponent
});

function RouteComponent() {
  return <TicketPage />;
}
