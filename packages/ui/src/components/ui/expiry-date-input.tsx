import React, { useState, useEffect } from 'react';
import { Input } from 'k-polygon-assets';

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
    // Remove all non-numeric characters
    const numericOnly = input.replace(/\D/g, '');

    // Limit to 4 digits (MMYY)
    const limited = numericOnly.slice(0, 4);

    // Add slash after month if we have at least 2 digits
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
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }

    // Allow arrow keys
    if (e.keyCode >= 35 && e.keyCode <= 40) {
      return;
    }

    // Prevent input if not a number
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
      maxLength={5} // MM/YY format
    />
  );
};
