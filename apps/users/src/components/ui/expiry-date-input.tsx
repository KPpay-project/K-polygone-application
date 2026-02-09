import React, { useState, useEffect } from 'react';
import { Input } from '@repo/ui';

interface ExpiryDateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  name?: string;
}

export const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
  value,
  onChange,
  placeholder = 'MM/YY',
  className = '',
  autoComplete,
  name
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatExpiryDate = (input: string): string => {
    
    const numericOnly = input.replace(/\D/g, '');

    
    const limited = numericOnly.slice(0, 4);

    
    if (limited.length >= 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }

    return limited;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatExpiryDate(inputValue);

    setDisplayValue(formatted);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }

    
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }

    
    if (e.keyCode >= 35 && e.keyCode <= 40) {
      return;
    }

    
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      autoComplete={autoComplete}
      name={name}
      maxLength={5} 
    />
  );
};
