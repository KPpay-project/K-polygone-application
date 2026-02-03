import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import { cn } from '@/lib/utils';
import { format, isWithinInterval } from 'date-fns';
import { WalletAdd } from 'iconsax-reactjs';
import { Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions..."
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
  const placeholderMap: Record<string, string> = {
    type: 'Type',
    status: 'Status',
    currency: 'Currency'
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[120px] h-auto px-3 py-2 text-xs sm:text-sm">
        <SelectValue placeholder={placeholderMap[labelKey] || 'Filter'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface Transaction {
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

export default function WithdrawalHistory({ showTitle = true }: { showTitle?: boolean }) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrencyFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    currencyFilter !== 'all' ||
    dateRange.from !== undefined ||
    dateRange.to !== undefined;

  const allTransactions: Transaction[] = [
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
    },
    {
      id: '3',
      type: 'Money Withdrawal',
      transactionId: '904678829931G',
      paymentMethod: 'Bank Transfer',
      amount: 'USD -500',
      date: '20-07-2025',
      time: '14:30 PM',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '4',
      type: 'Money Withdrawal',
      transactionId: '904678829932H',
      paymentMethod: 'Mobile Money',
      amount: 'FCFA -1,200',
      date: '19-07-2025',
      time: '16:45 PM',
      status: 'Failed',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: '5',
      type: 'Money Withdrawal',
      transactionId: '904678829933I',
      paymentMethod: 'Bank Transfer',
      amount: 'EUR -200',
      date: '18-07-2025',
      time: '11:20 AM',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const typeOptions = [{ value: 'withdrawal', label: 'Money Withdrawal' }];

  const statusOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
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
        if (!dateRange.from && !dateRange.to) return true;

        // Parse transaction date (format: dd-MM-yyyy)
        const [day, month, year] = transaction.date.split('-').map(Number);
        const transactionDate = new Date(year, month - 1, day);

        if (dateRange.from && dateRange.to) {
          return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to });
        } else if (dateRange.from) {
          return transactionDate >= dateRange.from;
        } else if (dateRange.to) {
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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'category',
      label: 'Payment Category',
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
      label: 'Transaction ID',
      accessor: 'transactionId',
      width: 'col-span-2',
      className: 'text-gray-600'
    },
    {
      key: 'paymentMethod',
      label: 'Transaction Type',
      accessor: 'paymentMethod',
      width: 'col-span-2',
      className: 'text-gray-600'
    },
    {
      key: 'amount',
      label: 'Withdrawal Amount',
      accessor: 'amount',
      width: 'col-span-2',
      className: 'font-medium text-gray-900'
    },
    {
      key: 'date',
      label: 'Date',
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
      label: 'Status',
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

  // Removed actions as requested

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
          <span className="text-xs text-gray-500">Transaction Type</span>
          <span className="text-sm text-gray-900">{row.paymentMethod}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Amount</span>
          <span className="text-sm font-medium text-gray-900">{row.amount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Date</span>
          <div className="text-right">
            <div className="text-sm text-gray-900">{row.date}</div>
            <div className="text-xs text-gray-500">{row.time}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 pt-0 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          {showTitle && <h3 className="text-lg font-semibold text-gray-900 sm:order-first">Withdrawal History</h3>}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-700">
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`
                    : dateRange.from
                      ? `From ${format(dateRange.from, 'dd MMM yyyy')}`
                      : dateRange.to
                        ? `To ${format(dateRange.to, 'dd MMM yyyy')}`
                        : 'Pick Date Range'}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                initialFocus
              />
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
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <ResponsiveTable
        data={paginatedTransactions}
        columns={columns}
        showCheckbox={true}
        renderMobileCard={renderMobileCard}
        emptyMessage={
          filteredTransactions.length === 0
            ? hasActiveFilters
              ? 'No transactions match your filters'
              : 'No transactions found'
            : ''
        }
        onRowClick={(row) => console.log('Row clicked:', row)}
        className="mb-6"
      />

      {filteredTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!hasPrevPage}
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-xs text-gray-500">({filteredTransactions.length} total results)</span>
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={!hasNextPage}
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
