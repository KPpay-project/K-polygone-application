import { forwardRef } from 'react';
import { CountrySelector, CountrySelectorProps } from './country-selector';
import { africanCountries } from '@/constant/african-countries';
import { BankProvider } from '@/constant/bank-providers';

interface BankingCountrySelectorProps extends Omit<CountrySelectorProps, 'countries'> {
  provider?: BankProvider;
}

export const BankingCountrySelector = forwardRef<HTMLButtonElement, BankingCountrySelectorProps>(
  ({ provider, ...props }, ref) => {
    // Filter countries based on the bank provider and convert to CountryOption[]
    const availableCountries = (
      provider
        ? africanCountries.filter((country) => country.bankProviders.includes(provider as BankProvider))
        : africanCountries
    ).map((country) => ({
      code: country.code,
      name: country.name,
      flag: country.flag,
      prefix: country.prefix
    }));

    return <CountrySelector {...props} ref={ref} countries={availableCountries} showPrefix={false} />;
  }
);

BankingCountrySelector.displayName = 'BankingCountrySelector';
