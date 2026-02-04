import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import { cn } from '@/lib/utils';
import HeaderTitle from '@/components/misc/header-title';
import DefaultModal from '@/components/sub-modules/popups/modal';
import ReusableSheet from '@/components/shared/reusable-sheet';
import { useQuery } from '@apollo/client';
import { LIST_DISPUTES } from '@/lib/graphql/queries/dispute';
import moment from 'moment';
import PreviewAndUpdateDisputeAction from '@/components/actions/preview-and-update-dispute-action';
import { useState } from 'react';

function DisputePage() {
  const { data, loading, error, refetch } = useQuery(LIST_DISPUTES, {
    variables: { page: 1, perPage: 10 }
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const tableData: any[] = (data?.disputes?.entries || []).map((d: any) => {
    const user = d.customer?.user;

    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—';
    return {
      id: d.id,
      customerId: d.customer?.id,
      ticketNumber: d.ticketNumber,
      ticketSubject: d.ticketSubject,
      customerName: name,
      email: user?.email || '—',
      phone: user?.phone || '—',
      walletCode: d.customer?.walletCode || '—',
      priority: d.priority,
      status: d.status,
      insertedAt: d.insertedAt,
      updatedAt: d.updatedAt,
      resolvedAt: d.resolvedAt,
      message: d.message,
      customerStatus: d.customer?.status
    };
  });

  const priorityStyles = (priority?: string) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return { wrap: 'bg-red-50 border border-red-500', dot: 'bg-red-600', text: 'text-red-700' };
      case 'medium':
        return { wrap: 'bg-amber-50 border border-amber-500', dot: 'bg-amber-600', text: 'text-amber-700' };
      case 'low':
        return { wrap: 'bg-emerald-50 border border-emerald-500', dot: 'bg-emerald-600', text: 'text-emerald-700' };
      default:
        return { wrap: 'bg-slate-50 border border-slate-300', dot: 'bg-slate-400', text: 'text-slate-700' };
    }
  };

  const statusStyles = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return { wrap: 'bg-yellow-50 border border-yellow-500', dot: 'bg-yellow-500', text: 'text-yellow-700' };
      case 'resolved':
        return { wrap: 'bg-emerald-50 border border-emerald-500', dot: 'bg-emerald-600', text: 'text-emerald-700' };
      case 'closed':
        return { wrap: 'bg-slate-50 border border-slate-400', dot: 'bg-slate-500', text: 'text-slate-700' };
      default:
        return { wrap: 'bg-slate-50 border border-slate-300', dot: 'bg-slate-400', text: 'text-slate-700' };
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'ticketNumber',
      label: 'Ticket #',
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.ticketNumber}</span>
          <span className="text-xs text-muted-foreground">{row.ticketSubject}</span>
        </div>
      ),
      width: '26'
    },
    {
      key: 'customer',
      label: 'Customer',
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.customerName}</span>
          <span className="text-xs text-muted-foreground">{row.walletCode}</span>
        </div>
      ),
      width: '22'
    },
    {
      key: 'contact',
      label: 'Contact',
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="text-xs">{row.email}</span>
          <span className="text-xs text-muted-foreground">{row.phone}</span>
        </div>
      ),
      width: '22'
    },
    {
      key: 'priority',
      label: 'Priority',
      accessor: (row: any) => {
        const styles = priorityStyles(row.priority);
        return (
          <div className={cn('flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit', styles.wrap)}>
            <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
            <span className={cn('text-sm font-light', styles.text)}>{row.priority}</span>
          </div>
        );
      },
      width: '12'
    },
    {
      key: 'status',
      label: 'Status',
      accessor: (row: any) => {
        const styles = statusStyles(row.status);
        return (
          <div className={cn('flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit', styles.wrap)}>
            <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
            <span className={cn('text-sm font-light', styles.text)}>{row.status}</span>
          </div>
        );
      },
      width: '12'
    },
    {
      key: 'insertedAt',
      label: 'Created',
      accessor: (row: any) => <span className="text-sm">{moment(row.insertedAt).format('ll')}</span>,
      width: '16'
    }
  ];

  return (
    <DashboardLayout>
      <div>
        <div>
          <HeaderTitle
            title="Disputes"
            count={data?.disputes?.totalEntries ?? 0}
            onSearch={(value) => {
              refetch({ page: 1, perPage: 10, search: value });
            }}
            onFilter={() => console.log('Filter clicked')}
          >
            <DefaultModal trigger={<Button className="bg-blue-700">Add Dispute</Button>} title="Add Dispute">
              <div className="p-4 min-w-[420px]">
                <div className="text-sm text-muted-foreground">Coming soon</div>
              </div>
            </DefaultModal>
          </HeaderTitle>
        </div>

        <div>
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading disputes…</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600">Failed to load disputes: {error.message}</div>
          ) : tableData.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="text-base mb-2">No disputes found</div>
              <div className="text-sm">Try adjusting your search or date filters.</div>
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={tableData}
                columns={columns}
                onRowClick={(row: any) => {
                  setSelected(row);
                  setOpen(true);
                }}
                showCheckbox
              />
              <ReusableSheet open={open} onOpenChange={setOpen} title="Dispute preview">
                <PreviewAndUpdateDisputeAction dispute={selected} />
              </ReusableSheet>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DisputePage;
