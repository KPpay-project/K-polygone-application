'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronRight, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DefaultTableProps<T = any> {
  data: T[];
  title?: string;
  searchKey?: keyof T;
  searchPlaceholder?: string;
  actions?: {
    label: string;
    onClick: (row: T) => void;
  }[];
  loading?: boolean;
  loadingRows?: number;
}

const LoadingSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-4 px-4 py-4">
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="col-span-2 h-4 bg-gray-200 rounded"></div>
              ))}
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

function DefaultTable<T extends Record<string, any>>({
  data,
  title,
  searchKey,
  searchPlaceholder = 'Search...',
  actions = [],
  loading = false,
  loadingRows = 3
}: DefaultTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<T>[]>(() => {
    if (!data || data.length === 0) return [];

    const sampleRow = data[0];
    const keys = Object.keys(sampleRow);

    const generatedColumns: ColumnDef<T>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="bg-white rounded-full p-0.5 border border-gray-200 shadow text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())}
              title={table.getIsAllPageRowsSelected() ? 'Unselect all' : 'Select all'}
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ];

    keys.forEach((key) => {
      generatedColumns.push({
        accessorKey: key,
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="ml-1 p-0.5">
              <ArrowUpDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const cellValue = row.getValue(key);
          if (typeof cellValue === 'number') {
            if (cellValue > 0 && cellValue < 1000000 && key.toLowerCase().includes('amount')) {
              return (
                <div className="text-right font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(cellValue)}
                </div>
              );
            }
            return <div className="text-right">{cellValue}</div>;
          }
          if (typeof cellValue === 'string') {
            if (key.toLowerCase().includes('status')) {
              return <div className="capitalize">{cellValue}</div>;
            }
            if (key.toLowerCase().includes('email')) {
              return <div className="lowercase">{cellValue}</div>;
            }
            return <div>{cellValue}</div>;
          }
          if (typeof cellValue === 'boolean') {
            return <div>{cellValue ? 'Yes' : 'No'}</div>;
          }
          if (cellValue instanceof Date) {
            return <div>{cellValue.toLocaleDateString()}</div>;
          }
          return <div>{String(cellValue)}</div>;
        }
      });
    });

    if (actions.length > 0) {
      generatedColumns.push({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row.original);
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={action.label}
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )
      });
    }

    return generatedColumns;
  }, [data, actions]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const searchColumn = searchKey ? String(searchKey) : Object.keys(data[0] || {})[0];

  const DefaultMobileCard = ({ row }: { row: T }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        {Object.keys(row)
          .slice(0, 4)
          .map((key) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </span>
              <div className="text-sm text-gray-900">{String(row[key])}</div>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Checkbox
          checked={table.getRow(String(row.id)).getIsSelected()}
          onCheckedChange={(value) => table.getRow(String(row.id)).toggleSelected(!!value)}
        />
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                }}
                className="p-1 rounded hover:bg-gray-100"
                title={action.label}
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <LoadingSkeleton rows={loadingRows} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-400 text-sm">No data found</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
      )}

      <div className="flex items-center py-4">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className="max-w-sm border-gray-200 rounded-lg"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto border-gray-200 rounded-lg">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200 rounded-lg">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-gray-900"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:block w-full overflow-x-auto">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-3 text-sm font-medium text-gray-600">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'hover:bg-gray-50',
                      row.getIsSelected() ? 'bg-blue-50 border-l-4 border-blue-500' : '',
                      'transition-colors'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-4 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {table.getRowModel().rows.map((row) => (
          <DefaultMobileCard key={row.id} row={row.original} />
        ))}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gray-200 rounded-lg"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gray-200 rounded-lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DefaultTable;
