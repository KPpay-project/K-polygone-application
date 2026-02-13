import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CustomFormMessage = ({
  message,
  scope
}: {
  message?: { message?: string };
  scope: 'error' | 'warning' | 'success';
}) => {
  const classNameMapping = {
    error: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    success: 'text-green-600 bg-green-50'
  };
  const className = classNameMapping[scope];

  const Icon = scope === 'success' ? CheckCircle : scope === 'warning' ? AlertTriangle : AlertCircle;

  return (
    message && (
      <div className={cn('flex gap-[5px] items-center px-[5px] py-[4px] rounded-[6px]', className)}>
        <Icon size={16} />
        {message.message}
      </div>
    )
  );
};
