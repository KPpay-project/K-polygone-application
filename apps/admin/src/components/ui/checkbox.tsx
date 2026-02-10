import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
  color?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, indeterminate, checked, color = 'brandBlue-600', ...props }, ref) => {
    const borderColor = `border-${color}`;
    const focusBorderColor = `focus:!border-${color}`;
    const checkedBgColor = `data-[state=checked]:bg-${color}`;
    const checkedBorderColor = `data-[state=checked]:!border-${color}`;

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        checked={checked}
        className={cn(
          `peer h-5 w-5 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 !${borderColor} ${focusBorderColor}`,
          indeterminate
            ? `bg-white text-white !${borderColor}`
            : `${checkedBgColor} data-[state=checked]:text-white ${checkedBorderColor}`,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          {indeterminate ? <Minus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
