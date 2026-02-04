import { IconCurrencyDollar, IconCurrencyXof } from 'k-polygon-assets';
import { useFetchCurrencies } from './use-fetch-currencies';
import { GET_CURRENCIES, GET_MY_WALLET_CURRENCIES } from '@/lib/graphql';
import { useQuery } from '@apollo/client';

export function useCurrencies() {
  const staticCurrencies = [
    {
      currency: 'USD',
      currencyLong: 'United State Dollars',
      icon: IconCurrencyDollar
    },
    {
      currency: 'XOF',
      currencyLong: 'X Only Dollars',
      icon: IconCurrencyXof
    }
  ];

  const staticCurrencyOptions = staticCurrencies.map((item) => ({
    label: item.currencyLong,
    value: item.currency
  }));

  const {
    currencies: apiCurrencies,
    currencyOptions: apiCurrencyOptions,
    loading,
    error,
    refetch,
    getCurrencyByCode,
    getCurrencySymbol
  } = useFetchCurrencies();

  return {
    currencies: staticCurrencies,
    currencyOptions: staticCurrencyOptions,

    apiCurrencies,
    apiCurrencyOptions,
    loading,
    error,
    refetch,
    getCurrencyByCode,
    getCurrencySymbol
  };
}

const useFetchMyWalletCurrencies = () => {
  return useQuery(GET_MY_WALLET_CURRENCIES);
};

const useFetchAllCurrencies = () => {
  return useQuery(GET_CURRENCIES);
};

export { useFetchMyWalletCurrencies, useFetchAllCurrencies };
