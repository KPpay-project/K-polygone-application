import DashboardLayout from '@/components/layouts/dashboard-layout';
import { TransferMoney } from '@/components/modules/transfer/transfer-money';

export default function TransferMultiplePage() {
  return (
    <DashboardLayout>
      <TransferMoney mode="multiple" />
    </DashboardLayout>
  );
}
