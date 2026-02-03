import { useAllTransfersTransactionHistory } from '@/hooks/use-transactions';
import { ResponsiveTable } from '../responsive-table';
import moment from 'moment';
import StatusBadge from '@/components/ui/status-badge';
import { formatCurrency } from '@/utils/current';

const columns = [
  //{ key: 'id', label: 'ID', accessor: (row) => row.id },
  { key: 'amount', label: 'Amount', accessor: (row) => `${formatCurrency(row.amount, row.currency?.code) || ''}` },
  { key: 'currency', label: 'Currency', accessor: (row) => row.currency?.code || '-' },
  { key: 'customerPhone', label: 'Customer Phone', accessor: (row) => row.customerPhone || '-' },
  { key: 'status', label: 'Status', accessor: (row) => <StatusBadge status={row.status} text={row.status} /> },
  { key: 'provider', label: 'Provider', accessor: (row) => row.provider || '-' },
  { key: 'insertedAt', label: 'Date', accessor: (row) => moment(row.insertedAt).format('Do MMM YYYY') }
];

const AllTransferTransactionsTable = (props) => {
  const { data, loading } = useAllTransfersTransactionHistory(props?.variables || {});
  const tableData =
    data?.allTransfersTransactionHistory?.entries?.map((tx) => ({
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
      wallet: tx.wallet,
      feeAmount: tx.feeAmount,
      feeCurrency: tx.feeCurrency,
      externalReference: tx.externalReference,
      exchangeRate: tx.exchangeRate,
      providerMessage: tx.providerMessage,
      providerStatus: tx.providerStatus
    })) || [];
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

export default AllTransferTransactionsTable;
