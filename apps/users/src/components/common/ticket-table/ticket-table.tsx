import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveTable, TableColumn, FilterConfig } from '@/components/common/responsive-table';
import { cn } from '@/lib/utils';
import { isWithinInterval } from 'date-fns';
import { MessageText1 } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { EmptyTicketState } from '@/components/common/fallbacks';
import { Ticket, ticketStatusColors, ticketPriorityColors, mockTickets } from '@repo/types';
import { MessageCircle } from 'lucide-react';

interface TicketTableProps {
  showTitle?: boolean;
  title?: string;
  data?: Ticket[];
  itemsPerPage?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  showCheckbox?: boolean;
  onRowClick?: (row: Ticket) => void;
  className?: string;
  searchPlaceholder?: string;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  showTitle = true,
  title,
  data = mockTickets,
  itemsPerPage = 5,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  showCheckbox = false,
  onRowClick,
  className,
  searchPlaceholder
}) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: 'all',
    priority: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Clear all filters
  const clearFilters = () => {
    setFilterValues({
      status: 'all',
      priority: 'all'
    });
    setDateRange({ from: undefined, to: undefined });
    setSearchQuery('');
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  // Filter configurations
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: t('common.status'),
      options: [
        { value: 'done', label: t('ticket.status.done') },
        { value: 'in_progress', label: t('ticket.status.inProgress') },
        { value: 'pending', label: t('ticket.status.pending') }
      ]
    },
    {
      key: 'priority',
      label: t('ticket.priority'),
      options: [
        { value: 'high', label: t('ticket.priority.high') },
        { value: 'medium', label: t('ticket.priority.medium') },
        { value: 'low', label: t('ticket.priority.low') }
      ]
    }
  ];

  // Filter tickets based on search query, filters, and date range
  const filteredTickets = useMemo(() => {
    return data.filter((ticket) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        ticket.ticketNumber.toLowerCase().includes(searchLower) ||
        ticket.ticketSubject.toLowerCase().includes(searchLower) ||
        ticket.message.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = filterValues.status === 'all' || ticket.status === filterValues.status;

      // Priority filter
      const matchesPriority = filterValues.priority === 'all' || ticket.priority === filterValues.priority;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.from && dateRange.to) {
        const ticketDate = new Date(ticket.insertedAt);
        matchesDateRange = isWithinInterval(ticketDate, {
          start: dateRange.from,
          end: dateRange.to
        });
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
    });
  }, [data, searchQuery, filterValues, dateRange]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValues, dateRange]);

  // Paginate tickets
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  // Define table columns
  const columns: TableColumn<Ticket>[] = [
    {
      key: 'ticketNumber',
      label: t('ticket.number'),
      accessor: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <MessageText1 size={15} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.ticketNumber}</div>
          </div>
        </div>
      ),
      width: 'col-span-2'
    },
    {
      key: 'description',
      label: t('ticket.description'),
      accessor: (row) => (
        <div className="text-sm text-gray-900">
          <div className="font-medium">{row.ticketSubject}</div>
          <div className="text-gray-500 truncate max-w-xs">{row.message}</div>
        </div>
      ),
      width: 'col-span-4'
    },
    {
      key: 'status',
      label: t('common.status'),
      accessor: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            ticketStatusColors[row.status]
          )}
        >
          {row.status === 'in_progress' ? 'In Progress' : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      width: 'col-span-2'
    },
    {
      key: 'priority',
      label: t('ticket.priority'),
      accessor: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            ticketPriorityColors[row.priority]
          )}
        >
          {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
        </span>
      ),
      width: 'col-span-1'
    },
    {
      key: 'interactions',
      label: t('ticket.interactions'),
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">{row.comments}</span>
          </div>
        </div>
      ),
      width: 'col-span-1'
    }
  ];

  // Custom mobile card renderer
  const renderMobileCard = (row: Ticket) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageText1 size={15} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.ticketNumber}</div>
            <div className="text-xs text-gray-500">{row.ticketSubject}</div>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            ticketStatusColors[row.status]
          )}
        >
          {row.status === 'in_progress' ? 'In Progress' : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      </div>

      <div className="text-sm text-gray-500 line-clamp-2">{row.message}</div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <span
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
              ticketPriorityColors[row.priority]
            )}
          >
            <div className={cn('w-2 h-2 rounded-full mr-1.5', ticketPriorityColors[row.priority].dot)} />
            {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
          </span>
          <div className="flex items-center">
            <MessageCircle className="w-3.5 h-3.5 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">{row.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      <ResponsiveTable
        data={paginatedTickets}
        columns={columns}
        showCheckbox={showCheckbox}
        onRowClick={onRowClick}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder || t('common.search')}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        showFilters={showFilters}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showDateRange={true}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        renderMobileCard={renderMobileCard}
        emptyMessage={<EmptyTicketState />}
      />
    </div>
  );
};
