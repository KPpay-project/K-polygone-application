import { useTranslation } from 'react-i18next';
import HeaderTitle from '@/components/misc/header-title';
import { ModularCard } from '@/components/sub-modules/card/card';
import { StatCard } from '@/components/modules/stat-card';
import { useStatsData } from '@/hooks/use-stats-data';
import { useAdminTransactionStats } from '@/hooks/api/use-admin-dashboard-stats';
import AllTransferTransactionsTable from '@/components/common/transaction-table/transfer-tractions';

const TransferTransactions = () => {
  const { t } = useTranslation();

  const { summary, loading } = useAdminTransactionStats();
  const numberFmt = (n: number) => n.toLocaleString();
  const stats = useStatsData('transfer', {
    total: numberFmt(summary.total),
    successful: numberFmt(summary.successful),
    failed: numberFmt(summary.failed),
    pending: numberFmt(summary.pending)
  });

  return (
    <div className="space-y-4 p-8">
      <HeaderTitle
        title={t('common.transfer')}
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

      <AllTransferTransactionsTable />
    </div>
  );
};

export default TransferTransactions;
