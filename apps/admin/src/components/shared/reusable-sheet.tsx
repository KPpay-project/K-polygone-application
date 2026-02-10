import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ReusableSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  showDivider?: boolean;
}

export const ReusableSheet: React.FC<ReusableSheetProps> = ({
  open,
  onOpenChange,
  title,
  children,
  trigger,
  side = 'right',
  className,
  contentClassName = 'p-0 w-lg sm:max-w-[560px]',
  headerClassName = 'px-6 pt-6',
  showDivider = true
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger}
      <SheetContent side={side} className={contentClassName}>
        <SheetHeader className={headerClassName}>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        {showDivider && <div className="h-[1px] bg-gray-100 mt-4" />}
        <div className={className || 'overflow-y-auto h-[calc(100vh-70px)]'}>{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default ReusableSheet;
