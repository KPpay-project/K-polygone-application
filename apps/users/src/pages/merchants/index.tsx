import MarchantDashboard from '@/components/modules/marchants/dashboard/table/marchant-dashboard.tsx';
import MerchantDashboardLayout from '@/components/layouts/dashboard/merchant-dashboard-layout.tsx';

const MerchantDashboard = () => {
  return (
    <>
      <MerchantDashboardLayout>
        <MarchantDashboard />
      </MerchantDashboardLayout>
    </>
  );
};

export default MerchantDashboard;
