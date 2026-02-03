import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Currency {
  id: string;
  name: string;
  code: string;
  flag: string;
  symbol: string;
}

interface CurrencyContextType {
  selectedCurrency: string;
  selectedCurrencyData: Currency | null;
  setSelectedCurrency: (currencyCode: string) => void;
  currencies: Currency[];
}

const currencies: Currency[] = [
  {
    id: '1',
    name: 'West African CFA franc',
    code: 'XOF',
    flag: '🇸🇳',
    symbol: 'CFA',
  },
  {
    id: '2',
    name: 'Nigerian Naira',
    code: 'NGN',
    flag: '🇳🇬',
    symbol: '₦',
  },
  {
    id: '3',
    name: 'Zambian Kwacha',
    code: 'ZMW',
    flag: '🇿🇲',
    symbol: 'ZK',
  },
  {
    id: '4',
    name: 'United States Dollar',
    code: 'USD',
    flag: '🇺🇸',
    symbol: '$',
  },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
}

const CURRENCY_STORAGE_KEY = '@selected_currency';

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>('XOF');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSavedCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        if (savedCurrency && currencies.find((c) => c.code === savedCurrency)) {
          setSelectedCurrencyState(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load saved currency:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedCurrency();
  }, []);

  const selectedCurrencyData =
    currencies.find((currency) => currency.code === selectedCurrency) || null;

  const setSelectedCurrency = async (currencyCode: string) => {
    setSelectedCurrencyState(currencyCode);
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
    } catch (error) {
      console.error('Failed to save currency:', error);
    }
  };

  const value: CurrencyContextType = useMemo(
    () => ({
      selectedCurrency,
      selectedCurrencyData,
      setSelectedCurrency,
      currencies,
    }),
    [selectedCurrency, selectedCurrencyData]
  );

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export type { Currency };
