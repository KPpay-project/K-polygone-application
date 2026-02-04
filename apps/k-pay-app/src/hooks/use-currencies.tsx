// import { IconCurrencyDollar, IconCurrencyXof } from 'k-polygon-assets';
import { useFetchCurrencies } from './use-fetch-currencies';
import { DollarCircle } from 'iconsax-react-nativejs';

export function useCurrencies() {
  const staticCurrencies = [
    {
      currency: 'USD',
      currencyLong: 'United State Dollars',
      icon: DollarCircle,
    },
  ];

  const staticCurrencyOptions = staticCurrencies.map((item) => ({
    label: item.currencyLong,
    value: item.currency,
  }));

  const {
    currencies: apiCurrencies,
    currencyOptions: apiCurrencyOptions,
    loading,
    error,
    refetch,
    getCurrencyByCode,
    getCurrencySymbol,
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
    getCurrencySymbol,
  };
}
