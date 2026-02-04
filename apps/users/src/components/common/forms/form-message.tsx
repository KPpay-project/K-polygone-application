import { cn } from '@/lib/utils';
import { Warning2 } from 'iconsax-reactjs';
import { FieldError } from 'react-hook-form';

export const CustomFormMessage = ({
  message,
  scope
}: {
  message: FieldError | undefined;
  scope: 'error' | 'warning' | 'success';
}) => {
  const classNameMapping = {
    ['error']: 'text-red-600 bg-red-50',
    ['warning']: 'text-yellow-600 bg-yellow-50',
    ['success']: 'text-green-600 bg-green-50'
  };
  const className = classNameMapping?.[scope];

  return (
    message && (
      <div className={cn('flex gap-[5px] items-center px-[5px] py-[4px] rounded-[6px]', className)}>
        <Warning2 size={16} />
        {message.message}
        <span className="text-[11px] font-semibold "></span>
      </div>
    )
  );
};
