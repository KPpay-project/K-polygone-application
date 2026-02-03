import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import { cn } from '@/lib/utils';
import { format, isWithinInterval } from 'date-fns';
import { WalletAdd } from 'iconsax-reactjs';
import { Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DateRange } from 'react-day-picker';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = 'Search transactions...' }: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
};

interface FilterSelectProps {
  labelKey: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FilterSelect = ({ labelKey, value, onChange, options }: FilterSelectProps) => {
  const { t } = useTranslation();

  const placeholderMap: Record<string, string> = {
    type: t('dashboard.transactions.type'),
    status: t('dashboard.transactions.status'),
    currency: t('dashboard.transactions.currency')
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[120px] h-auto px-3 py-2 text-xs sm:text-sm">
        <SelectValue placeholder={placeholderMap[labelKey] || 'Filter'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('common.all')}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export interface Transaction {
  id: string;
  type: string;
  transactionId: string;
  paymentMethod: string;
  amount: string;
  date: string;
  time: string;
  status: string;
  statusColor: string;
}

interface TransactionTableProps {
  showTitle?: boolean;
  title?: string;
  data?: Transaction[];
  itemsPerPage?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  showCheckbox?: boolean;
  onRowClick?: (row: Transaction) => void;
  className?: string;
  searchPlaceholder?: string;
}

export default function TransactionTable({
  showTitle = true,
  title,
  data = [],
  itemsPerPage = 5,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  showCheckbox = true,
  onRowClick,
  className = '',
  searchPlaceholder
}: TransactionTableProps) {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrencyFilter('all');
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    currencyFilter !== 'all' ||
    dateRange?.from !== undefined ||
    dateRange?.to !== undefined;

  // Default sample data if none provided
  const defaultTransactions: Transaction[] = [
    {
      id: '1',
      type: 'Money Withdrawal',
      transactionId: '904678829929E',
      paymentMethod: 'Mobile Money',
      amount: 'FCFA -3,455',
      date: '22-07-2025',
      time: '12:02 PM',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '2',
      type: 'Money Withdrawal',
      transactionId: '904678829930F',
      paymentMethod: 'Mobile Money',
      amount: 'FCFA -2,100',
      date: '21-07-2025',
      time: '09:15 AM',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const allTransactions = data.length > 0 ? data : defaultTransactions;

  const typeOptions = [{ value: 'withdrawal', label: t('dashboard.transactions.transactionTypes.withdrawal') }];

  const statusOptions = [
    { value: 'approved', label: t('dashboard.transactions.statuses.approved') },
    { value: 'pending', label: t('dashboard.transactions.statuses.pending') },
    { value: 'failed', label: t('dashboard.transactions.statuses.failed') }
  ];

  const currencyOptions = [
    { value: 'fcfa', label: 'FCFA' },
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' }
  ];

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const matchesSearch =
        searchQuery === '' ||
        transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || transaction.type.toLowerCase().includes(typeFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || transaction.status.toLowerCase().includes(statusFilter.toLowerCase());

      const matchesCurrency =
        currencyFilter === 'all' || transaction.amount.toLowerCase().includes(currencyFilter.toLowerCase());

      const matchesDate = (() => {
        if (!dateRange?.from && !dateRange?.to) return true;

        // Parse transaction date (format: dd-MM-yyyy)
        const [day, month, year] = transaction.date.split('-').map(Number);
        const transactionDate = new Date(year, month - 1, day);

        if (dateRange?.from && dateRange?.to) {
          return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to });
        } else if (dateRange?.from) {
          return transactionDate >= dateRange.from;
        } else if (dateRange?.to) {
          return transactionDate <= dateRange.to;
        }

        return true;
      })();

      return matchesSearch && matchesType && matchesStatus && matchesCurrency && matchesDate;
    });
  }, [allTransactions, searchQuery, typeFilter, statusFilter, currencyFilter, dateRange]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter, currencyFilter, dateRange]);

  const paginatedTransactions = useMemo(() => {
    if (!showPagination) return filteredTransactions;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'category',
      label: t('dashboard.transactions.paymentCategory'),
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center">
            <WalletAdd size={15} className="text-purple-300" />
          </div>
          <span className="text-sm text-gray-900">{row.type}</span>
        </div>
      ),
      width: 'col-span-2',
      sortable: true
    },
    {
      key: 'transactionId',
      label: t('dashboard.transactions.transactionId'),
      accessor: 'transactionId',
      width: 'col-span-2',
      className: 'text-gray-600'
    },
    {
      key: 'paymentMethod',
      label: t('dashboard.transactions.transactionType'),
      accessor: 'paymentMethod',
      width: 'col-span-2',
      className: 'text-gray-600'
    },
    {
      key: 'amount',
      label: t('dashboard.transactions.amount'),
      accessor: 'amount',
      width: 'col-span-2',
      className: 'font-medium text-gray-900'
    },
    {
      key: 'date',
      label: t('dashboard.transactions.date'),
      accessor: (row) => (
        <div>
          <div className="text-sm text-gray-900">{row.date}</div>
          <div className="text-xs text-gray-500">{row.time}</div>
        </div>
      ),
      width: 'col-span-2'
    },
    {
      key: 'status',
      label: t('common.status'),
      accessor: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            row.statusColor
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
            <div className="text-sm font-medium text-gray-900">{row.type}</div>
            <div className="text-xs text-gray-500">{row.transactionId}</div>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            row.statusColor
          )}
        >
          {row.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{t('dashboard.transactions.transactionType')}</span>
          <span className="text-sm text-gray-900">{row.paymentMethod}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{t('dashboard.transactions.amount')}</span>
          <span className="text-sm font-medium text-gray-900">{row.amount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{t('dashboard.transactions.date')}</span>
          <div className="text-right">
            <div className="text-sm text-gray-900">{row.date}</div>
            <div className="text-xs text-gray-500">{row.time}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const displayTitle = title || t('dashboard.transactions.title');

  return (
    <div className={cn('p-3 sm:p-6 pt-0 bg-white', className)}>
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{displayTitle}</h3>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {showSearch && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={searchPlaceholder || t('dashboard.transactions.searchPlaceholder')}
            />
          )}
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`
                      : dateRange?.from
                        ? `From ${format(dateRange.from, 'dd MMM yyyy')}`
                        : dateRange?.to
                          ? `To ${format(dateRange.to, 'dd MMM yyyy')}`
                          : t('dashboard.transactions.pickDate')}
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
              </PopoverContent>
            </Popover>
            <FilterSelect labelKey="type" value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
            <FilterSelect labelKey="status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
            <FilterSelect
              labelKey="currency"
              value={currencyFilter}
              onChange={setCurrencyFilter}
              options={currencyOptions}
            />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs sm:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                {t('common.clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>

      <ResponsiveTable
        data={paginatedTransactions}
        columns={columns}
        showCheckbox={showCheckbox}
        showPagination={showPagination}
        page={currentPage}
        perPage={itemsPerPage}
        totalEntries={filteredTransactions.length}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onPerPageChange={() => {
          setCurrentPage(1);
          // Note: itemsPerPage would need to be made stateful to support this
        }}
        renderMobileCard={renderMobileCard}
        emptyMessage={
          filteredTransactions.length === 0
            ? hasActiveFilters
              ? t('dashboard.transactions.noMatchingTransactions')
              : 'No transactions yet 💳'
            : ''
        }
        onRowClick={onRowClick}
        className="mb-6"
      />
    </div>
  );
}
