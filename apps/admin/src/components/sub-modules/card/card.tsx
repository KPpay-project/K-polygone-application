import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface ModularCardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const ModularCard: React.FC<ModularCardProps> = ({ title, children, footer, className }) => {
  return (
    <Card className={cn('rounded-2xl shadow-none w-full py-6 border-0 ', className)}>
      {title && (
        <CardContent className="pb-0">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardContent>
      )}
      <CardContent className={'mt-4'}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
