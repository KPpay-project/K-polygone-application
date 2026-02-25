import SummaryCards from '@/components/dashboard/modules/SummaryCards';
import TransactionsSection from '@/components/dashboard/modules/TransactionsSection';
import TopCountriesSection from '@/components/dashboard/modules/TopCountriesSection';
import WalletsSection from '@/components/dashboard/modules/WalletsSection';
import RevenueSection from '@/components/dashboard/modules/RevenueSection';
import TicketsSection from '@/components/dashboard/modules/TicketsSection';
import useDashboardStats from '@/hooks/api/use-dashboard-stats.tsx';
import { Typography } from '@ui/index';

function DashboardHome({ filter }: { filter?: string }) {
  const { data, loading } = useDashboardStats({ countryCode: filter });

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium w-full">
          <SummaryCards stats={data?.adminDashboardStats} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 mb-6">
        <div>
          <TransactionsSection />
        </div>

        <div>
          <TopCountriesSection />
        </div>
      </div>
      <div className="gap-6 mb-6">
        <WalletsSection />
      </div>
      <div className="flex gap-6 mb-6">
        <RevenueSection />
        <TicketsSection />
      </div>
    </div>
  );
}

export default DashboardHome;
