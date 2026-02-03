import { useState, useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'k-polygon-assets/components';
import { countries } from '@/utils/constants';

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
      hasFlag = true
    },
    ref
  ) => {
    const { t } = useTranslation();

    const getCountryByCode = (codeOrName?: string) =>
      customCountries.find((c) => c.code === codeOrName || c.name === codeOrName);
    const defaultCountry = getCountryByCode(value) || customCountries[0];
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | undefined>(defaultCountry);
    const [search, setSearch] = useState('');

    useEffect(() => {
      const country = getCountryByCode(value);
      if (country && country.code !== selectedCountry?.code) {
        setSelectedCountry(country);
        onValueChange?.(country.name, country);
      } else if (!country && selectedCountry?.code !== customCountries[0]?.code) {
        setSelectedCountry(customCountries[0]);
        onValueChange?.(customCountries[0].name, customCountries[0]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, customCountries]);

    const handleValueChange = (countryCode: string) => {
      const country = getCountryByCode(countryCode);
      if (country) {
        setSelectedCountry(country);
        onValueChange?.(country.name, country);
      }
    };

    const filteredCountries = customCountries.filter((country) => {
      const searchLower = search.toLowerCase();
      return (
        country.name?.toLowerCase().includes(searchLower) ||
        country.code?.toLowerCase().includes(searchLower) ||
        country.prefix?.toLowerCase().includes(searchLower)
      );
    });

    return (
      <Select onValueChange={handleValueChange} value={selectedCountry?.code} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          className={`focus:outline-none focus:ring-0 focus:ring-offset-0 outline-none ring-0 ring-offset-0 ${triggerClassName}`}
        >
          <SelectValue placeholder={placeholder}>
            {selectedCountry && (
              <div className="flex items-center gap-2">
                {hasFlag && <span>{selectedCountry.flag}</span>}
                {showName && (
                  <span className="text-sm">
                    {t(`countries.${selectedCountry.code}`, { defaultValue: selectedCountry.name })}
                  </span>
                )}
                {showPrefix && <span className="text-gray-400 text-xs">({selectedCountry.prefix})</span>}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={className}>
          <div className="px-2 py-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search') || 'Search...'}
              className="w-full px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-0 text-sm mb-2"
              autoFocus
            />
          </div>
          {filteredCountries.length === 0 && (
            <div className="px-4 py-2 text-gray-400 text-sm">{t('common.noResults') || 'No results found'}</div>
          )}
          {filteredCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                {showName && (
                  <span className="text-sm">{t(`countries.${country.code}`, { defaultValue: country.name })}</span>
                )}
                {showPrefix && <span className="text-gray-400 text-xs">({country.prefix})</span>}
                {/* {country.code} {country.prefix} */}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

CountrySelector.displayName = 'CountrySelector';

export interface PhoneCountrySelectorProps extends Omit<CountrySelectorProps, 'showName' | 'showPrefix'> {
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
  }
);

PhoneCountrySelector.displayName = 'PhoneCountrySelector';
