import StatusBadge from '@/components/ui/status-badge';
import { ResponsiveTable } from '../responsive-table';
import { useAllDepositsTransactionHistory } from '@/hooks/use-all-deposits-transaction-history';
import moment from 'moment';
import { formatCurrency } from '@/utils/current';

const columns = [
  { key: 'amount', label: 'Amount', accessor: (row) => ` ${formatCurrency(row.amount, row.currency?.code) || ''}` },
  { key: 'currency', label: 'Currency', accessor: (row) => row.currency?.code || '-' },
  { key: 'customerPhone', label: 'Customer Phone', accessor: (row) => row.customerPhone || '-' },
  { key: 'status', label: 'Status', accessor: (row) => <StatusBadge status={row.status} text={row.status} /> },
  { key: 'provider', label: 'Provider', accessor: (row) => row.provider || '-' },
  { key: 'insertedAt', label: 'Date', accessor: (row) => moment(row.insertedAt).format('Do MMM YYYY') }
];

const AllDepositTransactionsTable = (props) => {
  const { data, loading } = useAllDepositsTransactionHistory(props?.variables || {});
  const tableData =
    data?.allDepositsTransactionHistory?.entries?.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      customerPhone: tx.customerPhone,
      status: tx.status,
      provider: tx.provider,
      insertedAt: tx.insertedAt,
      currency: tx.currency,
      description: tx.description,
      reference: tx.reference,
      transactionType: tx.transactionType,
      updatedAt: tx.updatedAt,
      counterpartyWallet: tx.counterpartyWallet,
      feeAmount: tx.feeAmount,
      externalReference: tx.externalReference,
      exchangeRate: tx.exchangeRate,
      providerMessage: tx.providerMessage,
      providerStatus: tx.providerStatus
    })) || [];
  const pageInfo = data?.allDepositsTransactionHistory;

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

export default AllDepositTransactionsTable;
