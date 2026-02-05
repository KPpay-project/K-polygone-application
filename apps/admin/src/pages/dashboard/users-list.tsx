import DashboardLayout from '@/components/layouts/dashboard-layout';
import { EyeIcon, MoreHorizontal, Pencil } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { SUSPEND_USER } from '@repo/api';
import { useNavigate } from '@tanstack/react-router';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import ModularHeaderTitle from '@/components/misc/modular-header-title';
import StatusTabs from '@/components/misc/status-tabs';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@repo/api';
import { Button } from 'k-polygon-assets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DefaultModal from '@/components/sub-modules/popups/modal';
import AddUserAction from '@/components/actions/add-user-action';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import DeleteAction from '@/components/actions/delete-action';
import { toast } from 'sonner';
import { userListFilterConfig } from '@/config/filter-configs';

import { PauseCircle, Trash } from 'iconsax-reactjs';

function UsersListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);
  const sortBy = 'updatedAt';
  const sortDirection: 'asc' | 'desc' = 'desc';
  const [search, setSearch] = useState<string>('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({ status: 'active' });

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [suspendOpen, setSuspendOpen] = useState<boolean>(false);
  const [suspendReason, setSuspendReason] = useState<string>('');
  const [suspending, setSuspending] = useState<boolean>(false);
  const [suspendUserMutation] = useMutation(SUSPEND_USER);

  const countryCodeMap: Record<string, string> = {
    nigeria: 'ng',
    india: 'in',
    'united kingdom': 'gb',
    uk: 'gb',
    'great britain': 'gb',
    rwanda: 'rw',
    ghana: 'gh',
    'south africa': 'za',
    benin: 'bj',
    gabon: 'ga',
    'united states': 'us',
    usa: 'us',
    canada: 'ca'
  };

  const toCountryCode = (name?: string) => {
    if (!name) return undefined;
    const key = name.trim().toLowerCase();
    return countryCodeMap[key];
  };

  const variables = useMemo(() => {
    const filters: Record<string, any> = {};

    if (currentFilters.status && currentFilters.status !== 'all') {
      filters.status = currentFilters.status;
    }

    if (currentFilters.dateFrom) {
      filters.dateFrom = currentFilters.dateFrom;
    }

    if (currentFilters.dateTo) {
      filters.dateTo = currentFilters.dateTo;
    }

    return {
      page,
      perPage,
      sortBy,
      sortDirection,
      search: search || undefined,
      filters: Object.keys(filters).length > 0 ? filters : undefined
    };
  }, [page, perPage, sortBy, sortDirection, search, currentFilters]);

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    refetch(variables);
  }, [variables, refetch]);

  const handleViewUser = (userId: string) => {
    navigate({ to: '/dashboard/user-profile', search: { userId } });
  };

  const columns: TableColumn[] = [
    {
      key: 'dateJoined',
      label: 'Date Joined',
      accessor: (row: any) => (row.dateJoined ? moment(row.dateJoined).format('MMM Do YY') : ''),
      width: '15'
    },
    // {
    //   key: 'id',
    //   label: 'User ID',
    //   accessor: (row: any) => {
    //     const id = row.id || '';
    //     if (id.length <= 12) return id;
    //     return <span>{truncateText(id, 12)}</span>;
    //   },
    //   width: '15'
    // },
    {
      key: 'name',
      label: 'Name',
      accessor: 'name',
      width: '20'
    },
    {
      key: 'email',
      label: 'Email',
      accessor: 'email',
      width: '25'
    },
    {
      key: 'country',
      label: 'Country',
      accessor: (row: any) => {
        const code = row.countryCode;
        if (!code) return '';
        return (
          <div className={'flex items-center gap-2'}>
            <img src={`https://flagcdn.com/48x36/${code}.png`} alt={`${code}`} width={20} />
            {/*<span>{code}</span>*/}
          </div>
        );
      },
      width: '15'
    },
    {
      key: 'phone',
      label: 'Phone',
      accessor: 'phone',
      width: '15'
    }
  ];

  const rows = (data?.users?.entries || []).map((u: any) => ({
    id: u.id,
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    email: u.email,
    country: u.country || '',
    countryCode: toCountryCode(u.country),
    phone: u.phone || '',
    dateJoined: u.updatedAt ? moment(u.updatedAt).format('YYYY-MM-DD HH:mm') : ''
  }));

  const tableData = loading || error || !data ? [] : rows;

  const pageInfo = data?.users;

  const actions: TableAction[] = [
    {
      icon: (row: any) => (
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
                handleViewUser(row.id);
              }}
              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              <EyeIcon className="h-4 w-4 mr-2 " />
              <span className="text-gray-700">View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row);
                setEditOpen(true);
              }}
              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              <Pencil className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-700">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row);
                setSuspendOpen(true);
              }}
              className="cursor-pointer "
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              <span className="text-gray-700">Suspend</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row);
                setDeleteOpen(true);
              }}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem> */}
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
          <ModularHeaderTitle
            title="Users"
            count={pageInfo?.totalEntries ?? tableData.length}
            onSearch={(value: string) => {
              setSearch(value);
              setPage(1);
            }}
            onFilter={(filters: Record<string, any>) => {
              setCurrentFilters(filters);
              setPage(1);
            }}
            currentFilters={currentFilters}
            filterConfig={userListFilterConfig}
          >
            <DefaultModal trigger={<Button className="bg-blue-700">Add User</Button>} title="Add User">
              <div className="p-2">
                <AddUserAction />
              </div>
            </DefaultModal>
          </ModularHeaderTitle>
        </div>

        <StatusTabs
          tabs={[
            {
              key: 'active',
              label: 'Active users',
              count: currentFilters.status !== 'suspended' ? (pageInfo?.totalEntries ?? 0) : undefined
            },
            {
              key: 'suspended',
              label: 'Suspended users',
              count: currentFilters.status === 'suspended' ? (pageInfo?.totalEntries ?? 0) : undefined
            }
          ]}
          activeTab={currentFilters.status || 'active'}
          onTabChange={(tabKey) => {
            setCurrentFilters({ ...currentFilters, status: tabKey });
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
          if (!open) setSelectedUser(null);
        }}
        title={'Are you sure you want to delete this user?'}
        description={
          selectedUser
            ? `You won’t be able to recover ${selectedUser.name || 'this user'} once deleted`
            : 'You won’t be able to recover this user once deleted'
        }
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true);
          try {
            setDeleteOpen(false);
            setSelectedUser(null);
          } finally {
            setDeleting(false);
          }
        }}
        onCancel={() => {
          setSelectedUser(null);
        }}
      />

      {suspendOpen && (
        <DefaultModal
          open={suspendOpen}
          trigger={<></>}
          title={`Suspend User`}
          onClose={() => {
            setSuspendOpen(false);
            setSelectedUser(null);
            setSuspendReason('');
            setSuspendError(null);
          }}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSuspending(true);
              setSuspendError(null);
              setSuspendOpen(false);

              const toastId = toast.loading('Suspending user...');

              try {
                const res = await suspendUserMutation({
                  variables: {
                    userAccountId: selectedUser?.id,
                    reason: suspendReason
                  }
                });
                if (res?.data?.suspendUser?.success) {
                  toast.success('User suspended successfully', { id: toastId });
                  setSuspendOpen(false);
                  setSelectedUser(null);
                  setSuspendReason('');

                  refetch();
                } else {
                  const errorMsg = res?.data?.suspendUser?.message || 'Failed to suspend user';
                  toast.error(errorMsg, { id: toastId });
                  setSuspendError(errorMsg);
                }
              } catch (err: any) {
                const errorMsg = err?.message || 'Failed to suspend user';
                toast.error(errorMsg, { id: toastId });
                setSuspendError(errorMsg);
              } finally {
                setSuspending(false);
              }
            }}
            className="flex flex-col gap-4 p-2"
          >
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-1">
                Reason for suspension
              </label>
              <textarea
                id="reason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                required
              />
            </div>
            {/* {suspendError && <div className="text-red-600 text-sm">{suspendError}</div>} */}
            <div className="flex gap-2 ">
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => setSuspendOpen(false)}
                disabled={suspending}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white w-full" disabled={suspending}>
                {suspending ? (
                  <span className="flex items-center gap-2">
                    <Trash className="h-4 w-4 animate-spin" />
                    Suspending...
                  </span>
                ) : (
                  'Suspend User'
                )}
              </Button>
            </div>
          </form>
        </DefaultModal>
      )}

      {editOpen && selectedUser && (
        <DefaultModal
          open={editOpen}
          trigger={<></>}
          title="Edit User"
          onClose={() => {
            setEditOpen(false);
            setSelectedUser(null);
          }}
        >
          <div className="p-4">
            <AddUserAction
              isEdit={true}
              initialData={{
                id: selectedUser.id,
                firstName: selectedUser.name.split(' ')[0] || '',
                lastName: selectedUser.name.split(' ')[1] || '',
                email: selectedUser.email,
                phone: selectedUser.phone,
                country: selectedUser.country
              }}
              onSuccess={() => {
                setEditOpen(false);
                setSelectedUser(null);
                refetch();
              }}
            />
          </div>
        </DefaultModal>
      )}
    </DashboardLayout>
  );
}

export default UsersListPage;
