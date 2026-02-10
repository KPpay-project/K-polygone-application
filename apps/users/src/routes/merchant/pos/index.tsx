import PosPage from '@/pages/merchants/pos';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/merchant/pos/')({
  component: RouteComponent
});

function RouteComponent() {
  return <PosPage />;
}
