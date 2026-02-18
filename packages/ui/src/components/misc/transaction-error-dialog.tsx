import React from 'react';
import { XCircle, RotateCcw, X } from 'lucide-react';
import { CustomModal } from './custom-modal';
import { Button } from '../ui/button';
import { Typography } from './typography';
import { cn } from '@ui/lib/utils';
import { CloseSquare } from "iconsax-reactjs"

export type TransactionErrorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  errorCode?: React.ReactNode;
  onRetry?: () => void;
  onCancel?: () => void;
  retryLabel?: string;
  cancelLabel?: string;
  className?: string;
};

export const TransactionErrorDialog: React.FC<TransactionErrorDialogProps> = ({
  open,
  onOpenChange,
  title = 'Transaction Failed',
  description = 'Something went wrong while processing this transaction.',
  errorCode,
  onRetry,
  onCancel,
  retryLabel = 'Try again',
  cancelLabel = 'Cancel',
  className,
}) => {
  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName={cn('rounded-[28px] border-0 bg-white p-0', className)}
    >
      <div className="rounded-[28px] bg-white p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
         
          <CloseSquare variant='Bulk' color='red'  size={60} strokeWidth={2.3} />

          <Typography as="h3" className=" font-semibold leading-none text-[#B91C1C]">
            {title}
          </Typography>
          <Typography as="p" className="mt-4  text-[#6B7280]">
            {description}
          </Typography>
          {errorCode ? (
            <div className="mt-5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-4 py-2">
              <Typography className=" font-medium text-[#B91C1C]">
                {errorCode}
              </Typography>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Button
            type="button"
            variant="disabled_outline"      
            onClick={onCancel}
          >
            <X className="h-5 w-5" />
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-14 rounded-[18px] font-semibold"
            onClick={onRetry}
          >
            <RotateCcw className="h-5 w-5" />
            {retryLabel}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
