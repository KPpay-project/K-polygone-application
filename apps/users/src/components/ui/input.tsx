import { cn } from '@/lib/utils';
import React, { useState, useMemo, useRef, useEffect } from 'react';

type Currency = string;

type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  currency?: Currency;
  placeholder?: string;
  className?: string;
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
  XOF: 'CFA',
  XAF: 'FCFA',
  ZMW: 'ZK'
};

const getPlaceValue = (num: number) => {
  if (num >= 1_000_000_000) return 'Billion';
  if (num >= 1_000_000) return 'Million';
  if (num >= 1_000) return 'Thousand';
  return '';
};

const NumberInput: React.FC<NumberInputProps> = ({ value = 0, onChange, currency, placeholder, className }) => {
  const [inputValue, setInputValue] = useState(value.toLocaleString());
  const [tooltipPos, setTooltipPos] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const symbol = currency ? currencySymbols[currency] || currency : '';

  const placeValue = useMemo(() => {
    const plainNumber = Number(inputValue.replace(/,/g, ''));
    return getPlaceValue(plainNumber);
  }, [inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
    const num = Number(rawValue);
    if (!isNaN(num)) {
      setInputValue(num.toLocaleString());
      onChange?.(num);
    }
  };

  useEffect(() => {
    if (!measureRef.current) return;
    const rect = measureRef.current.getBoundingClientRect();
    const parentRect = measureRef.current.parentElement?.getBoundingClientRect();
    if (rect && parentRect) {
      const isMoreThanThousand = inputValue.replace(/,/g, '').length > 6;
      setTooltipPos(rect.left - parentRect.left + (isMoreThanThousand ? rect.width / 2 : 0));
    }
  }, [inputValue, symbol]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white w-full">
        {symbol && <span className="mr-2 text-gray-500 font-bold">{symbol}</span>}
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder || 'Enter amount'}
            className="outline-none w-full bg-transparent text-lg"
          />
          <span ref={measureRef} className="absolute top-0 left-0 invisible pointer-events-none text-lg">
            {symbol && <span>{symbol} </span>}
            {inputValue.charAt(0)}
          </span>
        </div>
      </div>

      {placeValue && (
        <div
          className="absolute -top-7 bg-gray-800 text-white text-[10px] tracking-[0.8px] px-2 py-0.5 rounded "
          style={{
            left: tooltipPos,
            transform: 'translateX(0)',
            whiteSpace: 'nowrap'
          }}
        >
          {placeValue}
          <div
            className="absolute left-1/2 -bottom-1"
            style={{
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1f2937'
            }}
          />
        </div>
      )}
    </div>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-[20px] text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, NumberInput };
export type { Currency };
