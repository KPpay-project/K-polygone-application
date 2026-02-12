import { useState, useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { countries } from '@repo/utils';
import { useUserCountry } from '@repo/common';
import { InputWithSearch } from './input-with-search';
export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  prefix: string;
}

export interface CountrySelectorProps {
  value?: string;
  onValueChange?: (value: string, country: CountryOption) => void;
  placeholder?: string;
  disabled?: boolean;
  showPrefix?: boolean;
  showName?: boolean;
  className?: string;
  triggerClassName?: string;
  countries?: CountryOption[];
  hasFlag?: boolean;
}

export const CountrySelector = forwardRef<HTMLButtonElement, CountrySelectorProps>(
  (
    {
      value,
      onValueChange,
      placeholder,
      disabled = false,
      showPrefix = true,
      showName = true,
      className = '',
      triggerClassName = '',
      countries: customCountries = countries,
      hasFlag = true,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { countryCode: userCountryCode, loading: userCountryLoading } = useUserCountry();

    const getCountryByCode = (codeOrName?: string) =>
      customCountries.find((c) => c.code === codeOrName || c.name === codeOrName);
    const defaultCountry =
      getCountryByCode(value) ||
      (!userCountryLoading ? getCountryByCode(userCountryCode) : undefined);
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | undefined>(
      defaultCountry,
    );

    useEffect(() => {
      if (value) {
        const country = getCountryByCode(value);
        if (country && country.code !== selectedCountry?.code) {
          setSelectedCountry(country);
          onValueChange?.(country.name, country);
        } else if (!country && selectedCountry?.code !== customCountries[0]?.code) {
          setSelectedCountry(customCountries[0]);
          onValueChange?.(customCountries[0].name, customCountries[0]);
        }
        return;
      }

      if (userCountryLoading) {
        return;
      }

      const userCountry = getCountryByCode(userCountryCode);
      if (userCountry && userCountry.code !== selectedCountry?.code) {
        setSelectedCountry(userCountry);
        onValueChange?.(userCountry.name, userCountry);
      } else if (!userCountry && selectedCountry?.code !== customCountries[0]?.code) {
        setSelectedCountry(customCountries[0]);
        onValueChange?.(customCountries[0].name, customCountries[0]);
      }
    }, [value, customCountries, userCountryCode, userCountryLoading]);

    const handleValueChange = (countryCode: string) => {
      const country = getCountryByCode(countryCode);
      if (country) {
        setSelectedCountry(country);
        onValueChange?.(country.name, country);
      }
    };

    const getCountryLabel = (country: CountryOption) => {
      const translatedName = t(`countries.${country.code}`, { defaultValue: country.name });
      const parts: string[] = [];
      if (hasFlag) {
        parts.push(country.flag);
      }
      if (showName) {
        parts.push(translatedName);
      }
      if (showPrefix) {
        parts.push(`(${country.prefix})`);
      }
      return parts.join(' ');
    };

    return (
      <InputWithSearch
        ref={ref}
        options={customCountries.map((country) => ({
          value: country.code,
          label: getCountryLabel(country),
        }))}
        value={selectedCountry?.code}
        onChange={handleValueChange}
        placeholder={placeholder}
        searchPlaceholder={t('common.search') || 'Search...'}
        emptyMessage={t('common.noResults') || 'No results found'}
        disabled={disabled}
        className={`focus:outline-none focus:ring-0 focus:ring-offset-0 outline-none ring-0 ring-offset-0 ${triggerClassName}`}
        contentClassName={className}
      />
    );
  },
);

CountrySelector.displayName = 'CountrySelector';

export interface PhoneCountrySelectorProps extends Omit<
  CountrySelectorProps,
  'showName' | 'showPrefix'
> {
  onCountryChange?: (country: CountryOption) => void;
}

export const PhoneCountrySelector = forwardRef<HTMLButtonElement, PhoneCountrySelectorProps>(
  ({ onCountryChange, triggerClassName = '', ...props }, ref) => {
    const handleValueChange = (countryCode: string, country: CountryOption) => {
      onCountryChange?.(country);
      props.onValueChange?.(countryCode, country);
    };

    return (
      <CountrySelector
        {...props}
        ref={ref}
        onValueChange={handleValueChange}
        showName={false}
        showPrefix={false}
        triggerClassName={`h-10 focus:border-0 border-0 focus:outline-0 outline-0 rounded-0 shadow-none focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0 ${triggerClassName}`}
      />
    );
  },
);

PhoneCountrySelector.displayName = 'PhoneCountrySelector';
