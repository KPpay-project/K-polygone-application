import React, { useState, useEffect } from 'react';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import { FilterConfig } from '@/components/common/responsive-table/responsive-table';
import { cn } from '@/lib/utils';
import { WalletAdd } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { EmptyTicketState } from '@/components/common/fallbacks';
import { gql, useQuery } from '@apollo/client';
import { UserWalletTransaction as WalletTransaction } from '@repo/types';
import { getStatusColor } from '@/data/transactions';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ViewTransaction from '@/components/modules/transactions/view-transaction';
import { formatCurrency, formatCurrencyWithCode } from '@/utils/current';
import { ServerErrorFallbackScreen } from '@/components/common/fallbacks/server-error-fallback.tsx';

export type Transaction = WalletTransaction;

export const USER_WALLETS_TRANSACTION_HISTORY = gql`
  query GetUserWalletsTransactionHistory(
    $page: Int!
    $perPage: Int!
    $search: String
    $type: String
    $fromDate: String
    $toDate: String
    $sortBy: String
    $sortDirection: String
  ) {
    userWalletsTransactionHistory(
      page: $page
      perPage: $perPage
      search: $search
      type: $type
      fromDate: $fromDate
      toDate: $toDate
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      entries {
        id
        transactionType
        amount
        status
        reference
        externalReference
        description
        feeAmount
        exchangeRate
        provider
        providerStatus
        providerMessage
        customerPhone
        insertedAt
        updatedAt
        currency {
          id
          code
          name
          symbol
        }
        wallet {
          id
          ownerType
          ownerId
          status
        }
        counterpartyWallet {
          id
          ownerType
          ownerId
        }
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

interface TransactionTableProps {
  showTitle?: boolean;
  title?: string;
  itemsPerPage?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  showCheckbox?: boolean;
  onRowClick?: (row: Transaction) => void;
  className?: string;
  searchPlaceholder?: string;
  transactionType?: string;
}

export const TransactionTable = ({
  showTitle = true,
  title,
  itemsPerPage = 20,
  showFilters = false,
  showSearch = true,
  showPagination = true,
  showCheckbox = true,
  onRowClick,
  className = '',
  searchPlaceholder,
  transactionType
}: TransactionTableProps) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    type: transactionType || 'all',
    status: 'all',
    currency: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const formatDate = (d?: Date) => (d ? d.toISOString().slice(0, 10) : undefined);

  const { data, loading, error, refetch } = useQuery(USER_WALLETS_TRANSACTION_HISTORY, {
    variables: {
      page: currentPage,
      perPage: itemsPerPage,
      search: searchQuery || undefined,
      type: transactionType || (filterValues.type !== 'all' ? filterValues.type : undefined),
      fromDate: formatDate(dateRange.from),
      toDate: formatDate(dateRange.to)
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    refetch();
  }, [searchQuery, filterValues, dateRange, currentPage, refetch]);

  if (error) {
    return (
      <div className={cn('p-3 sm:p-6 pt-0 bg-white', className)}>
        <ServerErrorFallbackScreen
          onRetry={() => {
            setCurrentPage(1);
            refetch();
          }}
        />
      </div>
    );
  }

  const transactions = data?.userWalletsTransactionHistory?.entries || [];
  const pagination = {
    page: data?.userWalletsTransactionHistory?.pageNumber || 1,
    totalPages: data?.userWalletsTransactionHistory?.totalPages || 1,
    totalEntries: data?.userWalletsTransactionHistory?.totalEntries || 0
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterValues({ type: transactionType || 'all', status: 'all', currency: 'all' });
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filters: FilterConfig[] = [
    ...(transactionType
      ? []
      : [
          {
            key: 'type',
            label: t('dashboard.transactions.type'),
            options: [
              { value: 'withdrawal', label: t('dashboard.transactions.transactionTypes.withdrawal') },
              { value: 'deposit', label: t('dashboard.transactions.transactionTypes.deposit') },
              { value: 'transfer', label: t('dashboard.transactions.transactionTypes.transfer') }
            ]
          }
        ]),
    {
      key: 'status',
      label: t('dashboard.transactions.status'),
      options: [
        { value: 'approved', label: t('dashboard.transactions.statuses.approved') },
        { value: 'pending', label: t('dashboard.transactions.statuses.pending') },
        { value: 'failed', label: t('dashboard.transactions.statuses.failed') }
      ]
    },
    {
      key: 'currency',
      label: t('dashboard.transactions.currency'),
      options: [
        { value: 'fcfa', label: 'FCFA' },
        { value: 'usd', label: 'USD' },
        { value: 'eur', label: 'EUR' }
      ]
    }
  ];

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'category',
      label: t('dashboard.transactions.paymentCategory'),
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center">
            <WalletAdd size={15} className="text-purple-300" />
          </div>
          <span className="text-sm text-gray-900">
            {transactionType ? transactionType.charAt(0).toUpperCase() + transactionType.slice(1) : row.transactionType}
          </span>
        </div>
      ),
      width: 'col-span-2',
      sortable: true
    },
    {
      key: 'transactionId',
      label: t('dashboard.transactions.transactionId'),
      accessor: 'id',
      width: 'col-span-2',
      className: 'text-gray-600'
    },
    {
      key: 'amount',
      label: t('dashboard.transactions.amount'),
      accessor: (row) => formatCurrency(Number(row.amount), row.currency.code),
      width: 'col-span-2',
      className: 'font-medium text-gray-900'
    },
    {
      key: 'date',
      label: t('dashboard.transactions.date'),
      accessor: (row) => {
        const date = new Date(row.insertedAt);
        return (
          <div>
            <div className="text-sm text-gray-900">{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
          </div>
        );
      },
      width: 'col-span-2'
    },
    {
      key: 'status',
      label: t('common.status'),
      accessor: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap',
            getStatusColor(row.status)
          )}
        >
          {row.status}
        </span>
      ),
      width: 'col-span-1'
    }
  ];

  const renderMobileCard = (row: Transaction) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center">
            <WalletAdd size={15} className="text-purple-300" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.transactionType}</div>
            <div className="text-xs text-gray-500">{row.id}</div>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            getStatusColor(row.status)
          )}
        >
          {row.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{t('dashboard.transactions.amount')}</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrencyWithCode(Number(row.amount), row.currency.code)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{t('dashboard.transactions.date')}</span>
          <div className="text-right">
            <div className="text-sm text-gray-900">{new Date(row.insertedAt).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{new Date(row.insertedAt).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const displayTitle =
    title ||
    (transactionType === 'withdrawal'
      ? t('dashboard.transactions.withdrawalHistory', 'Withdrawal History')
      : t('dashboard.transactions.title'));

  return (
    <div className={cn('p-3 sm:p-6 pt-0 bg-white', className)}>
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{displayTitle}</h3>
        </div>
      )}

      <ResponsiveTable
        data={transactions}
        columns={columns}
        showCheckbox={showCheckbox}
        renderMobileCard={renderMobileCard}
        emptyMessage={
          <EmptyTicketState
            title={transactionType === 'withdrawal' ? 'No Withdrawals' : 'No Transaction'}
            description={
              transactionType === 'withdrawal'
                ? "You haven't made any withdrawals yet. Withdraw funds from your wallet to your bank account or mobile money."
                : "Looks like you haven't made any transactions yet. Start by sending money, paying bills, or topping up your wallet."
            }
          />
        }
        onRowClick={(row) => {
          if (onRowClick) onRowClick(row);
          setSelectedTransaction(row);
          setOpenSheet(true);
        }}
        className="mb-6"
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder || t('dashboard.transactions.searchPlaceholder')}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        showFilters={showFilters}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showDateRange
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeLabel={t('dashboard.transactions.dateRange', 'Date Range')}
        loading={loading}
      />

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('dashboard.transactions.details', 'Transaction Details')}</SheetTitle>
            <SheetDescription>
              {selectedTransaction ? t('dashboard.transactions.viewingId', { id: selectedTransaction.id }) : ''}
            </SheetDescription>
          </SheetHeader>
          {selectedTransaction && <ViewTransaction transaction={selectedTransaction} />}
        </SheetContent>
      </Sheet>

      {showPagination && pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('pagination.previous')}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {t('pagination.page', { current: pagination.page, total: pagination.totalPages })}
            </span>
            <span className="text-xs text-gray-500">({pagination.totalEntries} total results)</span>
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('pagination.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
