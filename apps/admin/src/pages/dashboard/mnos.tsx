import DashboardLayout from '@/components/layouts/dashboard-layout';
import { EyeIcon, Pencil, Trash, MoreHorizontal } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ResponsiveTable, TableColumn, TableAction } from '@/components/common/responsive-table';
import { cn } from '@/lib/utils';
import HeaderTitle from '@/components/misc/header-title';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_MNOS, mutation_CREATE_MONOS } from '@repo/api';
import { CustomModal, CountrySelector } from '@repo/ui';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { countries } from '@/utils/constants';
import { toast } from 'sonner';

function MnosPage() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMno, setNewMno] = useState({ countryId: '', name: '' });

  const { data, loading, error, refetch } = useQuery(LIST_MNOS, {
    variables: { page: 1, perPage: 10 }
  });

  const [createMno, { loading: creating }] = useMutation(mutation_CREATE_MONOS, {
    onCompleted: (data) => {
      if (data?.createMno?.success) {
        toast.success(data.createMno.message || 'MNO created successfully');
        setIsAddModalOpen(false);
        setNewMno({ countryId: '', name: '' });
        refetch();
      } else {
        toast.error(data?.createMno?.errors?.[0]?.message || 'Failed to create MNO');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create MNO');
    }
  });

  const handleCreate = () => {
    if (!newMno.countryId || !newMno.name) {
      toast.error('Please fill all fields');
      return;
    }
    createMno({
      variables: {
        input: {
          countryId: newMno.countryId,
          name: newMno.name
        }
      }
    });
  };

  const handleView = (id: string) => {
    navigate({ to: '/dashboard/user-profile', search: { userId: id } });
  };

  const apiEntries = data?.mnos?.entries ?? [];
  const tableData = apiEntries.map((row: any) => ({
    id: row?.id ?? row?.country?.id ?? '',
    name: row?.name ?? row?.country?.name ?? '—',
    subtitle: row?.subtitle ?? '',
    currency: row?.currency ?? '—',
    country: row?.country?.name ?? '—',
    countryFlag: row?.country?.countryFlag ?? '🏳️',
    logoText: row?.logoText ?? (row?.name ? String(row.name).slice(0, 4) : 'mno'),
    status: row?.status ?? '—',
    timezone: row?.timezone ?? '—'
  }));

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.subtitle}</span>
        </div>
      ),
      width: '28'
    },
    {
      key: 'currency',
      label: 'Currency',
      accessor: 'currency',
      width: '10'
    },
    {
      key: 'country',
      label: 'Country',
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.countryFlag}</span>
          <span>{row.country}</span>
        </div>
      ),
      width: '16'
    },
    {
      key: 'logo',
      label: 'Logo',
      accessor: (row: any) => (
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] uppercase">
          {row.logoText}
        </div>
      ),
      width: '10'
    },
    {
      key: 'status',
      label: 'Status',
      accessor: (row: any) => (
        <div
          className={cn(
            'flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit',
            row.status === 'Active' ? 'bg-[#F0FDF4] border-[#16A34A] border' : 'bg-[#FEF2F2] border-[#DC2626] border'
          )}
        >
          <div className={cn('w-2 h-2 rounded-full', row.status === 'Active' ? 'bg-[#16A34A]' : 'bg-[#DC2626]')} />
          <span className={cn('text-sm font-light', row.status === 'Active' ? 'text-[#16A34A]' : 'text-[#B91C1C]')}>
            {row.status}
          </span>
        </div>
      ),
      width: '12'
    },
    {
      key: 'timezone',
      label: 'Time zone',
      accessor: 'timezone',
      width: '10'
    }
  ];

  const actions: TableAction[] = [
    {
      icon: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleView(row.id);
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
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
            title="MNOs"
            count={data?.mnos?.totalEntries ?? 0}
            onSearch={(value) => {
              refetch({ page: 1, perPage: 10, search: value });
            }}
            onFilter={() => console.log('Filter clicked')}
          >
            <Button onClick={() => setIsAddModalOpen(true)}>Add MNO</Button>
          </HeaderTitle>
        </div>

        <div>
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading MNOs…</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600">Failed to load MNOs: {error.message}</div>
          ) : tableData.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="text-base mb-2">No MNOs found</div>
              <div className="text-sm">Try adjusting your search or add a new MNO.</div>
            </div>
          ) : (
            <ResponsiveTable data={tableData} columns={columns} actions={actions} showCheckbox />
          )}
        </div>
      </div>
      <CustomModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add MNO"
        description="Enter the details of the new Mobile Network Operator."
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <CountrySelector
              countries={countries}
              value={newMno.countryId}
              onValueChange={(_val, country) => setNewMno({ ...newMno, countryId: country?.code || '' })}
              placeholder="Select Country"
              showPrefix={false}
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="MNO Name"
              value={newMno.name}
              onChange={(e) => setNewMno({ ...newMno, name: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create MNO'}
            </Button>
          </div>
        </div>
      </CustomModal>
    </DashboardLayout>
  );
}

export default MnosPage;
