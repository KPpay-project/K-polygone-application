import React from 'react';
import { Copy } from 'lucide-react';
import { CustomModal } from './custom-modal';
import { Button } from '../ui/button';
import { Typography } from './typography';
import { cn } from '@ui/lib/utils';

export type SuccessDetailRow = {
  label: string;
  value: React.ReactNode;
};

export type TransactionSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  amount?: React.ReactNode;
  subtitle?: React.ReactNode;
  details?: SuccessDetailRow[];
  reference?: string;
  onCopyReference?: () => void;
  onShareReceipt?: () => void;
  onPrimaryAction?: () => void;
  shareLabel?: string;
  primaryLabel?: string;
  experienceTitle?: string;
  experienceSubtitle?: string;
  className?: string;
};

export const TransactionSuccessDialog: React.FC<TransactionSuccessDialogProps> = ({
  open,
  onOpenChange,
  title = 'Successful!',
  amount,
  subtitle,
  details = [],
  reference,
  onCopyReference,
  //onShareReceipt,
  onPrimaryAction,
  // shareLabel = 'Share receipt',
  // primaryLabel = 'New transfer',
  // experienceTitle = 'How was your experience?',
  // experienceSubtitle = 'Tap a star to rate',
  className,
}) => {
  const detailRows = React.useMemo(() => {
    if (!reference) return details;
    const hasReference = details.some((item) => item.label.toLowerCase() === 'reference');
    if (hasReference) return details;
    return [...details, { label: 'Reference', value: reference }];
  }, [details, reference]);

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName={cn('rounded-[28px] border-0 bg-white p-0', className)}
    >
      <div className="rounded-[28px] bg-white p-6 sm:p-10">
        <div className="flex flex-col items-center text-center mb-4">
          <div
            className="bg-green-500 
          w-[60px] h-[60px] flex items-center animate-pulse
           rounded-xl justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-check-icon lucide-check"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <Typography variant={'h5'} className=" font-medium leading-none text-[#04A65A] mt-2">
            {title}
          </Typography>
          {amount ? (
            <Typography
              as="p"
              variant={'large'}
              className="mt-3  font-bold leading-none text-[#111827]"
            >
              {amount}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography as="p" className="mt-2  font-medium leading-none text-[#9CA3AF]">
              {subtitle}
            </Typography>
          ) : null}
        </div>

        <div className="">
          {detailRows?.length ? (
            <>
              <div className="my-10 border-t border-[#E9EAEE]" />
              <div className="space-y-5">
                {detailRows?.map((row) => {
                  const labelKey = row.label.toLowerCase();
                  const isReferenceRow = labelKey === 'reference';

                  return (
                    <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-4 ">
                      <Typography variant={'small'} className=" font-medium text-[#9CA3AF]">
                        {row.label}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Typography
                          variant={'small'}
                          className="text-right  font-semibold text-[#1F2937]"
                        >
                          {row.value}
                        </Typography>
                        {isReferenceRow && reference ? (
                          <button
                            type="button"
                            aria-label="Copy reference"
                            className="inline-flex items-center justify-center text-[#D1D5DB] hover:text-[#6B7280]"
                            onClick={onCopyReference}
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex flex-col items-center text-center mt-[2em]">
          {/* <Button
            // type="button"
            className="w-full"
            variant="disabled_outline"
            onClick={onShareReceipt}
          >
            <Share2 className="h-5 w-5" />
            {shareLabel}
          </Button> */}
          <Button
            type="button"
            variant={'disabled_outline'}
            className="mt-4 w-full"
            onClick={onPrimaryAction}
          >
            {/* {primaryLabel} */} Done
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
