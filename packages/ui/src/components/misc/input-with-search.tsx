import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@ui/lib/utils';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface Option {
  label: string;
  value: string;
}

export interface InputWithSearchProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  width?: string;
}

export const InputWithSearch = React.forwardRef<HTMLButtonElement, InputWithSearchProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select option...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No option found.',
      className,
      contentClassName,
      disabled,
      width = 'w-full',
    },
    ref,
  ) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const selectedValue = value !== undefined ? value : internalValue;

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? '' : currentValue;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setOpen(false);
  };

  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('justify-between border-black text-black', width, className)}
            disabled={disabled}
          >
            {selectedValue ? selectedLabel : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('p-0', width, contentClassName)}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

InputWithSearch.displayName = 'InputWithSearch';
