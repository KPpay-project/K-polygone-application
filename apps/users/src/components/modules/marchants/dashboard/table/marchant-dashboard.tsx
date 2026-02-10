import BalancePreviewPannel from '../balance-preview-panel';
import MarchantStatAndCardPanel from '../stat-and-card-panel';

const MerchantDashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <BalancePreviewPannel />
      <MarchantStatAndCardPanel />
      {/* <DashboardMarchantTransactionsTable /> */}
    </div>
  );
};

export default MerchantDashboard;
