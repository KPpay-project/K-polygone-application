import { useTranslation } from 'react-i18next';
import HeaderTitle from '@/components/misc/header-title';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, EyeIcon } from 'lucide-react';
import { ModularCard } from '@/components/sub-modules/card/card';
import { StatCard } from '@/components/modules/stat-card';
import { useStatsData } from '@/hooks/use-stats-data';
import { cn } from '@/lib/utils';
import {
  Receipt,
  ReceiptAdd,
  ReceiptMinus,
  ReceiptItem
} from '@/components/modules/custom-icons/request-payment-icons';
import { ExportSquare, Edit2, Trash, CloseCircle, TickCircle, DocumentDownload } from 'iconsax-reactjs';

const RequestPaymentTransactions = () => {
  const { t } = useTranslation();

  const handleViewRequest = (id: string) => {
    console.log('View request payment:', id);
  };

  const handleEditRequest = (id: string) => {
    console.log('Edit request payment:', id);
  };

  const handleDeleteRequest = (id: string) => {
    console.log('Delete request payment:', id);
  };

  const handleApproveRequest = (id: string) => {
    console.log('Approve request payment:', id);
  };

  const handleRejectRequest = (id: string) => {
    console.log('Reject request payment:', id);
  };

  const handleDownloadReceipt = (id: string) => {
    console.log('Download receipt for payment:', id);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'Transaction ID', accessor: 'id', width: '15' },
    { key: 'userName', label: 'Requester', accessor: 'userName', width: '20' },
    { key: 'amount', label: 'Amount', accessor: 'amount', width: '15' },
    {
      key: 'status',
      label: 'Status',
      accessor: (row) => (
        <div
          className={cn(
            'flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit',
            row.status === 'Pending'
              ? 'bg-[#FEF9C3] border-[#CA8A04] border'
              : row.status === 'Approved'
                ? 'bg-[#F0FDF4] border-[#16A34A] border'
                : row.status === 'Rejected'
                  ? 'bg-[#FEF2F2] border-[#DC2626] border'
                  : 'bg-gray-100 border-gray-400 border'
          )}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              row.status === 'Pending'
                ? 'bg-[#CA8A04]'
                : row.status === 'Approved'
                  ? 'bg-[#16A34A]'
                  : row.status === 'Rejected'
                    ? 'bg-[#DC2626]'
                    : 'bg-gray-400'
            )}
          />
          <span
            className={cn(
              'text-sm font-light',
              row.status === 'Pending'
                ? 'text-[#B45309]'
                : row.status === 'Approved'
                  ? 'text-[#16A34A]'
                  : row.status === 'Rejected'
                    ? 'text-[#B91C1C]'
                    : 'text-gray-600'
            )}
          >
            {row.status}
          </span>
        </div>
      ),
      width: '15'
    },
    { key: 'date', label: 'Date', accessor: 'date', width: '15' },
    {
      key: 'action',
      label: 'Action',
      accessor: 'action',
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleViewRequest(row.id);
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4 text-blue-500" />
              <span>View Details</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleEditRequest(row.id);
              }}
            >
              <Edit2 className="mr-2 h-4 w-4 text-amber-500" />
              <span>Edit Request</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleApproveRequest(row.id);
              }}
            >
              <TickCircle className="mr-2 h-4 w-4 text-green-500" />
              <span>Approve</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleRejectRequest(row.id);
              }}
            >
              <CloseCircle className="mr-2 h-4 w-4 text-red-500" />
              <span>Reject</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReceipt(row.id);
              }}
            >
              <DocumentDownload className="mr-2 h-4 w-4 text-purple-500" />
              <span>Download Receipt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRequest(row.id);
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4 text-red-600" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const data = [
    {
      id: 'BD9302D348CB',
      userName: 'Boma Agina-obu',
      email: 'bomaaginaobu@gmail.com',
      amount: '$2000',
      status: 'Pending',
      date: '12/20/2024, 12:45'
    },
    {
      id: 'KL7845P209RT',
      userName: 'John Smith',
      email: 'johnsmith@example.com',
      amount: '$1500',
      status: 'Approved',
      date: '12/19/2024, 10:30'
    },
    {
      id: 'MN5632Q178WS',
      userName: 'Sarah Johnson',
      email: 'sarahj@example.com',
      amount: '$3200',
      status: 'Rejected',
      date: '12/18/2024, 15:20'
    },
    {
      id: 'PQ9021R567TU',
      userName: 'Michael Brown',
      email: 'mbrown@example.com',
      amount: '$750',
      status: 'Pending',
      date: '12/17/2024, 09:15'
    }
  ];

  return (
    <div className="space-y-4 p-8">
      <HeaderTitle
        title={t('common.requestPayment')}
        count={data.length}
        searchPlaceholder={t('common.searchPlaceholder')}
        onSearch={(value) => console.log('Search:', value)}
        onFilter={() => console.log('Filter clicked')}
        showSearch
        showFilter
      >
        <Button>
          <ExportSquare />
          Export
        </Button>
      </HeaderTitle>

      <ModularCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {useStatsData(
            'transaction',
            {
              total: '89,935',
              successful: '89,935',
              failed: '89,935',
              pending: '89,935'
            },
            {
              total: <Receipt className="h-5 w-5 text-white" />,
              successful: <ReceiptAdd className="h-5 w-5 text-white" />,
              failed: <ReceiptMinus className="h-5 w-5 text-white" />,
              pending: <ReceiptItem className="h-5 w-5 text-white" />
            }
          ).map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              colorScheme={stat.colorScheme}
            />
          ))}
        </div>
      </ModularCard>

      <ResponsiveTable
        data={data}
        columns={columns}
        actions={[
          {
            icon: <EyeIcon className="h-4 w-4" />,
            onClick: (row) => handleViewRequest(row.id),
            className: 'text-gray-400 hover:text-gray-600'
          },
          {
            icon: <Edit2 className="h-4 w-4" />,
            onClick: (row) => handleEditRequest(row.id),
            className: 'text-gray-400 hover:text-amber-600'
          },
          {
            icon: <Trash className="h-4 w-4" />,
            onClick: (row) => handleDeleteRequest(row.id),
            className: 'text-gray-400 hover:text-red-600'
          }
        ]}
        showCheckbox
      />
    </div>
  );
};

export default RequestPaymentTransactions;
