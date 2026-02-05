import { IconCurrencyDollar, IconCurrencyXof } from 'k-polygon-assets';
import { useFetchCurrencies } from './use-fetch-currencies';
import { useMutation } from '@apollo/client';
import CREATE_CURRENCY_MUTATION from '@repo/api';

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

const useCreateCurrency = () => {
  const [createCurrency, { data, loading, error }] = useMutation(CREATE_CURRENCY_MUTATION);

  const createNewCurrency = async (currencyData) => {
    try {
      const response = await createCurrency({
        variables: {
          input: {
            code: currencyData.code,
            countryNames: currencyData.countryNames || ['Nigeria'],
            name: currencyData.name,
            symbol: currencyData.symbol,
            countryCode: currencyData.countryCode,
            precision: currencyData.precision || 2,
            isActive: currencyData.isActive ?? true,
            exchangeRateUSD: currencyData.exchangeRateUSD || '0.0'
          }
        }
      });
      return response.data.createCurrency;
    } catch (err) {
      throw new Error(`Failed to create currency: ${err.message}`);
    }
  };

  return { createNewCurrency, data, loading, error };
};

export { useCreateCurrency };
