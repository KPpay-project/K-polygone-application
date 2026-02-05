import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { Trash2, Eye, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import ModularHeaderTitle from '@/components/misc/modular-header-title';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AddBillerModal from '@/components/modals/add-biller-modal';
import DeleteAction from '@/components/actions/delete-action';
import { GET_BILLERS } from '@repo/api';
import { billerListFilterConfig } from '@/config/filter-configs';
import { GetBillersResult, GetBillersVariables, Biller } from '@repo/types';
import { getBillerLogoConfig } from '@/utils/biller-utils';

// Stub data for demonstration
const STUB_BILLERS: Biller[] = [
  {
    id: '1',
    billerName: 'ZESCO Limited',
    description: 'Zambia Electricity Supply Corporation - Electricity bill payments',
    iconLogo: 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=ZE',
    status: 'active',
    shortCode: 'ZESCO',
    providerCode: 'ZM_ZESCO',
    channel: 'web',
    insertedAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    billerName: 'Lusaka Water & Sewerage',
    description: 'Water and sewerage services for Lusaka residents',
    iconLogo: 'https://via.placeholder.com/32x32/0EA5E9/FFFFFF?text=LW',
    status: 'active',
    shortCode: 'LWSC',
    providerCode: 'ZM_LWSC',
    channel: 'mobile',
    insertedAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z'
  },
  {
    id: '3',
    billerName: 'MTN Zambia',
    description: 'Mobile network operator - Airtime and data bundle payments',
    iconLogo: 'https://via.placeholder.com/32x32/FFEB3B/000000?text=MT',
    status: 'active',
    shortCode: 'MTN',
    providerCode: 'ZM_MTN',
    channel: 'web',
    insertedAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T13:30:00Z'
  },
  {
    id: '4',
    billerName: 'Airtel Zambia',
    description: 'Telecommunications services - Mobile payments and top-ups',
    iconLogo: 'https://via.placeholder.com/32x32/EF4444/FFFFFF?text=AT',
    status: 'inactive',
    shortCode: 'AIRTEL',
    providerCode: 'ZM_AIRTEL',
    channel: 'mobile',
    insertedAt: '2024-01-08T08:45:00Z',
    updatedAt: '2024-01-25T10:15:00Z'
  },
  {
    id: '5',
    billerName: 'DSTV Zambia',
    description: 'Digital satellite television subscription payments',
    iconLogo: 'https://via.placeholder.com/32x32/1E40AF/FFFFFF?text=DS',
    status: 'pending',
    shortCode: 'DSTV',
    providerCode: 'ZM_DSTV',
    channel: 'web',
    insertedAt: '2024-01-20T15:20:00Z',
    updatedAt: '2024-01-26T09:10:00Z'
  },
  {
    id: '6',
    billerName: 'Zamtel',
    description: 'National telecommunications company - Fixed line and internet',
    iconLogo: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=ZT',
    status: 'active',
    shortCode: 'ZAMTEL',
    providerCode: 'ZM_ZAMTEL',
    channel: 'web',
    insertedAt: '2024-01-05T12:30:00Z',
    updatedAt: '2024-01-24T17:45:00Z'
  },
  {
    id: '7',
    billerName: 'GOTV Zambia',
    description: 'Digital terrestrial television subscription service',
    iconLogo: 'https://via.placeholder.com/32x32/F59E0B/FFFFFF?text=GO',
    status: 'active',
    shortCode: 'GOTV',
    providerCode: 'ZM_GOTV',
    channel: 'mobile',
    insertedAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-28T11:25:00Z'
  },
  {
    id: '8',
    billerName: 'Copperbelt Water',
    description: 'Water utility services for Copperbelt Province',
    iconLogo: 'https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=CW',
    status: 'inactive',
    shortCode: 'CBWSC',
    providerCode: 'ZM_CBWSC',
    channel: 'web',
    insertedAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-27T08:30:00Z'
  }
];

const BillerList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [search, setSearch] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [deleting, setDeleting] = useState(false);

  const variables = useMemo<GetBillersVariables>(
    () => ({
      page,
      perPage,
      search: search || undefined,
      filters: Object.keys(currentFilters).length > 0 ? currentFilters : undefined
    }),
    [page, perPage, search, currentFilters]
  );

  const { data, loading, refetch } = useQuery<GetBillersResult>(GET_BILLERS, {
    variables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const billers = data?.billers?.entries || STUB_BILLERS;
  const totalEntries = data?.billers?.totalEntries || STUB_BILLERS.length;

  const handleViewBiller = useCallback((billerId: string) => {
    console.log('View biller:', billerId);
  }, []);

  const handleEditBiller = useCallback((billerId: string) => {
    console.log('Edit biller:', billerId);
  }, []);

  const handleDeleteBiller = useCallback((biller: Biller) => {
    setSelectedBiller(biller);
    setDeleteOpen(true);
  }, []);

  const columns: TableColumn<Biller>[] = useMemo(
    () => [
      {
        key: 'billerName',
        label: 'Biller Name',
        accessor: 'billerName',
        width: '20'
      },
      {
        key: 'description',
        label: 'Description',
        accessor: (biller: Biller) => (
          <div className="text-sm text-gray-900 whitespace-normal break-words leading-relaxed">
            {biller.description}
          </div>
        ),
        className: '!truncate-none whitespace-normal',
        width: '25'
      },
      {
        key: 'iconLogo',
        label: 'Icon/Logo',
        accessor: (biller: Biller) => {
          const logoConfig = getBillerLogoConfig(biller.billerName);
          return (
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${logoConfig.bgColor}`}>
                <span className={`text-xs font-medium ${logoConfig.textColor}`}>{logoConfig.initials}</span>
              </div>
            </div>
          );
        },
        width: '10'
      },
      {
        key: 'status',
        label: 'Status',
        accessor: (biller: Biller) => (
          <div
            className={`flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit border ${
              biller.status === 'active'
                ? 'bg-[#DCFCE7] border-[#16A34A]'
                : biller.status === 'inactive'
                  ? 'bg-[#FEE2E2] border-[#DC2626]'
                  : biller.status === 'pending'
                    ? 'bg-[#FEF3C7] border-[#F59E0B]'
                    : 'bg-gray-100 border-gray-300'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                biller.status === 'active'
                  ? 'bg-[#16A34A]'
                  : biller.status === 'inactive'
                    ? 'bg-[#DC2626]'
                    : biller.status === 'pending'
                      ? 'bg-[#F59E0B]'
                      : 'bg-gray-400'
              }`}
            />
            <span
              className={`text-sm font-light ${
                biller.status === 'active'
                  ? 'text-[#15803D]'
                  : biller.status === 'inactive'
                    ? 'text-[#B91C1C]'
                    : biller.status === 'pending'
                      ? 'text-[#D97706]'
                      : 'text-gray-600'
              }`}
            >
              {biller.status}
            </span>
          </div>
        ),
        width: '10'
      },
      {
        key: 'shortCode',
        label: 'Short Code',
        accessor: 'shortCode',
        width: '10'
      },
      {
        key: 'providerCode',
        label: 'Provider Code',
        accessor: 'providerCode',
        width: '10'
      },
      {
        key: 'channel',
        label: 'Channel',
        accessor: 'channel',
        width: '10'
      }
    ],
    []
  );

  const actions: TableAction<Biller>[] = useMemo(
    () => [
      {
        icon: (biller: Biller) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-150" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBiller(biller.id);
                }}
                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-gray-700">View</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBiller(biller);
                }}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        onClick: () => {},
        className: ''
      }
    ],
    [handleViewBiller, handleDeleteBiller]
  );

  return (
    <DashboardLayout>
      <div>
        <div>
          <ModularHeaderTitle
            title="Billers"
            count={totalEntries}
            onSearch={(value: string) => {
              setSearch(value);
              setPage(1);
            }}
            onFilter={(filters: Record<string, any>) => {
              setCurrentFilters(filters);
              setPage(1);
            }}
            currentFilters={currentFilters}
            filterConfig={billerListFilterConfig}
          >
            <AddBillerModal
              trigger={<Button className="bg-blue-700">Add Biller</Button>}
              onSubmit={async (data) => {
                try {
                  // TODO: Implement actual API call to create biller
                  console.log('Creating biller:', data);
                  toast.success('Biller added successfully');
                  // Refetch billers data here
                } catch (error) {
                  console.error('Error creating biller:', error);
                  toast.error('Failed to add biller');
                }
              }}
            />
          </ModularHeaderTitle>
        </div>

        <div>
          <ResponsiveTable
            data={billers}
            columns={columns}
            actions={actions}
            showCheckbox
            loading={loading}
            page={data?.billers?.pageNumber ?? page}
            perPage={data?.billers?.pageSize ?? perPage}
            totalEntries={totalEntries}
            totalPages={data?.billers?.totalPages ?? 1}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DeleteAction
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedBiller(null);
        }}
        title={'Are you sure you want to delete this biller?'}
        description={
          selectedBiller
            ? `You won't be able to recover ${selectedBiller.billerName || 'this biller'} once deleted`
            : "You won't be able to recover this biller once deleted"
        }
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true);
          try {
            // TODO: Implement delete biller mutation
            toast.success('Biller deleted successfully');
            setDeleteOpen(false);
            setSelectedBiller(null);
            refetch();
          } catch {
            toast.error('Failed to delete biller');
          } finally {
            setDeleting(false);
          }
        }}
        onCancel={() => {
          setSelectedBiller(null);
        }}
      />
    </DashboardLayout>
  );
};

export default BillerList;
