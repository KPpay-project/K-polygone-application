import React, { useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ArrowDown2 } from 'iconsax-reactjs';
import { Search } from 'lucide-react';
import { useCurrencies } from '@/hooks/use-currencies';
import { useCurrencyStore } from '@/store/currency-store';
import { useProfileStore } from '@/store/profile-store';
import type { Currency } from '@repo/types';

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
  onChange?: (code: string) => void;

  onSelectItem?: (currency: Currency) => void;

  filter?: (currency: Currency, searchTerm: string) => boolean;

  renderItem?: (currency: Currency, ctx: AbstractCurrencyRenderCtx) => React.ReactNode;
  renderTrigger?: (ctx: AbstractCurrencyRenderCtx, defaultTrigger: React.ReactNode) => React.ReactNode;
  menuHeader?: React.ReactNode | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);
  menuFooter?: React.ReactNode | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);
  extraItems?: React.ReactNode | ((ctx: AbstractCurrencyRenderCtx) => React.ReactNode);
}

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
  extraItems
}: AbstractCurrencyProps) {
  const { apiCurrencies, loading, getCurrencySymbol } = useCurrencies();
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const profile = useProfileStore((state) => state.profile);

  const selectedCode = value ?? selectedCurrency;

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = useMemo(
    () => apiCurrencies?.find((c) => c.code === selectedCode),
    [apiCurrencies, selectedCode]
  );

  const selectedSymbol = getCurrencySymbol(selectedCode);

  const effectiveFilter = useMemo(
    () =>
      filter ||
      ((c: Currency, s: string) =>
        c.code.toLowerCase().includes(s.toLowerCase()) || c.name.toLowerCase().includes(s.toLowerCase())),
    [filter]
  );

  const walletCurrencyCodes = useMemo(() => {
    const set = new Set<string>();
    const wallets = profile?.wallets || [];
    wallets.forEach((w) => {
      w.balances?.forEach((b) => {
        const code = b?.currency?.code;
        if (code) set.add(code);
      });
    });
    return set;
  }, [profile]);

  const filteredCurrencies: Currency[] = useMemo(() => {
    const all = apiCurrencies || [];
    const list = showUserCurrencies ? all.filter((c) => walletCurrencyCodes.has(c.code)) : all;
    if (!searchTerm) return list;
    return list.filter((c) => effectiveFilter(c, searchTerm));
  }, [apiCurrencies, walletCurrencyCodes, showUserCurrencies, effectiveFilter, searchTerm]);

  const select = (currencyCode: string) => {
    onChange?.(currencyCode);
    const found = apiCurrencies?.find((c) => c.code === currencyCode);
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
    all: apiCurrencies || [],
    selectedCode,
    select
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-[8px] border border-gray-400 p-[8px] py-0 rounded-[12px] ${className}`}>
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-[14px] font-medium text-gray-400 py-2">Loading...</span>
        <ArrowDown2 size={20} className="text-gray-400" />
      </div>
    );
  }

  const defaultTrigger = (
    <div
      className={`flex items-center gap-[8px] border border-gray-400 p-[8px] py-0 rounded-[12px] h-auto w-auto min-w-[100px] focus:ring-0 focus:ring-offset-0 focus:outline-none ${className}`}
    >
      <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">{selectedSymbol?.charAt(0) || '$'}</span>
      </div>
      <span className="text-[14px] font-medium text-gray-400 py-2">
        {currentCurrency ? currentCurrency.code : placeholder}
      </span>
      <ArrowDown2 size={20} className="text-gray-400" />
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger disabled={disabled} className="focus:ring-0 focus:ring-offset-0 focus:outline-none">
        {renderTrigger ? renderTrigger(ctx, defaultTrigger) : defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>

        {typeof menuHeader === 'function' ? menuHeader(ctx) : menuHeader}

        <div className="max-h-60 overflow-y-auto">
          {filteredCurrencies.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">No currencies found</div>
          ) : (
            filteredCurrencies.map((currency) => (
              <DropdownMenuItem key={currency.code} onClick={() => select(currency.code)} className="cursor-pointer">
                {renderItem ? (
                  renderItem(currency, ctx)
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {currency.symbol?.charAt(0) || currency.code?.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-gray-500 text-sm">({currency.name})</span>
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {typeof extraItems === 'function' ? extraItems(ctx) : extraItems}
        {typeof menuFooter === 'function' ? menuFooter(ctx) : menuFooter}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const AstractedCurrency = AbstractCurrency;
