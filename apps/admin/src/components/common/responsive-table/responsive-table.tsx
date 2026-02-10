import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  accessor: string | ((row: T) => any);
  className?: string;
  sortable?: boolean;
  width?: string;
}

export interface TableAction<T = any> {
  icon?: ReactNode | ((row: T) => ReactNode);
  label?: string;
  onClick: (row: T) => void;
  className?: string;
  disabled?: (row: T) => boolean;
}

export interface ResponsiveTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  showCheckbox?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  renderMobileCard?: (row: T, index: number) => ReactNode;
  renderDesktopRow?: (row: T, index: number) => ReactNode;
  loading?: boolean;
  loadingRows?: number;
  showPagination?: boolean;
  page?: number;
  perPage?: number;
  totalEntries?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

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
          <div className="lg:hidden bg-white border border-gray-50 rounded-lg p-4 space-y-3">
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
  showPagination = true,
  page,
  perPage,
  totalEntries,
  totalPages,
  onPageChange
}: ResponsiveTableProps<T>) {
  const [checkedRows, setCheckedRows] = useState<number[]>([]);

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

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return (row as any)[column.accessor];
  };

  const DefaultDesktopRow = ({ row, index }: { row: T; index: number }) => (
    <TableRow className={cn(onRowClick && 'cursor-pointer', 'text-[15px]')} onClick={() => onRowClick?.(row)}>
      {columns.map((column) => (
        <TableCell
          key={`${column.key}-${index}`}
          className={cn('truncate px-6 py-4 text-sm', column.className)}
          title={String(getCellValue(row, column))}
          style={{ width: column.width ? `${column.width}%` : undefined }}
        >
          {getCellValue(row, column)}
        </TableCell>
      ))}
      {actions && actions.length > 0 && (
        <TableCell className="w-20 px-6 py-4">
          <div className="flex items-center justify-end gap-2">
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
                {typeof action.icon === 'function'
                  ? action.icon(row)
                  : action.icon || <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
            ))}
          </div>
        </TableCell>
      )}
    </TableRow>
  );

  const DefaultMobileCard = ({ row, index }: { row: T; index: number }) => (
    <div
      className={cn('bg-white border border-gray-50 rounded-lg p-4 space-y-3', onRowClick && 'cursor-pointer')}
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
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
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
                {typeof action.icon === 'function'
                  ? action.icon(row)
                  : action.icon || <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        <LoadingSkeleton rows={loadingRows} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-400 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <div className="hidden lg:block w-full">
        <div className="bg-white rounded-lg overflow-hidden">
          <Table className="text-[15px]">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn('text-sm font-medium py-4 px-6', column.className)}
                    style={{ width: column.width ? `${column.width}%` : undefined }}
                  >
                    <div className="flex items-center">
                      <p className="text-sm text-gray-700">{column.label}</p>
                      {column.sortable && (
                        <button className="ml-1 p-0.5">
                          <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                        </button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="w-20 text-right pr-6">
                    <p className="text-sm text-gray-700">Actions</p>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) =>
                renderDesktopRow ? (
                  renderDesktopRow(row, index)
                ) : (
                  <DefaultDesktopRow key={index} row={row} index={index} />
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="lg:hidden">
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

      {showPagination &&
        typeof page === 'number' &&
        typeof perPage === 'number' &&
        typeof totalEntries === 'number' &&
        typeof totalPages === 'number' && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} • {totalEntries} items
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => page > 1 && onPageChange?.(page - 1)}
                disabled={page <= 1}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>

              {(() => {
                const pages = [];
                const showPages = 3;
                let startPage = Math.max(1, page - Math.floor(showPages / 2));
                const endPage = Math.min(totalPages, startPage + showPages - 1);
                if (endPage - startPage < showPages - 1) {
                  startPage = Math.max(1, endPage - showPages + 1);
                }
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        page === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onPageChange?.(1)}
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                }
                for (let i = startPage; i <= endPage; i++) {
                  if (i === 1 && startPage === 1) {
                    pages.push(
                      <button
                        key={i}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          page === i
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => onPageChange?.(i)}
                      >
                        {i}
                      </button>
                    );
                  } else if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <button
                        key={i}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          page === i
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => onPageChange?.(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                }
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        page === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onPageChange?.(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }
                return pages;
              })()}

              <button
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => page < totalPages && onPageChange?.(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
