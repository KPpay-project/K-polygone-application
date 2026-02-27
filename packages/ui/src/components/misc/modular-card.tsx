import { Card, CardTitle, CardContent, CardFooter } from '../ui/card';
import { cn } from '@ui/lib/utils';
import React from 'react';
import { Typography } from './typography';

interface ModularCardProps {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
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
  cardProps,
}) => {
  const showHeader = !hideHeader && title;

  return (
    <Card
      {...cardProps}
      className={cn('rounded-2xl  shadow-none py-4 border-0', className, cardProps?.className)}
    >
      {showHeader && (
        <CardContent className={cn('pb-0 pt-2', headerClassName)}>
          <div className="flex items-center justify-between">
            <CardTitle className=" font-medium">
              <Typography variant={'small'} className="!font-thin">
                {title}
              </Typography>
            </CardTitle>
            {headerAction && <div className="ml-auto">{headerAction}</div>}
          </div>
        </CardContent>
      )}

      <CardContent className={cn(showHeader && 'mt-4', contentClassName)}>{children}</CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

export default ModularCard;
