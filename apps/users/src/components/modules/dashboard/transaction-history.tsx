'';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { WalletAdd } from 'iconsax-reactjs';
import { Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';

const SearchInput = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={t('dashboard.transactions.searchPlaceholder')}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

const FilterButton = ({ labelKey }: { labelKey: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap">
      <span className="text-sm text-gray-700">{t(`dashboard.transactions.${labelKey}`)}</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export default function RecentTransactionHistory({ showTitle = true }: { showTitle?: boolean }) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const columns: TableColumn<any>[] = [
    {
      key: 'category',
      label: t('dashboard.transactions.paymentCategory'),
      accessor: () => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100/20 rounded-full flex items-center justify-center">
            <WalletAdd size={15} className="text-purple-300" />
          </div>
          <span className="text-sm text-gray-900">{t('dashboard.transactions.transactionTypes.withdrawal')}</span>
        </div>
      ),
      width: 'col-span-2'
    },
    {
      key: 'transactionId',
      label: t('dashboard.transactions.transactionId'),
      accessor: 'transactionId',
      width: 'col-span-2'
    },
    {
      key: 'transactionType',
      label: t('dashboard.transactions.transactionType'),
      accessor: () => t('dashboard.transactions.paymentMethods.mobileMoney'),
      width: 'col-span-2'
    },
    {
      key: 'amount',
      label: t('dashboard.transactions.amount'),
      accessor: 'amount',
      width: 'col-span-2'
    },
    {
      key: 'date',
      label: t('dashboard.transactions.date'),
      accessor: (row) => (
        <>
          <div className="text-sm text-gray-900">{row.date}</div>
          <div className="text-xs text-gray-500">
            {row.time} {t('dashboard.transactions.time.pm')}
          </div>
        </>
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

  const data = [
    {
      transactionId: '904678829929E',
      amount: 'FCFA -3,455',
      date: '22-07-2025',
      time: '12:02',
      status: t('dashboard.transactions.statuses.approved'),
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      transactionId: '904678829929E',
      amount: 'FCFA -3,455',
      date: '22-07-2025',
      time: '12:02',
      status: t('dashboard.transactions.statuses.pending'),
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="p-3 sm:p-6 bg-white">
      <div className="space-y-3 mb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {showTitle && <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.transactions.title')}</h3>}
          <div className="w-full sm:w-72">
            <SearchInput />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 px-2.5 py-1.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {date ? format(date, 'dd MMM yyyy') : t('dashboard.transactions.pickDate')}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <FilterButton labelKey="type" />
          <FilterButton labelKey="status" />
          <FilterButton labelKey="currency" />
        </div>
      </div>

      <ResponsiveTable
        data={data}
        columns={columns}
        showCheckbox
        emptyMessage={t('dashboard.transactions.noTransactions')}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <button className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          {t('pagination.previous')}
        </button>
        <span className="text-sm text-gray-600 text-center">{t('pagination.page', { current: 1, total: 10 })}</span>
        <button className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          {t('pagination.next')}
        </button>
      </div>
    </div>
  );
}
