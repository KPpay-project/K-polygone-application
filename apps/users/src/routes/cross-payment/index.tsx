import CrossPaymentPage from '@/pages/dashboard/cross-payment';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cross-payment/')({
  component: RouteComponent
});

function RouteComponent() {
  return <CrossPaymentPage />;
}
