import React from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'p' | 'muted' | 'small' | 'lead';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

const variantMap: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  p: 'text-base',
  lead: 'text-xl text-muted-foreground',
  muted: 'text-sm text-muted-foreground',
  small: 'text-sm'
};

export const Typography: React.FC<TypographyProps> = ({ variant = 'p', as, className, children, ...props }) => {
  const Component = as || variant || 'p';
  return (
    //@ts-ignore
    <Component className={cn(variantMap[variant], className)} {...props}>
      {children}
    </Component>
  );
};
