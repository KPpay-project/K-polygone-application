import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
  color?: string;
}

interface CustomSelectorProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDropDownPopup?: boolean;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  className,
  isDropDownPopup = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 text-left',
          'bg-white border border-gray-200 rounded-lg shadow-sm',
          'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          'transition-all duration-200 ease-in-out',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20'
        )}
      >
        <span className={cn('text-sm', selectedOption ? selectedOption.color || 'text-gray-900' : 'text-gray-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', isOpen && 'transform rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50',
            isDropDownPopup ? 'absolute top-full left-0 mt-1' : 'relative mt-1'
          )}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className={cn(
                  'w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors duration-150',
                  'focus:outline-none focus:bg-gray-50',
                  option.value === value && 'bg-blue-50 text-blue-600 font-medium',
                  option.color && option.value !== value && option.color
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelector;
