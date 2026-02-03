import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from '@/lib/utils';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  className,
  contentClassName
}) => {
  return (
    <Card className={cn('bg-white border border-gray-200 rounded-lg shadow-sm', 'mb-6 last:mb-0', className)}>
      <CardContent className={cn('p-6', contentClassName)}>
        <div className="mb-4">
          <Typography variant="h3" className="text-gray-900 font-semibold text-lg">
            {title}
          </Typography>
          {description && (
            <Typography variant="muted" className="text-gray-500 mt-1">
              {description}
            </Typography>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};
