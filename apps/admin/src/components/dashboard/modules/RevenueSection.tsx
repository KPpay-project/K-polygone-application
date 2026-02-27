'use client';
import { ModularCard } from '@/components/sub-modules/card/card';
import { EmptyState } from '@ui/index';

export const description = 'A multiple line chart';

export default function RevenueSection() {
  return (
    <ModularCard title="Revenue">
      <EmptyState title="No Revenue Yet" />
    </ModularCard>
  );
}
