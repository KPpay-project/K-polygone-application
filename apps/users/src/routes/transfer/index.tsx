import TransferPage from '@/pages/dashboard/transfer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/transfer/')({
  component: RouteComponent
});

function RouteComponent() {
  return <TransferPage />;
}
