import { cn } from '@ui/lib/utils';
import React, { useState, useMemo, useEffect } from 'react';

type Currency = string;

interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: Currency;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
  XOF: 'CFA',
  XAF: 'FCFA',
  ZMW: 'ZK',
};

const getPlaceValue = (num: number) => {
  if (num >= 1_000_000_000_000) return 'Trillion';
  if (num >= 1_000_000_000) return 'Billion';
  if (num >= 1_000_000) return 'Million';
  if (num >= 1_000) return 'Thousand';
  return '';
};

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-lg border border-input bg-background
           px-3 py-5 text-sm ring-offset-background file:border-0 file:bg-transparent 
           file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, currency, className, placeholder, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(
      value !== undefined && value !== null ? value.toLocaleString() : '',
    );

    const symbol = currency ? currencySymbols[currency] || currency : '';

    useEffect(() => {
      if (value !== undefined && value !== null) {
        const currentNum = parseFloat(inputValue.replace(/,/g, ''));
        if (currentNum !== value) {
          setInputValue(value.toLocaleString());
        }
      }
    }, [value, inputValue]);

    const placeValue = useMemo(() => {
      if (!inputValue) return '';
      const plainNumber = parseFloat(inputValue.replace(/,/g, ''));
      if (isNaN(plainNumber)) return '';
      return getPlaceValue(plainNumber);
    }, [inputValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const cleanValue = rawValue.replace(/,/g, '');

      if (!/^\d*\.?\d*$/.test(cleanValue)) return;

      const num = parseFloat(cleanValue);
      const integerValue = cleanValue.replace(/[^\d]/g, '');

      if (integerValue === '') {
        setInputValue('');
        onChange?.(0);
        return;
      }

      const parsedNum = parseInt(integerValue, 10);
      if (!isNaN(parsedNum)) {
        setInputValue(parsedNum.toLocaleString());
        onChange?.(parsedNum);
      }
    };

    return (
      <div className={cn('relative w-full', className)}>
        <div className="relative">
          {symbol && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">
              {symbol}
            </div>
          )}
          <Input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder || '0'}
            className={cn(symbol && 'pl-8')}
            {...props}
          />
        </div>

        {placeValue && (
          <div className="absolute -top-6 right-0 bg-primary/90 text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded shadow-sm animate-in fade-in slide-in-from-bottom-1">
            {placeValue}
          </div>
        )}
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';

export { Input, NumberInput };
export type { Currency };
