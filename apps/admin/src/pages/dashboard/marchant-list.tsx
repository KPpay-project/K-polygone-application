import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { EyeIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import HeaderTitle from '@/components/misc/header-title';
import StatusTabs from '@/components/misc/status-tabs';
import { ExportSquare } from 'iconsax-reactjs';
import DefaultModal from '@/components/sub-modules/popups/modal';
import AddMarchantAction from '@/components/add-marchant-action';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MERCHANTS } from '@/lib/graphql/queries/merchants';
import DeleteAction from '@/components/actions/delete-action';

function MarchantListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const sortBy = 'updatedAt';
  const sortDirection: 'asc' | 'desc' = 'desc';
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedMerchant, setSelectedMerchant] = useState<any | null>(null);

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

  const { data, loading, error, refetch } = useQuery(GET_MERCHANTS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    refetch(variables);
  }, [variables, refetch]);

  const handleViewMerchant = (merchantId: string) => {
    navigate({ to: '/dashboard/user-profile', search: { userId: merchantId } });
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'Merchant ID', accessor: 'id' },
    { key: 'name', label: 'Business Name', accessor: 'name' },
    { key: 'email', label: 'Email', accessor: 'email' },
    {
      key: 'country',
      label: 'Country',
      accessor: (row: any) => {
        const code = row.countryCode;
        if (!code) return '';
        return (
          <div
            className="w-8 h-8 rounded-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(https://flagcdn.com/48x36/${code}.png)` }}
            aria-label={row.country || 'Country'}
            title={row.country || ''}
          />
        );
      }
    },
    { key: 'status', label: 'Status', accessor: 'status' },
    { key: 'phone', label: 'Phone', accessor: 'phone' },
    { key: 'dateJoined', label: 'Date Joined', accessor: 'dateJoined' }
  ];

  const toTitle = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

  const rows = (data?.merchants?.entries || []).map((m: any) => ({
    id: m.id,
    name: m.businessName || '',
    email: m.email,
    country: m.country || '',
    countryCode: toCountryCode(m.country),
    status: toTitle(m.status) || 'Active',
    phone: m.phone || '',
    dateJoined: m.updatedAt ? new Date(m.updatedAt).toLocaleString() : ''
  }));

  const tableData = loading || error || !data ? [] : rows;
  const pageInfo = data?.merchants;

  const actions: TableAction[] = [
    {
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: (row) => handleViewMerchant(row.id),
      className: 'text-gray-400 hover:text-gray-600'
    },
    {
      icon: <TrashIcon className="h-4 w-4" />,
      onClick: (row: any) => {
        setSelectedMerchant(row);
        setDeleteOpen(true);
      },
      className: 'text-gray-400 hover:text-red-600'
    }
  ];

  return (
    <DashboardLayout>
      <div>
        <div>
          <HeaderTitle
            title="Merchants"
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
            filterOptions={['All', 'Approved', 'Pending', 'Rejected', 'Suspended', 'Inactive', 'Active']}
          >
            <div className="flex gap-2">
              <DefaultModal trigger={<Button className="bg-blue-700">Add Merchant</Button>} title="Add Merchant">
                <div className="p-2">
                  <AddMarchantAction />
                </div>
              </DefaultModal>
              <Button variant="outline">
                <ExportSquare />
                Export
              </Button>
            </div>
          </HeaderTitle>
        </div>

        <StatusTabs
          tabs={[
            {
              key: 'active',
              label: 'Active merchants',
              count: statusFilter === 'Active' ? (pageInfo?.totalEntries ?? 0) : undefined
            },
            // {
            //   key: 'pending',
            //   label: 'Pending merchants',
            //   count: statusFilter === 'Pending' ? pageInfo?.totalEntries ?? 0 : undefined
            // },
            {
              key: 'suspended',
              label: 'Suspended merchants',
              count: statusFilter === 'Suspended' ? (pageInfo?.totalEntries ?? 0) : undefined
            }
          ]}
          activeTab={statusFilter.toLowerCase()}
          onTabChange={(tabKey) => {
            const newStatus = tabKey === 'active' ? 'Active' : tabKey === 'pending' ? 'Pending' : 'Suspended';
            setStatusFilter(newStatus);
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
          if (!open) setSelectedMerchant(null);
        }}
        title={'Are you sure you want to delete this merchant?'}
        description={
          selectedMerchant
            ? `You won’t be able to recover ${selectedMerchant.name || 'this merchant'} once deleted`
            : 'You won’t be able to recover this merchant once deleted'
        }
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true);
          try {
            setDeleteOpen(false);
            setSelectedMerchant(null);
          } finally {
            setDeleting(false);
          }
        }}
        onCancel={() => {
          setSelectedMerchant(null);
        }}
      />
    </DashboardLayout>
  );
}

export default MarchantListPage;
