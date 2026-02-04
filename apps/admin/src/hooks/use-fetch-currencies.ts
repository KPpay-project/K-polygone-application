import { useGraphQLQuery } from './useGraphQL';
import { GET_CURRENCIES } from '../lib/graphql/queries';
import { CurrenciesData, Currency } from '@repo/types';

export function useFetchCurrencies() {
  const { data, loading, error, refetch } = useGraphQLQuery<CurrenciesData>(GET_CURRENCIES, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const currencies: Currency[] = data?.currencies || [];

  const currencyOptions = currencies.map((currency) => ({
    label: `${currency.name} (${currency.code})`,
    value: currency.code
  }));

  const getCurrencyByCode = (code: string): Currency | undefined => {
    return currencies.find((currency) => currency.code === code);
  };

  const getCurrencySymbol = (code: string): string => {
    const currency = getCurrencyByCode(code);
    return currency?.symbol || code;
  };

  return {
    currencies,
    currencyOptions,
    loading,
    error,
    refetch,
    getCurrencyByCode,
    getCurrencySymbol
  };
}
