import { createFileRoute } from '@tanstack/react-router';
import TransferBulkPage from '@/pages/dashboard/transfer-bulk';

// Use trailing slash to match generated FileRoutesByPath keys
export const Route = createFileRoute('/transfer/bulk')({
  component: () => <TransferBulkPage />
});
