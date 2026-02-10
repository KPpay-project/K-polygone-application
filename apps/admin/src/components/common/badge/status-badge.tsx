import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Happyemoji } from 'iconsax-reactjs';
const statusBadgeVariants = cva('', {
  variants: {
    status: {
      'not-started': 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      'in-progress': 'bg-warning-100 text-warning-700 hover:bg-warning-200',
      pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      active: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
      done: 'bg-success-100 text-success-700 hover:bg-success-200',
      failed: 'bg-red-100 text-red-700 hover:bg-red-200',
      delayed: 'bg-red-100 text-red-700 hover:bg-red-200',
      cancelled: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  },
  defaultVariants: {
    status: 'not-started'
  }
});

type StatusType = 'not-started' | 'in-progress' | 'pending' | 'active' | 'done' | 'failed' | 'delayed' | 'cancelled';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  showIcon?: boolean;
  children?: React.ReactNode;
}

const statusConfig: Record<StatusType, { label: string; icon: string }> = {
  'not-started': {
    label: 'Not Started',
    icon: '○'
  },
  'in-progress': {
    label: 'In Progress',
    icon: '◐'
  },
  pending: {
    label: 'Pending',
    icon: '⏳'
  },
  active: {
    label: 'Active',
    icon: '●'
  },
  done: {
    label: 'Done',
    icon: '✓'
  },
  failed: {
    label: 'Failed',
    icon: '✗'
  },
  delayed: {
    label: 'Delayed',
    icon: '!'
  },
  cancelled: {
    label: 'Cancelled',
    icon: '⊘'
  }
};

export function StatusBadge({ className, status, showIcon = false, children, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={` px-3 rounded-full shadow-none ${cn(statusBadgeVariants({ status }), className)}`} {...props}>
      {children || config.label}

      {showIcon && (
        <span className="ml-1 flex h-3 w-3 items-center justify-center text-xs">
          <Happyemoji size={16} variant="Outline" style={{ color: 'currentColor' }} />
        </span>
      )}
    </Badge>
  );
}
