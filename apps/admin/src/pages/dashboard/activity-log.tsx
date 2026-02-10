import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { ExportSquare } from 'iconsax-reactjs';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import ModularHeaderTitle from '@/components/misc/modular-header-title';
import ItemDescriptionModal from '@/components/sub-modules/modal-contents/item-description-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useState, useCallback, useRef, useEffect } from 'react';
import useActivityLogs, { ActivityLog } from '@/hooks/api/use-activity-logs';
import { toast } from 'sonner';
import { activityLogFilterConfig } from '@/config/filter-configs';
import moment from 'moment';

function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({
    activityType: 'all',
    status: 'all'
  });
  const [selectedItem, setSelectedItem] = useState<ActivityLog['entries'] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

  const { loading, error, data, updateFilters, pageInfo } = useActivityLogs({
    page,
    perPage,
    search: searchTerm.trim() || undefined,
    statusFilter: filters.status !== 'all' ? filters.status : undefined,
    sortBy: 'activity',
    sortDirection: 'asc'
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setPage(1);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        updateFilters({
          page: 1,
          search: value.trim() || undefined,
          statusFilter: filters.status !== 'all' ? filters.status : undefined
        });
      }, 500);
    },
    [updateFilters, filters]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
    updateFilters({
      page: 1,
      search: searchTerm.trim() || undefined,
      statusFilter: newFilters.status !== 'all' ? newFilters.status : undefined
    });
  };

  const handleExport = () => {
    // Transform data to match table structure
    const transformedData = Array.isArray(data) ? data : [];

    if (!Array.isArray(transformedData) || !transformedData.length) {
      toast.error('No data available to export');
      return;
    }

    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) {
        return 'Nil';
      }
      const stringValue = String(value);

      if (
        stringValue.includes('"') ||
        stringValue.includes(',') ||
        stringValue.includes('\n') ||
        stringValue.includes('\r')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvRows = [['Date', 'User', 'Email', 'Role', 'Activity', 'IP Address', 'Status', 'Location']];

    // Process data rows
    if (Array.isArray(transformedData)) {
      transformedData.forEach((entry: ActivityLog['entries']) => {
        if (!entry) return;

        const user = entry.userAccount?.user || entry.userAccount?.admin || entry.userAccount?.merchant;
        let userName = 'Unknown User';
        let userRole = 'Nil';

        if (user) {
          if ('businessName' in user) {
            userName = user.businessName || 'Unknown Business';
            userRole = 'Merchant';
          } else if ('firstName' in user && 'lastName' in user) {
            userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
            userRole = entry.userAccount?.admin ? 'Admin' : 'User';
          }
        }
        const userEmail = user?.email || 'Nil';
        const activityDate = entry.insertedAt ? moment(entry.insertedAt).format('DD MMM YYYY, hh:mm A') : 'Nil';

        const getExportDisplayStatus = (status: string) => {
          const statusLower = status.toLowerCase();
          if (statusLower === 'success' || statusLower === 'successful' || statusLower === 'completed') {
            return 'Successful';
          }
          if (statusLower === 'error' || statusLower === 'failed' || statusLower === 'failure') {
            return 'Failed';
          }
          if (statusLower === 'pending' || statusLower === 'processing' || statusLower === 'in_progress') {
            return 'Pending';
          }
          return status.charAt(0).toUpperCase() + status.slice(1);
        };

        const rowData = [
          escapeCsvValue(activityDate),
          escapeCsvValue(userName),
          escapeCsvValue(userEmail),
          escapeCsvValue(userRole),
          escapeCsvValue(entry.activity || 'Nil'),
          escapeCsvValue(entry.ipAddress || 'Nil'),
          escapeCsvValue(getExportDisplayStatus(entry.status || 'Nil')),
          escapeCsvValue(entry.location || 'Nil')
        ];

        csvRows.push(rowData);
      });
    }

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity-log-${moment().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Activity log exported successfully');
  };

  const formatDate = (dateString: string) => {
    const date = moment(dateString);
    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    let dayLabel = '';
    if (date.isSame(today, 'day')) {
      dayLabel = 'Today';
    } else if (date.isSame(yesterday, 'day')) {
      dayLabel = 'Yesterday';
    } else {
      dayLabel = date.format('DD MMM YYYY');
    }

    return (
      <div className="text-sm">
        <div className="font-medium">{dayLabel}</div>
        <div className="text-gray-500">{date.format('DD MMM YYYY, hh:mm A')}</div>
      </div>
    );
  };

  const getUserInfo = (log: ActivityLog['entries']) => {
    const entry = log;
    if (!entry) {
      return {
        name: 'Unknown User',
        email: 'Nil',
        role: 'Nil'
      };
    }

    const user = entry.userAccount?.user || entry.userAccount?.admin || entry.userAccount?.merchant;

    if (!user) {
      return {
        name: 'Unknown User',
        email: 'Nil',
        role: entry.userAccount?.role || 'Nil'
      };
    }

    if ('firstName' in user) {
      return {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: entry.userAccount?.role || 'Nil'
      };
    } else {
      return {
        name: user.businessName,
        email: user.email,
        role: 'Merchant'
      };
    }
  };

  const getDisplayStatus = (log: ActivityLog['entries']) => {
    const entry = log;
    if (!entry) return 'Unknown';

    const status = entry.status.toLowerCase();

    if (status === 'success' || status === 'successful' || status === 'completed') {
      return 'Successful';
    }
    if (status === 'error' || status === 'failed' || status === 'failure') {
      return 'Failed';
    }
    if (status === 'pending' || status === 'processing' || status === 'in_progress') {
      return 'Pending';
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const columns: TableColumn[] = [
    {
      key: 'user',
      label: 'User',
      accessor: (row: ActivityLog['entries']) => {
        const userInfo = getUserInfo(row);
        return <UserAvatar name={userInfo.name} email={userInfo.email} size="sm" />;
      },
      width: '12'
    },
    {
      key: 'role',
      label: 'Role',
      accessor: (row: ActivityLog['entries']) => {
        const userInfo = getUserInfo(row);
        return <span className="text-sm font-medium">{userInfo.role}</span>;
      },
      width: 'auto'
    },
    {
      key: 'activity',
      label: 'Activity',
      accessor: (row: ActivityLog['entries']) => {
        const entry = row;
        return <span className="text-blue-600 text-sm">{entry?.activity || 'Nil'}</span>;
      },
      width: '12'
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      accessor: (row: ActivityLog['entries']) => {
        const entry = row;
        return <span className="text-sm">{entry?.ipAddress || 'Nil'}</span>;
      },
      width: '16'
    },
    {
      key: 'status',
      label: 'Status',
      accessor: (row: ActivityLog['entries']) => <StatusBadge status={getDisplayStatus(row)} />,
      width: '18'
    },
    {
      key: 'date',
      label: 'Date',
      accessor: (row: ActivityLog['entries']) => {
        const entry = row;
        return entry ? formatDate(entry.insertedAt) : 'Nil';
      },
      width: '12'
    }
  ];

  const handleViewDetails = (row: ActivityLog['entries']) => {
    setSelectedItem(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const mapStatusToModalStatus = (log: ActivityLog['entries']): 'Verified' | 'Pending' | 'Failed' => {
    const status = getDisplayStatus(log);
    switch (status.toLowerCase()) {
      case 'successful':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Failed';
    }
  };

  const actions: TableAction[] = [
    {
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: handleViewDetails,
      className: 'text-gray-400 hover:text-gray-600'
    }
  ];

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <ModularHeaderTitle
            title="Activity log"
            searchPlaceholder="Search by user, email, activity..."
            onSearch={handleSearch}
            onFilter={handleFilter}
            showSearch={true}
            showFilter={true}
            currentFilters={filters}
            filterConfig={activityLogFilterConfig}
          >
            <Button className="bg-blue-700 flex items-center gap-2 hover:bg-blue-800" onClick={handleExport}>
              <ExportSquare className="h-4 w-4" />
              Export
            </Button>
          </ModularHeaderTitle>

          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Activity Logs</div>
            <div className="text-gray-500 mb-4">
              {error.message || 'Unable to load activity logs. Please try again.'}
            </div>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ModularHeaderTitle
          title="Activity log"
          searchPlaceholder="Search by user, email, activity..."
          onSearch={handleSearch}
          onFilter={handleFilter}
          showSearch={true}
          showFilter={true}
          currentFilters={filters}
          filterConfig={activityLogFilterConfig}
        >
          <Button
            className="bg-blue-700 flex items-center gap-2 hover:bg-blue-800"
            onClick={handleExport}
            disabled={loading || !Array.isArray(data) || data.length === 0}
          >
            <ExportSquare className="h-4 w-4" />
            Export
          </Button>
        </ModularHeaderTitle>

        <div className="bg-white rounded-lg">
          <ResponsiveTable
            data={Array.isArray(data) ? data : []}
            columns={columns}
            actions={actions}
            showCheckbox={true}
            showPagination={true}
            loading={loading}
            page={pageInfo?.pageNumber ?? page}
            perPage={pageInfo?.pageSize ?? perPage}
            totalEntries={pageInfo?.totalEntries ?? 0}
            totalPages={pageInfo?.totalPages ?? 1}
            onPageChange={(p) => {
              setPage(p);
              updateFilters({
                page: p,
                perPage,
                search: searchTerm.trim() || undefined,
                statusFilter: filters.status !== 'all' ? filters.status : undefined,
                // roleFilter: filters.role !== 'all' ? filters.role : undefined,
                // dateFrom: filters.dateFrom || undefined,
                // dateTo: filters.dateTo || undefined,
                sortBy: 'activity',
                sortDirection: 'asc'
              });
            }}
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
              updateFilters({
                page: 1,
                perPage: n,
                search: searchTerm.trim() || undefined,
                statusFilter: filters.status !== 'all' ? filters.status : undefined,
                // roleFilter: filters.role !== 'all' ? filters.role : undefined,
                // dateFrom: filters.dateFrom || undefined,
                // dateTo: filters.dateTo || undefined,
                sortBy: 'activity',
                sortDirection: 'asc'
              });
            }}
          />
        </div>

        {!loading && (!data || !Array.isArray(data) || data.length === 0) && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-gray-500 text-lg font-semibold mb-2">No Activity Logs Found</div>
            <div className="text-gray-400">
              {searchTerm || filters.status !== 'all' || filters.activityType !== 'all'
                ? 'No activity logs match your current filters. Try adjusting your search or filter criteria.'
                : 'No activity logs are available at this time.'}
            </div>
          </div>
        )}
      </div>

      {/* Item Description Modal */}
      {selectedItem && selectedItem && (
        <ItemDescriptionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Activity Details"
          userInfo={{
            name: getUserInfo(selectedItem).name,
            email: getUserInfo(selectedItem).email,
            avatar: ``,
            status: mapStatusToModalStatus(selectedItem)
          }}
          activities={{
            title: `Activity on ${moment(selectedItem.insertedAt).format('DD MMM YYYY')}`,
            items: [
              {
                time: moment(selectedItem.insertedAt).format('hh:mm A'),
                content: selectedItem.activity
              },
              ...(selectedItem.transaction
                ? [
                    {
                      time: moment(selectedItem.insertedAt).format('hh:mm A'),
                      content: `Transaction: ${selectedItem.transaction.transactionType} - ${selectedItem.transaction.reference}`
                    }
                  ]
                : []),
              ...(selectedItem.kycApplication
                ? [
                    {
                      time: moment(selectedItem.insertedAt).format('hh:mm A'),
                      content: `KYC Application: ${selectedItem.kycApplication.status} - ${selectedItem.kycApplication.kycClientType || 'Nil'}`
                    }
                  ]
                : [])
            ]
          }}
          geoLocation={{
            title: 'Technical Info',
            data: {
              ipAddress: selectedItem.ipAddress || 'Not available',
              device: selectedItem.deviceInfo || 'Not available',
              location: selectedItem.location || 'Not tracked'
            }
          }}
          linkItems={{
            title: 'Related Items',
            items: [
              ...(selectedItem.transaction ? [`View Transaction ${selectedItem.transaction.reference}`] : []),
              ...(selectedItem.kycApplication ? [`View KYC Application ${selectedItem.kycApplication.id}`] : []),
              ...(selectedItem.userAccount?.walletCode ? [`View Wallet ${selectedItem.userAccount.walletCode}`] : [])
            ],
            onLinkClick: (link) => {
              console.log('Link clicked:', link);
              toast.info('Navigation not implemented yet');
            }
          }}
          supportingDocuments={{
            title: 'Additional Data',
            items: [
              ...(selectedItem.transaction
                ? [
                    {
                      name: `transaction-${selectedItem.transaction.id}.json`,
                      icon: '',
                      size: `${JSON.stringify(selectedItem.transaction).length} bytes`
                    }
                  ]
                : []),
              ...(selectedItem.kycApplication
                ? [
                    {
                      name: `kyc-application-${selectedItem.kycApplication.id}.json`,
                      icon: '',
                      size: `${JSON.stringify(selectedItem.kycApplication).length} bytes`
                    }
                  ]
                : [])
            ],
            onDocumentDelete: () => {
              toast.info('Document viewing not implemented yet');
            }
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default ActivityLogPage;
