import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../utils';
import { buttonVariants } from './button-variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          disabled ? 'disabled:!bg-gray-400 disabled:!text-gray-700' : '',
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      >
        {children} {icon}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
