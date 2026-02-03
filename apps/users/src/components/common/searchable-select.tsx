import { useState, forwardRef, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'k-polygon-assets/components';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  options: readonly SearchableSelectOption[] | SearchableSelectOption[];
}

export const SearchableSelect = forwardRef<HTMLButtonElement, SearchableSelectProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Select option',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No results found',
      disabled = false,
      className = '',
      triggerClassName = '',
      options = []
    },
    ref
  ) => {
    const defaultOption = useMemo(() => options.find((o) => o.value === value), [value, options]);
    const [search, setSearch] = useState('');

    // If external value changes, we don't need local state for selected value
    // because we use the finding logic in the render/Select value prop

    const filteredOptions = useMemo(() => {
      const searchLower = search.toLowerCase();
      return options.filter((option) => option.label.toLowerCase().includes(searchLower));
    }, [options, search]);

    return (
      <Select onValueChange={onValueChange} value={value} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          className={`focus:outline-none focus:ring-0 focus:ring-offset-0 outline-none ring-0 ring-offset-0 ${triggerClassName}`}
        >
          <SelectValue placeholder={placeholder}>{defaultOption ? defaultOption.label : placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent className={className}>
          <div className="px-2 py-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-0 text-sm mb-2"
              autoFocus
            />
          </div>
          {filteredOptions.length === 0 && <div className="px-4 py-2 text-gray-400 text-sm">{emptyMessage}</div>}
          {filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';
