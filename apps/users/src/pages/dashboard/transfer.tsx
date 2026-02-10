import DashboardLayout from '@/components/layouts/dashboard-layout';
import { TransferMoney } from '@/components/modules/transfer';

function Transfer() {
  return (
    <DashboardLayout>
      <TransferMoney />
    </DashboardLayout>
  );
}

export default Transfer;
