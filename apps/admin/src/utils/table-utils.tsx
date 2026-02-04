import { TableColumn } from '@/components/common/responsive-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { UserAvatar } from '@/components/ui/user-avatar';

// Common column factory functions
export const createDateColumn = (key: string = 'date', label: string = 'Date', width: string = '12'): TableColumn => ({
  key,
  label,
  accessor: (row: any) => {
    const dateParts = row[key].split('\\n');
    return (
      <div className="text-sm">
        <div className="font-medium">{dateParts[0]}</div>
        <div className="text-gray-500">{dateParts[1]}</div>
      </div>
    );
  },
  width
});

export const createUserColumn = (
  key: string = 'userName',
  label: string = 'User Name',
  width: string = '25',
  emailKey: string = 'email'
): TableColumn => ({
  key,
  label,
  accessor: (row: any) => <UserAvatar name={row[key]} email={row[emailKey]} size="md" showEmail={true} />,
  width
});

export const createStatusColumn = (
  key: string = 'status',
  label: string = 'Status',
  width: string = '18',
  statusConfig?: Record<string, any>
): TableColumn => ({
  key,
  label,
  accessor: (row: any) => <StatusBadge status={row[key]} statusConfig={statusConfig} />,
  width
});

export const createTextColumn = (
  key: string,
  label: string,
  width: string = 'auto',
  className?: string
): TableColumn => ({
  key,
  label,
  accessor: key,
  width,
  className
});

export const createCustomColumn = (
  key: string,
  label: string,
  accessor: string | ((row: any) => any),
  width: string = 'auto',
  className?: string
): TableColumn => ({
  key,
  label,
  accessor,
  width,
  className
});

// Activity log specific column configurations
export const createActivityLogColumns = () => [
  createDateColumn(),
  createUserColumn(),
  createTextColumn('role', 'Role'),
  createCustomColumn(
    'activity',
    'Activity',
    (row: any) => <span className="text-blue-600 text-sm">{row.activity}</span>,
    '12'
  ),
  createTextColumn('ipAddress', 'IP Address', '16'),
  createStatusColumn()
];

// Common table action factory
export const createViewAction = (onView: (row: any) => void, icon?: React.ReactNode) => ({
  icon: icon,
  label: 'View Details',
  onClick: onView,
  className: 'text-gray-600 hover:text-blue-600'
});

export default {
  createDateColumn,
  createUserColumn,
  createStatusColumn,
  createTextColumn,
  createCustomColumn,
  createActivityLogColumns,
  createViewAction
};
