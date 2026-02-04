import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'k-polygon-assets/components';
import { professions } from '@/utils/constants';

interface ProfessionSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ProfessionSelector = ({
  value,
  onValueChange,
  placeholder = 'Select profession',
  disabled,
  className
}: ProfessionSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {professions.map((profession) => (
          <SelectItem key={profession} value={profession}>
            {profession}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
