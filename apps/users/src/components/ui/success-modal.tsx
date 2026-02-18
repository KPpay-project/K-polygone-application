import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircleCheckBig, CircleX } from 'lucide-react';

type SuccessModalStatus = 'success' | 'error';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: SuccessModalStatus;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessModal({
  open,
  onOpenChange,
  status = 'success',
  title,
  description,
  actionLabel,
  onAction
}: SuccessModalProps) {
  const isSuccess = status === 'success';

  const defaultTitle = isSuccess ? 'Transaction Successful' : 'Transaction Failed';
  const defaultDescription = isSuccess
    ? 'Your transaction has been completed successfully.'
    : 'Something went wrong while processing your transaction. Please try again.';
  const defaultActionLabel = isSuccess ? 'Done' : 'Try Again';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full',
              isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}
          >
            {isSuccess ? <CircleCheckBig className="h-7 w-7" /> : <CircleX className="h-7 w-7" />}
          </div>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center">{title || defaultTitle}</DialogTitle>
            <DialogDescription className="text-center">{description || defaultDescription}</DialogDescription>
          </DialogHeader>

          <Button
            className="w-full"
            variant={isSuccess ? 'default' : 'destructive'}
            onClick={() => {
              onAction?.();
              onOpenChange(false);
            }}
          >
            {actionLabel || defaultActionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

