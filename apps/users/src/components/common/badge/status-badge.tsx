import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statusBadgeVariants = cva('px-3 rounded-full shadow-none border !font-medium', {
  variants: {
    status: {
      'not-started': 'bg-gray-100 text-gray-600 border-gray-600 hover:bg-gray-200',
      'in-progress': 'bg-warning-100 text-warning-700 border-warning-700 hover:bg-warning-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-700 hover:bg-yellow-200',
      active: 'bg-primary-50 text-primary-700 border-primary-700 hover:bg-primary-200',
      done: 'bg-success-50 text-success-700 border-success-700 hover:bg-success-200',
      failed: 'bg-red-50 text-red-700 border-red-700 hover:bg-red-200',
      delayed: 'bg-red-50 text-red-700 border-red-700 hover:bg-red-200',
      cancelled: 'bg-gray-50 text-gray-600 border-gray-600 hover:bg-gray-200',
      resolved: 'bg-success-50 text-success-700 border-success-700 hover:bg-success-200',
      resolve: 'bg-success-50 text-success-700 border-success-700 hover:bg-success-200'
    }
  },
  defaultVariants: {
    status: 'not-started'
  }
});

type StatusType =
  | 'not-started'
  | 'in-progress'
  | 'pending'
  | 'active'
  | 'done'
  | 'failed'
  | 'delayed'
  | 'cancelled'
  | 'resolved'
  | 'resolve';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const statusConfig: Record<StatusType, { label: string; icon: React.ReactNode }> = {
  'not-started': { label: 'Not Started', icon: '○' },
  'in-progress': { label: 'In Progress', icon: '◐' },
  pending: { label: 'Pending', icon: '⏳' },
  active: { label: 'Active', icon: '●' },
  done: { label: 'Done', icon: '✓' },
  failed: { label: 'Failed', icon: '✗' },
  delayed: { label: 'Delayed', icon: '!' },
  cancelled: { label: 'Cancelled', icon: '⊘' },
  resolved: { label: 'Resolved', icon: '✓' },
  resolve: { label: 'Resolve', icon: '✓' }
};

export function StatusBadge({
  className,
  status,
  showIcon = false,
  iconPosition = 'right',
  children,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];

  const iconEl = showIcon && (
    <span
      className={cn('flex h-3 w-3 items-center py-3 justify-center text-xs', iconPosition === 'left' ? 'mr-1' : 'ml-1')}
    >
      <span className="w-2 h-2 rounded-full " style={{ background: 'currentColor' }}></span>
    </span>
  );

  return (
    <Badge className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {iconPosition === 'left' && iconEl}
      {children || config?.label}
      {iconPosition === 'right' && iconEl}
    </Badge>
  );
}
