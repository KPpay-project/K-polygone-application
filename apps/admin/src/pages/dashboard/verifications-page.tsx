import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { EyeIcon } from 'lucide-react';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import HeaderTitle from '@/components/misc/header-title';
import { GET_ALL_KYC_APPLICATIONS } from '@repo/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '@/components/ui/status-badge';
import StatusTabs from '@/components/misc/status-tabs';

function VerificationsPage() {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const variables = useMemo(
    () => ({
      page,
      perPage,
      sortBy: 'updatedAt',
      sortDirection: 'desc' as const,
      search: search || undefined,
      filters: statusFilter && statusFilter !== 'All' ? { status: statusFilter.toLowerCase() } : undefined
    }),
    [page, perPage, search, statusFilter]
  );

  const { data, loading, error, refetch } = useQuery(GET_ALL_KYC_APPLICATIONS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || 'U';
  };

  const handleViewApplication = (applicationId: string) => {
    window.location.href = `/dashboard/verifications/${applicationId}`;
  };

  const columns: TableColumn[] = [
    { key: 'date', label: 'Date', accessor: 'date', width: '15' },
    {
      key: 'userInfo',
      label: 'Username/Email',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
              {getInitials(row.firstName, row.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.fullName}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      width: '25'
    },

    {
      key: 'documentType',
      label: 'Document Submitted',
      accessor: 'documentType',
      width: '15'
    },
    {
      key: 'submissionDate',
      label: 'Submission Date',
      accessor: 'submissionDate',
      width: '15'
    },
    {
      key: 'status',
      label: 'Status',
      accessor: (row: any) => <StatusBadge status={row.status} />,
      width: '10'
    }
  ];

  const rows = (data?.allKycApplications || []).map((kyc: any, index: number) => {
    const firstName = kyc.personalInfo?.firstName || '';
    const lastName = kyc.personalInfo?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const email = kyc.userAccount?.email || `${kyc.userAccount?.id}@noemail.com`;
    const documentType = kyc.identityDocument?.documentType || 'Not submitted';
    const status = kyc.status || 'unknown';

    // mock varying dates since insertedAt is missing in your sample
    const createdAt = moment().subtract(index, 'days').toISOString();

    return {
      id: kyc.id,
      date: moment(createdAt).format('YYYY-MM-DD'),
      firstName,
      lastName,
      fullName: fullName || 'Unknown User',
      email,
      documentType,
      submissionDate: moment(createdAt).format('YYYY-MM-DD HH:mm'),
      status,
      originalData: kyc
    };
  });

  const tableData = loading || error || !data ? [] : rows;

  const pageInfo = {
    pageNumber: 1,
    pageSize: perPage,
    totalEntries: tableData.length,
    totalPages: Math.ceil(tableData.length / perPage)
  };

  const actions: TableAction[] = [
    {
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: (row) => handleViewApplication(row.id),
      className: 'text-gray-400 hover:text-gray-600'
    }
  ];

  const statusTabs = [
    { key: 'All', label: 'All KYCs' },
    { key: 'Pending', label: 'Pending Review' },
    { key: 'Approved', label: 'Approved KYCs' },
    { key: 'Rejected', label: 'Rejected KYCs' }
  ];
  return (
    <div className="flex flex-col gap-4">
      <HeaderTitle
        title="KYC Verifications"
        count={pageInfo?.totalEntries ?? tableData.length}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        showFilter={false}
      />
      <StatusTabs tabs={statusTabs} activeTab={statusFilter} onTabChange={setStatusFilter} />
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
  );
}

export default VerificationsPage;
