import DashboardLayout from '@/components/layouts/dashboard-layout';
import WithdrawalsBeneficiaries from '@/pages/dashboard/withdrawals/beneficiaries';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/withdrawals/beneficiaries/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <WithdrawalsBeneficiaries />
    </DashboardLayout>
  );
}
