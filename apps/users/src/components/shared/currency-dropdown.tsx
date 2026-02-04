import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ArrowDown2 } from 'iconsax-reactjs';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCurrencies } from '@/hooks/use-currencies';
import { useCurrencyStore } from '@/store/currency-store';
import { useProfileStore } from '@/store/profile-store';

interface CurrencyDropdownProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showUserCurrencies?: boolean;
}

export function CurrencyDropdown({
  placeholder = 'Select currency',
  disabled = false,
  className = '',
  showUserCurrencies = false
}: CurrencyDropdownProps) {
  const { apiCurrencies, loading, getCurrencySymbol } = useCurrencies();
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();
  const profile = useProfileStore((state) => state.profile);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Collect the set of currency codes from user's wallets
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

  const selectedSymbol = getCurrencySymbol(selectedCurrency);
  const currentCurrency = apiCurrencies?.find((currency) => currency.code === selectedCurrency);

  // Build base list depending on flag, then apply search filter
  const filteredCurrencies = useMemo(() => {
    const all = apiCurrencies || [];
    const base = showUserCurrencies ? all.filter((c) => walletCurrencyCodes.has(c.code)) : all;
    if (!searchTerm) return base;
    const term = searchTerm.toLowerCase();
    return base.filter(
      (currency) => currency.code.toLowerCase().includes(term) || currency.name.toLowerCase().includes(term)
    );
  }, [apiCurrencies, walletCurrencyCodes, showUserCurrencies, searchTerm]);

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    setIsOpen(false);
    setSearchTerm('');
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        disabled={disabled}
        className={`flex items-center gap-[8px] border border-gray-400 p-[8px] py-0 rounded-[12px] h-auto w-auto min-w-[100px] focus:ring-0 focus:ring-offset-0 focus:outline-none ${className}`}
      >
        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{selectedSymbol?.charAt(0) || '$'}</span>
        </div>
        <span className="text-[14px] font-medium text-gray-400 py-2">
          {currentCurrency ? currentCurrency.code : placeholder}
        </span>
        <ArrowDown2 size={20} className="text-gray-400" />
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
        <div className="max-h-60 overflow-y-auto">
          {filteredCurrencies.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">No currencies found</div>
          ) : (
            filteredCurrencies.map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onClick={() => handleCurrencySelect(currency.code)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currency.symbol?.charAt(0) || currency.code?.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-gray-500 text-sm">({currency.name})</span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
