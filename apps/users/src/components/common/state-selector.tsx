import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'k-polygon-assets/components';
import { getStatesByCountry } from '@/utils/constants';

interface StateSelectorProps {
  value: string;
  countryCode: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const StateSelector = ({
  value,
  countryCode,
  onValueChange,
  placeholder = 'Select state',
  disabled = false,
  className = ''
}: StateSelectorProps) => {
  const states = React.useMemo(() => getStatesByCountry(countryCode), [countryCode]);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || !countryCode}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={!countryCode ? 'Select country first' : placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {states.map((state) => (
          <SelectItem key={state.name} value={state.name}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
