import { useFetchMyWalletCurrencies } from '@/hooks/use-currencies';
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

interface Currency {
  code: string;
  countryCode: string;
  exchangeRateUsd: string;
  id: string;
  name: string;
  precision: number;
  symbol: string;
}

interface WalletCurrenciesDropDownProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSelect?: (currency: Currency) => void;
  defaultCurrency?: string;
}

const WalletCurrenciesDropDown = ({
  placeholder = 'Select currency',
  disabled = false,
  className = '',
  onSelect,
  defaultCurrency
}: WalletCurrenciesDropDownProps) => {
  const { data, loading } = useFetchMyWalletCurrencies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const currencies = useMemo(() => {
    return data?.me?.wallets?.map((wallet: any) => wallet.currency) || [];
  }, [data]);

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;
    const term = searchTerm.toLowerCase();
    return currencies.filter(
      (currency: Currency) => currency.code.toLowerCase().includes(term) || currency.name.toLowerCase().includes(term)
    );
  }, [currencies, searchTerm]);

  const currentCurrency = selectedCurrency || currencies.find((c: Currency) => c.code === defaultCurrency);

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
    setSearchTerm('');
    onSelect?.(currency);
  };

  const getCurrencyColor = (code: string) => {
    switch (code) {
      case 'USD':
        return 'bg-green-600';
      case 'XOF':
        return 'bg-primary';
      case 'NGN':
        return 'bg-blue-600';
      case 'XAF':
        return 'bg-purple-600';
      case 'ZMW':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-400';
    }
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
        <div
          className={`w-4 h-4 ${getCurrencyColor(currentCurrency?.code || '')} rounded-full flex items-center justify-center`}
        >
          <span className="text-white text-xs font-bold">{currentCurrency?.symbol?.charAt(0) || '$'}</span>
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
            filteredCurrencies.map((currency: Currency) => (
              <DropdownMenuItem
                key={currency.id}
                onClick={() => handleCurrencySelect(currency)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`w-4 h-4 ${getCurrencyColor(currency.code)} rounded-full flex items-center justify-center`}
                  >
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
};

export default WalletCurrenciesDropDown;
