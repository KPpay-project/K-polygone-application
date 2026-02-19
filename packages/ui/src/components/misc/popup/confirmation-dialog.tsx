import React from 'react';
import { cn } from '@ui/lib/utils';
import { Button } from '../../ui/button';
import { CustomModal } from '../custom-modal';
import { Typography } from '../typography';

export type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmDisabled?: boolean;
  className?: string;
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title = 'Confirm action',
  description = 'Are you sure you want to continue?',
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  className,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName={cn('rounded-[28px] border-0 bg-white p-0', className)}
    >
      <div className="rounded-[28px] bg-white p-6 sm:p-10">
        <div className="text-center">
          <Typography as="h3" className="font-semibold text-[#111827]">
            {title}
          </Typography>
          <Typography as="p" className="mt-3 text-[#6B7280]">
            {description}
          </Typography>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="disabled_outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
