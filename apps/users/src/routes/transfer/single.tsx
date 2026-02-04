import { createFileRoute } from '@tanstack/react-router';
import TransferPage from '@/pages/dashboard/transfer';

export const Route = createFileRoute('/transfer/single')({
  component: () => <TransferPage />
});
