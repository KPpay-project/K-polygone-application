import { useAllTransfersTransactionHistory } from '@/hooks/use-transactions';
import { ResponsiveTable } from '../responsive-table';
import StatusBadge from '@/components/ui/status-badge';
import { formatCurrency } from '@/utils/current';
import moment from 'moment';

const columns = [
  { key: 'amount', label: 'Amount', accessor: (row) => `${formatCurrency(row.amount, row.currency?.code) || ''}` },
  { key: 'customerPhone', label: 'Customer Phone', accessor: (row) => row.customerPhone || '-' },
  { key: 'status', label: 'Status', accessor: (row) => <StatusBadge status={row.status} text={row.status} /> },
  { key: 'provider', label: 'Provider', accessor: (row) => row.provider || '-' },
  { key: 'insertedAt', label: 'Date', accessor: (row) => moment(row.insertedAt).format('Do MMM YYYY') }
];

const AllWithdrawalTransactions = (props) => {
  const { data, loading } = useAllTransfersTransactionHistory(props?.variables || {});
  const tableData = data?.allTransfersTransactionHistory?.entries || [];
  const pageInfo = data?.allTransfersTransactionHistory;

  return (
    <ResponsiveTable
      data={tableData}
      columns={columns}
      loading={loading}
      page={pageInfo?.pageNumber}
      perPage={pageInfo?.pageSize}
      totalEntries={pageInfo?.totalEntries}
      totalPages={pageInfo?.totalPages}
    />
  );
};

export default AllWithdrawalTransactions;
