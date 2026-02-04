import { createFileRoute } from '@tanstack/react-router';
import BillerList from '@/pages/dashboard/bills/biller-list';

export const Route = createFileRoute('/dashboard/bills/biller')({
  component: BillerList
});
