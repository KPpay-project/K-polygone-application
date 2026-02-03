import DashboardLayout from '@/components/layouts/dashboard-layout';
import { TransferMoney } from '@/components/modules/transfer/transfer-money';

export default function TransferBulkPage() {
  return (
    <DashboardLayout>
      <TransferMoney mode="bulk" />
    </DashboardLayout>
  );
}
