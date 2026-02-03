import { useTranslation } from 'react-i18next';
import HeaderTitle from '@/components/misc/header-title';
import ResponsiveTable from '@/components/common/responsive-table/responsive-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, EyeIcon } from 'lucide-react';

const ExchangeTransactions = () => {
  const { t } = useTranslation();

  const handleViewExchange = (id: string) => {
    console.log('View exchange:', id);
  };

  const columns = [
    { key: 'id', label: 'Transaction ID', accessor: 'id' },
    { key: 'userName', label: 'User/Name', accessor: 'userName' },
    { key: 'sourceAmount', label: 'Source & Amount', accessor: 'sourceAmount' },
    { key: 'targetAmount', label: 'Target & Amount', accessor: 'targetAmount' },
    { key: 'rate', label: 'Rate', accessor: 'rate' },
    { key: 'date', label: 'Date', accessor: 'date' },
    { key: 'status', label: 'Status', accessor: 'status' },
    {
      key: 'action',
      label: 'Action',
      accessor: 'action',
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleViewExchange(row.id);
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const data = [
    {
      id: 'BD93D2D348CB',
      userName: 'Boma Agina-obu',
      email: 'bomaaginaobu@gmail.com',
      sourceAmount: 'USD/500',
      targetAmount: 'XOF/2450',
      rate: '$1 = 267OF',
      status: 'Successful',
      date: '12/10/2024, 12:45'
    }
  ];

  return (
    <div className="space-y-4 p-8">
      <HeaderTitle
        title={t('common.exchange')}
        count={data.length}
        searchPlaceholder={t('common.searchPlaceholder')}
        onSearch={(value) => console.log('Search:', value)}
        onFilter={() => console.log('Filter clicked')}
        showSearch
        showFilter
      />

      <ResponsiveTable data={data} columns={columns} />
    </div>
  );
};

export default ExchangeTransactions;
