import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface ModularCardProps {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  /** override header content class */
  headerClassName?: string;
  /** override body/content class */
  contentClassName?: string;
  /** override footer class */
  footerClassName?: string;
  hideHeader?: boolean;

  cardProps?: React.ComponentPropsWithoutRef<typeof Card>;
  className?: string;
}

export const ModularCard: React.FC<ModularCardProps> = ({
  title,
  children,
  footer,
  headerAction,
  headerClassName,
  contentClassName,
  footerClassName,
  hideHeader = false,
  className,
  cardProps
}) => {
  return (
    <Card className={cn('rounded-2xl shadow-none py-4 border-0', className, cardProps?.className)} {...cardProps}>
      {!hideHeader && title && (
        <CardContent className={cn('pb-0', headerClassName)}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {headerAction && <div className="ml-auto">{headerAction}</div>}
          </div>
        </CardContent>
      )}

      <CardContent className={cn('mt-4 ', contentClassName)}>{children}</CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

export default ModularCard;
