import { createFileRoute } from '@tanstack/react-router';
import TransferMultiplePage from '@/pages/dashboard/transfer-multiple';

export const Route = createFileRoute('/transfer/multiple')({
  component: () => <TransferMultiplePage />
});
