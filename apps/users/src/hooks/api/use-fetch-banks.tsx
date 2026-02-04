import { useQuery, gql } from '@apollo/client';

export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  accountNumberLength: number;
  accountNumberRegex?: string;
}

interface GetBanksResponse {
  banksByCountry: Bank[];
}

interface GetBanksVariables {
  countryCode: string;
}

export function useFetchBanks(countryCode?: string) {
  const { data, loading, error, refetch } = useQuery<GetBanksResponse, GetBanksVariables>(GET_BANKS_BY_COUNTRY, {
    variables: { countryCode: countryCode || '' },
    skip: !countryCode,
    fetchPolicy: 'network-only'
  });

  const getAccountNumberValidation = (bankCode?: string) => {
    const bank = data?.banksByCountry.find((b) => b.code === bankCode);
    if (!bank) return null;

    return {
      length: bank.accountNumberLength,
      regex: bank.accountNumberRegex ? new RegExp(bank.accountNumberRegex) : null
    };
  };

  const validateAccountNumber = (accountNumber: string, bankCode?: string) => {
    const validation = getAccountNumberValidation(bankCode);
    if (!validation) return false;

    if (accountNumber.length !== validation.length) return false;
    if (validation.regex && !validation.regex.test(accountNumber)) return false;

    return true;
  };

  return {
    banks: data?.banksByCountry || [],
    bankOptions:
      data?.banksByCountry.map((bank) => ({
        value: bank.code,
        label: bank.name
      })) || [],
    loading,
    error,
    refetch,
    getAccountNumberValidation,
    validateAccountNumber
  };
}
