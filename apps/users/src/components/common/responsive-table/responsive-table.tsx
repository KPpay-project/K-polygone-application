import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  accessor: string | ((row: T) => any);
  className?: string;
  sortable?: boolean;
  width?: string;
}

export interface TableAction<T = any> {
  icon?: ReactNode;
  label?: string;
  onClick: (row: T) => void;
  className?: string;
  disabled?: (row: T) => boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface ResponsiveTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  showCheckbox?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string | ReactNode;
  className?: string;
  renderMobileCard?: (row: T, index: number) => ReactNode;
  renderDesktopRow?: (row: T, index: number) => ReactNode;
  loading?: boolean;
  loadingRows?: number;

  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;

  showFilters?: boolean;
  filters?: FilterConfig[];
  onFilterChange?: (key: string, value: string) => void;
  filterValues?: Record<string, string>;
  onClearFilters?: () => void;

  showDateRange?: boolean;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  dateRangeLabel?: string;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = 'Search...' }: SearchInputProps) => {
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
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

const FilterSelect = ({ label, value, onChange, options }: FilterSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[120px] h-auto px-3 py-2 text-xs sm:text-sm">
        <SelectValue placeholder={label} />
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

interface DateRangePickerProps {
  value: { from: Date | undefined; to: Date | undefined };
  onChange: (value: { from: Date | undefined; to: Date | undefined }) => void;
  label?: string;
}

const DateRangePicker = ({ value, onChange, label = 'Pick a date' }: DateRangePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-700">
            {value.from && value.to
              ? `${format(value.from, 'dd MMM yyyy')} - ${format(value.to, 'dd MMM yyyy')}`
              : value.from
                ? `From ${format(value.from, 'dd MMM yyyy')}`
                : value.to
                  ? `To ${format(value.to, 'dd MMM yyyy')}`
                  : label}
          </span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => onChange(range || { from: undefined, to: undefined })}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const LoadingSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-4 px-4 py-4">
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default function ResponsiveTable<T = any>({
  data,
  columns,
  actions,
  showCheckbox = false,
  onRowClick,
  emptyMessage = 'No data found',
  className,
  renderMobileCard,
  renderDesktopRow,
  loading = false,
  loadingRows = 3,

  showSearch = false,
  searchPlaceholder,
  onSearch,
  searchValue = '',

  showFilters = false,
  filters = [],
  onFilterChange,
  filterValues = {},
  onClearFilters,

  showDateRange = false,
  dateRange: propDateRange,
  onDateRangeChange,
  dateRangeLabel
}: ResponsiveTableProps<T>) {
  const { t } = useTranslation();
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>({});
  const [localDateRange, setLocalDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const effectiveSearchValue = onSearch ? searchValue : localSearchValue;
  const handleSearchChange = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      setLocalSearchValue(value);
    }
  };

  const effectiveFilterValues = onFilterChange ? filterValues : localFilterValues;
  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    } else {
      setLocalFilterValues((prev) => ({ ...prev, [key]: value }));
    }
  };

  const effectiveDateRange = onDateRangeChange ? propDateRange : localDateRange;
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (onDateRangeChange) {
      onDateRangeChange(range);
    } else {
      setLocalDateRange(range);
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      setLocalFilterValues({});
      setLocalSearchValue('');
      setLocalDateRange({ from: undefined, to: undefined });
    }
  };

  const hasActiveFilters = () => {
    if (effectiveSearchValue !== '') return true;
    if (effectiveDateRange?.from || effectiveDateRange?.to) return true;

    for (const key in effectiveFilterValues) {
      if (effectiveFilterValues[key] && effectiveFilterValues[key] !== 'all') {
        return true;
      }
    }

    return false;
  };

  const allChecked = checkedRows.length === data.length && data.length > 0;
  const someChecked = checkedRows.length > 0 && !allChecked;

  const handleCheck = (idx: number) => {
    setCheckedRows((prev) => {
      let newChecked;
      if (prev.includes(idx)) {
        newChecked = prev.filter((i) => i !== idx);
      } else {
        newChecked = [...prev, idx];
      }

      if (newChecked.length === data.length) {
        return data.map((_, i) => i);
      }
      return newChecked;
    });
  };

  const handleCheckAll = () => {
    setCheckedRows((prev) => (prev.length === data.length ? [] : data.map((_, idx) => idx)));
  };

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return (row as any)[column.accessor];
  };

  const DefaultDesktopRow = ({ row, index }: { row: T; index: number }) => (
    <div
      className={cn(
        'grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer',
        onRowClick && 'cursor-pointer'
      )}
      onClick={() => onRowClick?.(row)}
    >
      {showCheckbox && (
        <div className="col-span-1 flex items-center">
          <Checkbox checked={checkedRows.includes(index)} onCheckedChange={() => handleCheck(index)} />
        </div>
      )}
      {columns.map((column) => (
        <div
          key={column.key}
          className={cn('flex items-center text-sm text-gray-900', column.width || 'col-span-1', column.className)}
        >
          {getCellValue(row, column)}
        </div>
      ))}
      {actions && actions.length > 0 && (
        <div className="col-span-1 flex items-center justify-end gap-2">
          {actions.map((action, actionIndex) => (
            <button
              key={actionIndex}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              disabled={action.disabled?.(row)}
              className={cn('p-1 rounded hover:bg-gray-100 disabled:opacity-50', action.className)}
              title={action.label}
            >
              {action.icon || <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const DefaultMobileCard = ({ row, index }: { row: T; index: number }) => (
    <div
      className={cn('bg-white border border-gray-200 rounded-lg p-4 space-y-3', onRowClick && 'cursor-pointer')}
      onClick={() => onRowClick?.(row)}
    >
      <div className="space-y-2">
        {columns.slice(0, 4).map((column) => (
          <div key={column.key} className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{column.label}</span>
            <div className={cn('text-sm text-gray-900', column.className)}>{getCellValue(row, column)}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {showCheckbox && <Checkbox checked={checkedRows.includes(index)} onCheckedChange={() => handleCheck(index)} />}
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                }}
                disabled={action.disabled?.(row)}
                className={cn('p-1 rounded hover:bg-gray-100 disabled:opacity-50', action.className)}
                title={action.label}
              >
                {action.icon || <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSearchAndFilters = () => {
    if (!showSearch && !showFilters && !showDateRange) return null;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {showSearch && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <SearchInput
              value={effectiveSearchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder || t('common.search')}
            />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Date Range Filter */}
          {showDateRange && (
            <DateRangePicker
              value={effectiveDateRange}
              onChange={handleDateRangeChange}
              label={dateRangeLabel || t('common.pickDate', 'Pick a date')}
            />
          )}

          {/* Custom Filters */}
          {showFilters &&
            filters.map((filter) => (
              <FilterSelect
                key={filter.key}
                label={filter.label}
                value={effectiveFilterValues[filter.key] || 'all'}
                onChange={(value) => handleFilterChange(filter.key, value)}
                options={filter.options}
              />
            ))}

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-xs sm:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t('common.clearFilters', 'Clear Filters')}
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        <LoadingSkeleton rows={loadingRows} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <div className="py-12 text-center flex flex-col items-center justify-center">
          {typeof emptyMessage === 'string' ? (
            <div className="text-gray-400 text-sm">{emptyMessage}</div>
          ) : (
            emptyMessage
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Only render search and filters when data is not empty */}
      {renderSearchAndFilters()}

      <div className="hidden lg:block w-full overflow-x-auto">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-600">
              {showCheckbox && (
                <div className="col-span-1 flex items-center">
                  <Checkbox checked={allChecked} indeterminate={someChecked} onCheckedChange={handleCheckAll} />
                </div>
              )}
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn('flex items-center whitespace-nowrap', column.width || 'col-span-1')}
                >
                  {column.label}
                  {column.sortable && (
                    <button className="ml-1 p-0.5">
                      <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                    </button>
                  )}
                </div>
              ))}
              {actions && actions.length > 0 && <div className="col-span-1 flex items-center justify-end">Actions</div>}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {data.map((row, index) =>
              renderDesktopRow ? (
                <div key={index}>{renderDesktopRow(row, index)}</div>
              ) : (
                <DefaultDesktopRow key={index} row={row} index={index} />
              )
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {showCheckbox && (
          <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox checked={allChecked} indeterminate={someChecked} onCheckedChange={handleCheckAll} />
              <span className="text-sm font-medium text-gray-700">
                {allChecked ? 'Deselect All' : someChecked ? 'Select All' : 'Select All'}
              </span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {data.map((row, index) =>
            renderMobileCard ? (
              <div key={index}>{renderMobileCard(row, index)}</div>
            ) : (
              <DefaultMobileCard key={index} row={row} index={index} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
