import * as Dialog from '@radix-ui/react-dialog';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

type DeleteModalProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  open?: boolean;
  destructiveClassName?: string;
};

const DeleteModal = ({
  trigger,
  title = 'Are you sure you want to delete this item?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  icon,
  loading: loadingProp,
  onConfirm,
  onCancel,
  open,
  destructiveClassName
}: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading || loadingProp) return;
    try {
      setLoading(true);
      await onConfirm?.();
      const closer = document.getElementById('hxza') as HTMLButtonElement | null;
      closer?.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultModal trigger={trigger} open={open}>
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          {icon || <Trash2 className="w-6 h-6 text-red-600" />}
        </div>
        <div className="space-y-1">
          <div className="text-xl font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        <div className="flex items-center gap-3 w-full justify-center">
          <Dialog.Close asChild>
            <Button variant="outline" className="px-6 h-10 rounded-xl" onClick={onCancel}>
              {cancelText}
            </Button>
          </Dialog.Close>
          <Button
            className={`px-6 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white ${destructiveClassName || ''}`}
            onClick={handleConfirm}
            disabled={loading || !!loadingProp}
          >
            {loading || loadingProp ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </DefaultModal>
  );
};

export default DeleteModal;
