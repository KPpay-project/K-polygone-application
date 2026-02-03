import { useTranslation } from 'react-i18next';
import HeaderTitle from '@/components/misc/header-title';
import { ModularCard } from '@/components/sub-modules/card/card';
import { StatCard } from '@/components/modules/stat-card';
import { useStatsData } from '@/hooks/use-stats-data';
import { Money, MoneyAdd, MoneyRemove, MoneyTime } from '@/components/modules/custom-icons/deposit-icons';
import { useAdminTransactionStats } from '@/hooks/api/use-admin-dashboard-stats';
import AllDepositTransactionsTable from '@/components/common/transaction-table/deposit-transactions';

const DepositTransactions = () => {
  const { t } = useTranslation();

  const { depositSummary, loading } = useAdminTransactionStats();
  const numberFmt = (n: number) => n.toLocaleString();

  const stats = useStatsData(
    'deposit',
    {
      total: numberFmt(depositSummary.total),
      successful: numberFmt(depositSummary.successful),
      failed: numberFmt(depositSummary.failed),
      pending: numberFmt(depositSummary.pending)
    },
    {
      total: <Money className="h-5 w-5 text-white" />,
      successful: <MoneyAdd className="h-5 w-5 text-white" />,
      failed: <MoneyRemove className="h-5 w-5 text-white" />,
      pending: <MoneyTime className="h-5 w-5 text-white" />
    }
  );

  return (
    <div className="space-y-4 p-8">
      <HeaderTitle
        title={t('common.deposit')}
        searchPlaceholder={t('common.searchPlaceholder')}
        onSearch={(value) => console.log('Search:', value)}
        onFilter={() => console.log('Filter clicked')}
        showSearch
        showFilter
      />

      <ModularCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={loading ? '—' : stat.value}
              icon={stat.icon}
              colorScheme={stat.colorScheme}
            />
          ))}
        </div>
      </ModularCard>
      <AllDepositTransactionsTable />
    </div>
  );
};

export default DepositTransactions;
