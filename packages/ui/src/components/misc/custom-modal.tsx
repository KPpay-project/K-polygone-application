import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { cn } from '@ui/lib/utils';

export type CustomModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
};

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className={cn(contentClassName)}>
        {(title || description) && (
          <DialogHeader className={cn(headerClassName)}>
            {title ? <DialogTitle className={cn(titleClassName)}>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription className={cn(descriptionClassName)}>
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter className={cn(footerClassName)}>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};
