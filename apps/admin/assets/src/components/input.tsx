import * as React from 'react';

import { cn } from '../utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[46px]  font-[300] placeholder:!text-[#6C727F] placeholder:font-[300] w-full !outline-0 rounded-[8px] border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none hover:border-brandBlue-700 focus:border-brandBlue-700 focus:ring-brandBlue-700/10 focus-visible:ring-[3px] focus-visible:ring-rsing disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
