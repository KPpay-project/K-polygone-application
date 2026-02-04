import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Trash } from 'iconsax-reactjs';

interface DeleteActionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  icon?: React.ReactNode;
}

/**
 * DeleteAction
 * A reusable, extensible danger-confirm dialog tailored to destructive actions.
 * Defaults to the wallet delete copy and styling shown in the design, but can be
 * customized via props for other resources or wordings.
 */
const DeleteAction: React.FC<DeleteActionProps> = ({
  open,
  onOpenChange,
  title = 'Are you sure you want to delete this wallet?',
  description = 'You won’t be able to recover this wallet once deleted',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
  icon
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {icon ?? (
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
              <Trash size={28} className="text-red-500" />
            </div>
          )}
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-4">
          <button
            type="button"
            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAction;
