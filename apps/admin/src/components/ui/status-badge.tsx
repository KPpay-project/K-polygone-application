import { cn } from '@/lib/utils';

export interface StatusConfig {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export interface StatusBadgeProps {
  status: string;
  statusConfig?: Record<string, StatusConfig>;
  className?: string;
}

const defaultStatusConfig: Record<string, StatusConfig> = {
  approved: {
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#16A34A]',
    text: 'text-[#16A34A]',
    dot: 'bg-[#16A34A]'
  },
  success: {
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#16A34A]',
    text: 'text-[#16A34A]',
    dot: 'bg-[#16A34A]'
  },
  pending: {
    bg: 'bg-[#FEF9C3]',
    border: 'border-[#CA8A04]',
    text: 'text-[#B45309]',
    dot: 'bg-[#CA8A04]'
  },
  rejected: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#DC2626]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#DC2626]'
  },
  error: {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#DC2626]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#DC2626]'
  }
};

const statusAliases: Record<string, keyof typeof defaultStatusConfig> = {
  successful: 'success',
  succeeded: 'success',
  approved: 'success',
  completed: 'success',
  active: 'success',
  fail: 'error',
  failed: 'error',
  error: 'error',
  processing: 'pending',
  inprogress: 'pending',
  awaiting: 'pending',
  declined: 'rejected',
  rejected: 'rejected'
};

export function StatusBadge({ status, statusConfig, className }: StatusBadgeProps) {
  const config = statusConfig || defaultStatusConfig;

  const key = status.toLowerCase();
  const normalizedKey = statusAliases[key] || key;

  const styles = config[normalizedKey] || {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-600',
    dot: 'bg-gray-400'
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-[12px] px-2 py-0.5 w-fit border',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
      <span className={cn('text-sm font-light capitalize', styles.text)}>{status}</span>
    </div>
  );
}

export default StatusBadge;
