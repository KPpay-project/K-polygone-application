import React, { useMemo, useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import { useCurrencies } from '@/hooks/use-currencies';
import { useCurrencyStore } from '@/store/currency-store';
import { useProfileStore } from '@/store/profile-store';

export type AbstractCurrencyRenderCtx = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filtered: Currency[];
  all: Currency[];
  selectedCode: string | undefined;
  select: (code: string) => void;
};

export interface AbstractCurrencyProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showUserCurrencies?: boolean;

  value?: string;

  onChange?: (value: string) => void;
  onSelectItem?: (currency: Currency) => void;
  filter?: (currency: Currency, searchTerm: string) => boolean;
  renderItem?: (
    currency: Currency,
    ctx: AbstractCurrencyRenderCtx
  ) => React.ReactNode;
  renderTrigger?: (
    ctx: AbstractCurrencyRenderCtx,
    defaultTrigger: React.ReactNode
  ) => React.ReactNode;
  menuHeader?:
    | React.ReactNode
    | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);
  menuFooter?:
    | React.ReactNode
    | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);
  extraItems?:
    | React.ReactNode
    | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);

  returnField?: 'code' | 'id';

  valueType?: 'code' | 'id';
}

export type Currency = {
  id?: string;
  code: string;
  name: string;
  symbol?: string;
};

export function AbstractCurrency({
  placeholder = 'Select currency',
  disabled = false,
  className = '',
  showUserCurrencies = false,
  value,
  onChange,
  onSelectItem,
  filter,
  renderItem,
  renderTrigger,
  menuHeader,
  menuFooter,
  extraItems,
  returnField = 'code',
  valueType = 'code',
}: AbstractCurrencyProps) {
  const { apiCurrencies, loading, getCurrencySymbol } = useCurrencies();
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const profile = useProfileStore((state) => state.profile);

  const allCurrencies: Currency[] = useMemo(() => {
    return (apiCurrencies || []).map((c: any) => ({
      id: c.id,
      code: c.code || c.currency || '',
      name: c.name || c.currencyLong || c.code || '',
      symbol: c.symbol || getCurrencySymbol?.(c.code || c.currency || ''),
    }));
  }, [apiCurrencies, getCurrencySymbol]);

  const selectedCode = useMemo(() => {
    if (!value) return selectedCurrency;
    if (valueType === 'id') {
      const found = allCurrencies.find((c) => c.id === value);
      return found?.code ?? selectedCurrency;
    }
    return value;
  }, [value, valueType, allCurrencies, selectedCurrency]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = useMemo(
    () => allCurrencies.find((c) => c.code === selectedCode),
    [allCurrencies, selectedCode]
  );

  const selectedSymbol = useMemo(() => {
    if (!selectedCode) return undefined;
    try {
      return getCurrencySymbol?.(selectedCode);
    } catch {
      return undefined;
    }
  }, [selectedCode, getCurrencySymbol]);

  const effectiveFilter = useMemo(
    () =>
      filter ||
      ((c: Currency, s: string) =>
        c.code.toLowerCase().includes(s.toLowerCase()) ||
        c.name.toLowerCase().includes(s.toLowerCase())),
    [filter]
  );

  const walletCurrencyCodes = useMemo(() => {
    const set = new Set<string>();
    const wallets = profile?.wallets || [];
    wallets.forEach((w) => {
      w.balances?.forEach((b) => {
        const code = (b as any)?.currency?.code;
        if (code) set.add(code);
      });
    });
    return set;
  }, [profile]);

  const filteredCurrencies: Currency[] = useMemo(() => {
    const list = showUserCurrencies
      ? allCurrencies.filter((c) => walletCurrencyCodes.has(c.code))
      : allCurrencies;
    if (!searchTerm) return list;
    return list.filter((c) => effectiveFilter(c, searchTerm));
  }, [
    allCurrencies,
    walletCurrencyCodes,
    showUserCurrencies,
    effectiveFilter,
    searchTerm,
  ]);

  const select = (currencyCode: string) => {
    const found = allCurrencies.find((c) => c.code === currencyCode);
    const emittedValue =
      returnField === 'id' ? found?.id || currencyCode : currencyCode;
    onChange?.(emittedValue);
    if (found) onSelectItem?.(found);
    if (value === undefined) {
      setSelectedCurrency(currencyCode);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const ctx: AbstractCurrencyRenderCtx = {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    filtered: filteredCurrencies,
    all: allCurrencies,
    selectedCode,
    select,
  };

  if (loading) {
    return (
      <View
        className={`flex flex-row items-center gap-2 border border-gray-300 px-3 py-2 rounded-xl ${className}`}
      >
        <View className="w-4 h-4 bg-gray-300 rounded-full" />
        <Typography className="text-gray-400 text-sm">Loading...</Typography>
      </View>
    );
  }

  const defaultTrigger = (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => setIsOpen(true)}
      activeOpacity={0.8}
      className={`flex flex-row items-center justify-between border border-gray-300 px-4 py-3 rounded-xl ${className}`}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="w-5 h-5 bg-green-600 rounded-full items-center justify-center">
          <Typography className="text-white text-xs font-bold">
            {
              (selectedSymbol?.[0] ||
                currentCurrency?.symbol?.[0] ||
                '$') as any
            }
          </Typography>
        </View>
        <Typography className="text-gray-900 font-medium">
          {currentCurrency ? currentCurrency.code : placeholder}
        </Typography>
      </View>
      <Typography className="text-gray-400">▼</Typography>
    </TouchableOpacity>
  );

  return (
    <>
      {renderTrigger ? renderTrigger(ctx, defaultTrigger) : defaultTrigger}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
              maxHeight: '80%',
            }}
          >
            {typeof menuHeader === 'function' ? menuHeader(ctx) : menuHeader}
            <View className="mb-3">
              <View className="relative">
                <TextInput
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="pl-3 h-10 border border-gray-200 rounded-lg"
                />
              </View>
            </View>
            <View style={{ maxHeight: 320 }} className="">
              {filteredCurrencies.length === 0 ? (
                <View className="p-2">
                  <Typography className="text-sm text-gray-500 text-center">
                    No currencies found
                  </Typography>
                </View>
              ) : (
                <View>
                  {filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      onPress={() => select(currency.code)}
                      activeOpacity={0.7}
                      className="px-2 py-3 border-b border-gray-100"
                    >
                      {renderItem ? (
                        renderItem(currency, ctx)
                      ) : (
                        <View className="flex flex-row items-center gap-2">
                          <View className="w-4 h-4 bg-green-600 rounded-full items-center justify-center">
                            <Typography className="text-white text-[10px] font-bold">
                              {
                                (currency.symbol?.[0] ||
                                  currency.code?.[0]) as any
                              }
                            </Typography>
                          </View>
                          <Typography className="font-medium">
                            {currency.code}
                          </Typography>
                          <Typography className="text-gray-500 text-sm">
                            ({currency.name})
                          </Typography>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {typeof extraItems === 'function' ? extraItems(ctx) : extraItems}
            {typeof menuFooter === 'function' ? menuFooter(ctx) : menuFooter}
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              activeOpacity={0.8}
              className="mt-3 w-full border border-gray-300 py-3 rounded-xl items-center"
            >
              <Typography className="text-gray-700">Close</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export const AstractedCurrency = AbstractCurrency;
