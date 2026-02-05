import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import HeaderTitle from '@/components/misc/header-title';
import { Add, PauseCircle } from 'iconsax-reactjs';
import DefaultModal from '@/components/sub-modules/popups/modal';
import AddNewAdmin from '@/modules/admin/add-admin';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ADMINS } from '@repo/api';
import DeleteAction from '@/components/actions/delete-action';
import StatusTabs from '@/components/misc/status-tabs';
import moment from 'moment';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

function AdminListPage() {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const sortBy = 'updatedAt';
  const sortDirection: 'asc' | 'desc' = 'desc';
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [suspendOpen, setSuspendOpen] = useState<boolean>(false);
  const [suspending, setSuspending] = useState<boolean>(false);
  const { suspendAdmin } = useUser();

  const variables = useMemo(
    () => ({
      page,
      perPage,
      sortBy,
      sortDirection,
      search: search || undefined,
      filters: statusFilter && statusFilter !== 'All' ? { status: statusFilter.toLowerCase() } : undefined
    }),
    [page, perPage, sortBy, sortDirection, search, statusFilter]
  );

  const { data, loading, error, refetch } = useQuery(GET_ADMINS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    refetch(variables);
  }, [variables, refetch]);

  const columns: TableColumn[] = [
    // { key: 'id', label: 'Admin ID', accessor: 'id' },
    {
      key: 'dateJoined',
      label: 'Date Joined',
      accessor: (row: any) => (row.dateJoined ? moment(row.dateJoined).format('MMM Do YY') : '')
    },
    { key: 'name', label: 'Name', accessor: 'name' },
    { key: 'email', label: 'Email', accessor: 'email' },
    { key: 'role', label: 'Role', accessor: 'role' },
    { key: 'status', label: 'Status', accessor: 'status' }
  ];

  const toTitle = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

  const rows = (data?.admins?.entries || []).map((a: any) => ({
    id: a.id,
    name: `${a.firstName || ''}`.trim(),
    email: a.email,
    role: toTitle(a.role) || 'Admin',
    status: toTitle(a.status) || 'Active',
    dateJoined: a.updatedAt ? new Date(a.updatedAt).toLocaleString() : ''
  }));

  const tableData = loading || error || !data ? [] : rows;
  const pageInfo = data?.admins;

  const actions: TableAction[] = [
    {
      icon: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/*<DropdownMenuItem*/}
            {/*  onClick={(e) => {*/}
            {/*    e.stopPropagation();*/}
            {/*    handleViewAdmin(row.id);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <EyeIcon className="mr-2 h-4 w-4" />*/}
            {/*  <span>View</span>*/}
            {/*</DropdownMenuItem>*/}
            <DropdownMenuItem>
              <DefaultModal
                trigger={
                  <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </div>
                }
              >
                <div className="p-4">
                  <AddNewAdmin isEdit initialData={row} />
                </div>
              </DefaultModal>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAdmin(row);
                setSuspendOpen(true);
              }}
            >
              <PauseCircle />
              <span>Suspend</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAdmin(row);
                setDeleteOpen(true);
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      onClick: () => {},
      className: ''
    }
  ];

  return (
    <DashboardLayout>
      <div>
        <div>
          <HeaderTitle
            title="Admins"
            count={pageInfo?.totalEntries ?? tableData.length}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onFilter={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
            filterStatus={statusFilter}
            filterOptions={['All', 'Active', 'Inactive', 'Suspended', 'Pending']}
          >
            <DefaultModal
              trigger={
                <Button className="bg-blue-700">
                  <Add />
                  Add Admin
                </Button>
              }
              title="Add Admin"
            >
              <div className="">
                <AddNewAdmin />
              </div>
            </DefaultModal>
          </HeaderTitle>
        </div>

        <StatusTabs
          tabs={[
            {
              key: 'active',
              label: 'Active admins',
              count: statusFilter === 'Active' ? (pageInfo?.totalEntries ?? 0) : undefined
            },
            {
              key: 'suspended',
              label: 'Suspended admins',
              count: statusFilter === 'Suspended' ? (pageInfo?.totalEntries ?? 0) : undefined
            }
          ]}
          activeTab={
            statusFilter.toLowerCase() === 'active'
              ? 'active'
              : statusFilter.toLowerCase() === 'suspended'
                ? 'suspended'
                : 'active'
          }
          onTabChange={(tabKey) => {
            setStatusFilter(tabKey === 'active' ? 'Active' : 'Suspended');
            setPage(1);
          }}
        />

        <div>
          <ResponsiveTable
            data={tableData}
            columns={columns}
            actions={actions}
            showCheckbox
            loading={loading}
            page={pageInfo?.pageNumber ?? page}
            perPage={pageInfo?.pageSize ?? perPage}
            totalEntries={pageInfo?.totalEntries ?? 0}
            totalPages={pageInfo?.totalPages ?? 1}
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
          if (!open) setSelectedAdmin(null);
        }}
        title={'Are you sure you want to delete this admin?'}
        description={
          selectedAdmin
            ? `You won’t be able to recover ${selectedAdmin.name || 'this admin'} once deleted`
            : 'You won’t be able to recover this admin once deleted'
        }
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true);
          try {
            setDeleteOpen(false);
            setSelectedAdmin(null);
          } finally {
            setDeleting(false);
          }
        }}
        onCancel={() => {
          setSelectedAdmin(null);
        }}
      />

      <DefaultModal
        open={suspendOpen}
        onOpenChange={(open) => {
          setSuspendOpen(open);
          if (!open) {
            setSelectedAdmin(null);
          }
        }}
        title="Suspend Admin"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">Are you sure you want to suspend {selectedAdmin?.name || 'this admin'}?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSuspendOpen(false);
                setSelectedAdmin(null);
              }}
              disabled={suspending}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={async () => {
                setSuspending(true);
                setSuspendOpen(false);

                const toastId = toast.loading('Suspending admin...');

                try {
                  const response = await suspendAdmin({
                    adminId: selectedAdmin?.id
                  });

                  if (response?.data?.suspendAdmin?.success) {
                    toast.success('Admin suspended successfully', { id: toastId });
                    // Refresh the data
                    refetch();
                  } else {
                    const errorMsg = response?.data?.suspendAdmin?.message || 'Failed to suspend admin';
                    toast.error(errorMsg, { id: toastId });
                  }
                } catch (error: any) {
                  toast.error(error.message || 'Failed to suspend admin', { id: toastId });
                } finally {
                  setSuspending(false);
                  setSelectedAdmin(null);
                }
              }}
              disabled={suspending}
            >
              {suspending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Suspending...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </DefaultModal>
    </DashboardLayout>
  );
}

export default AdminListPage;
