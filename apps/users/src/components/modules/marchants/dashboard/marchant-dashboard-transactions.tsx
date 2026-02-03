import React from 'react';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ModularCard } from '@/components/sub-modules/card/card';
import HeaderWithSearch from '../../header/header-with-search';

interface TransactionRow {
  category: string;
  transactionId: string;
  customer: string;
  amount: string;
  method: string;
  status: 'Active' | 'Pending' | 'Failed';
  date: string;
}

const dummyData: TransactionRow[] = [
  {
    category: 'Withdrawal',
    transactionId: 'f4184fc596403b9',
    customer: 'Faith Jones',
    amount: '$40,000',
    method: 'Card',
    status: 'Active',
    date: '12/10/2024, 12:45'
  },
  {
    category: 'Withdrawal',
    transactionId: 'f4184fc596403b9',
    customer: 'Faith Jones',
    amount: '$40,000',
    method: 'Card',
    status: 'Active',
    date: '12/10/2024, 12:45'
  },
  {
    category: 'Withdrawal',
    transactionId: 'f4184fc596403b9',
    customer: 'Faith Jones',
    amount: '$40,000',
    method: 'Card',
    status: 'Active',
    date: '12/10/2024, 12:45'
  },
  {
    category: 'Withdrawal',
    transactionId: 'f4184fc596403b9',
    customer: 'Faith Jones',
    amount: '$40,000',
    method: 'Card',
    status: 'Active',
    date: '12/10/2024, 12:45'
  },
  {
    category: 'Withdrawal',
    transactionId: 'f4184fc596403b9',
    customer: 'Faith Jones',
    amount: '$40,000',
    method: 'Card',
    status: 'Active',
    date: '12/10/2024, 12:45'
  }
];

const columns: TableColumn<TransactionRow>[] = [
  { key: 'category', label: 'Payment Category', accessor: 'category', width: 'col-span-2' },
  { key: 'tx', label: 'Transaction ID', accessor: 'transactionId', width: 'col-span-2' },
  { key: 'customer', label: 'Customer Name/Source', accessor: 'customer', width: 'col-span-2' },
  { key: 'amount', label: 'Amount', accessor: 'amount', width: 'col-span-2' },
  { key: 'method', label: 'Payment Method', accessor: 'method', width: 'col-span-2' },
  {
    key: 'status',
    label: 'Status',
    accessor: (row: TransactionRow) => (
      <div
        className={
          row.status === 'Active'
            ? 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700'
            : row.status === 'Pending'
              ? 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700'
              : 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-700'
        }
      >
        {row.status}
      </div>
    ),
    width: 'col-span-1'
  },
  { key: 'date', label: 'Date', accessor: 'date', width: 'col-span-2' }
];

const renderMobileCard = (row: TransactionRow) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{row.customer.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{row.customer}</div>
          <div className="text-xs text-gray-500">{row.transactionId}</div>
        </div>
      </div>
      <div className="text-sm font-semibold">{row.amount}</div>
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="text-xs text-gray-500">{row.method}</div>
      <div>
        {row.status === 'Active' ? (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
            Active
          </div>
        ) : row.status === 'Pending' ? (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">
            Pending
          </div>
        ) : (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-50 text-red-700">Failed</div>
        )}
      </div>
    </div>
  </div>
);

const DashboardMarchantTransactionsTable: React.FC = () => {
  return (
    <div className="mt-[4rem]">
      <HeaderWithSearch />
      <ModularCard className="">
        <ResponsiveTable columns={columns} data={dummyData} loading renderMobileCard={renderMobileCard} />
      </ModularCard>
    </div>
  );
};

export default DashboardMarchantTransactionsTable;
