import { type FC, useState, useEffect } from 'react';
import PhoneInput, { type PhoneInputProps, type CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/lib/utils';
import { Label } from 'k-polygon-assets';
import { parsePhoneNumber, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

export interface PrimaryPhoneNumberInputProps extends Omit<
  PhoneInputProps,
  'country' | 'value' | 'onChange' | 'placeholder'
> {
  country?: string;
  value?: string;
  onChange?: (
    value: string,
    country: CountryData,
    e: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void;
  showValidation?: boolean;
  errorMessage?: string;
}

export const PrimaryPhoneNumberInput: FC<PrimaryPhoneNumberInputProps> = ({
  country = 'ng',
  value,
  onChange,
  placeholder = 'Enter phone number',
  className,
  disabled = false,
  error = false,
  onValidationChange,
  showValidation = true,
  errorMessage,
  ...rest
}) => {
  const [validationError, setValidationError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>(country);

  const validatePhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
    if (!phoneNumber || phoneNumber.length === 0) {
      setValidationError('');
      setIsValid(true);
      onValidationChange?.(true);
      return true;
    }

    try {
      const countryCodeUpper = countryCode.toUpperCase() as CountryCode;

      const phoneWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      const valid = isValidPhoneNumber(phoneWithPlus, countryCodeUpper);

      if (!valid) {
        const errorMsg = `Invalid phone number for ${countryCodeUpper}`;
        setValidationError(errorMsg);
        setIsValid(false);
        onValidationChange?.(false, errorMsg);
        return false;
      }

      const phoneNumberObj = parsePhoneNumber(phoneWithPlus, countryCodeUpper);

      if (!phoneNumberObj) {
        const errorMsg = 'Invalid phone number format';
        setValidationError(errorMsg);
        setIsValid(false);
        onValidationChange?.(false, errorMsg);
        return false;
      }

      if (phoneNumberObj.getType() && !['MOBILE', 'FIXED_LINE_OR_MOBILE'].includes(phoneNumberObj.getType() || '')) {
        const errorMsg = 'Please enter a valid mobile number';
        setValidationError(errorMsg);
        setIsValid(false);
        onValidationChange?.(false, errorMsg);
        return false;
      }

      setValidationError('');
      setIsValid(true);
      onValidationChange?.(true);
      return true;
    } catch {
      const errorMsg = 'Invalid phone number';
      setValidationError(errorMsg);
      setIsValid(false);
      onValidationChange?.(false, errorMsg);
      return false;
    }
  };

  useEffect(() => {
    if (value) {
      validatePhoneNumber(value, selectedCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, selectedCountry]);

  const handleChange = (
    newValue: string,
    countryData: CountryData,
    e: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    setSelectedCountry(countryData.countryCode);
    validatePhoneNumber(newValue, countryData.countryCode);
    onChange?.(newValue, countryData, e, formattedValue);
  };

  const hasError = error || (!isValid && showValidation && value && value.length > 0);
  const displayErrorMessage = errorMessage || validationError;

  return (
    <div className={cn('w-full', className)}>
      <Label htmlFor="phone">Phone Number</Label>
      <div className="mt-2">
        <PhoneInput
          country={country}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFormat
          enableSearch
          regions="africa"
          containerClass={cn(
            'phone-input-container',
            hasError && 'phone-input-error',
            disabled && 'phone-input-disabled'
          )}
          inputClass={cn(
            'w-full',
            hasError && 'border-red-500 focus:border-red-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          buttonClass={cn(disabled && 'cursor-not-allowed opacity-50')}
          dropdownClass="phone-input-dropdown"
          searchClass="phone-input-search"
          inputStyle={{
            width: '100%',
            height: '42px',
            fontSize: '14px',
            borderRadius: '8px',
            border: hasError ? '1px solid #ef4444' : '1px solid #e5e7eb',
            paddingLeft: '48px'
          }}
          buttonStyle={{
            borderRadius: '8px 0 0 8px',
            border: hasError ? '1px solid #ef4444' : '1px solid #e5e7eb',
            borderRight: 'none',
            backgroundColor: disabled ? '#f9fafb' : '#ffffff'
          }}
          dropdownStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          searchStyle={{
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '6px',
            margin: '8px'
          }}
          {...rest}
        />
        {hasError && showValidation && displayErrorMessage && (
          <p className="mt-1 text-sm text-red-500">{displayErrorMessage}</p>
        )}
        {isValid && value && value.length > 0 && showValidation && (
          <p className="mt-1 text-sm text-green-600">✓ Valid phone number</p>
        )}
      </div>
    </div>
  );
};

PrimaryPhoneNumberInput.displayName = 'PrimaryPhoneNumberInput';
