import { ArrowDown2 } from 'iconsax-reactjs';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Select, SelectContent, SelectItem, SelectTrigger } from 'k-polygon-assets/components';
import { useCurrencies } from '@/hooks/use-currencies';
import { useState } from 'react';

interface CurrencyDropdownProps {
  selectedCurrency?: string;
  balance?: string;
  onCurrencyChange?: (currency: string) => void;
}

const CurrencyDropdown = ({ selectedCurrency = 'USD', balance = '$1000', onCurrencyChange }: CurrencyDropdownProps) => {
  const { currencies, apiCurrencies } = useCurrencies();
  const [currentCurrency, setCurrentCurrency] = useState(selectedCurrency);

  const availableCurrencies = apiCurrencies && apiCurrencies.length > 0 ? apiCurrencies : currencies;

  const selectedCurrencyData = currencies.find((curr) => curr.currency === currentCurrency);
  const Icon = selectedCurrencyData?.icon;

  const handleCurrencyChange = (value: string) => {
    setCurrentCurrency(value);
    onCurrencyChange?.(value);
  };

  return (
    <div className="my-4 flex justify-between items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-[16px]">
      <Select value={currentCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="border-0 bg-transparent p-0 h-auto hover:bg-gray-50 transition-colors rounded-md">
          <div className="flex items-center gap-1">
            <div className="size-[20px] bg-green-600 rounded-full flex items-center justify-center">
              {Icon ? <Icon className="w-3 h-3 text-white" /> : <span className="text-white text-xs font-bold">$</span>}
            </div>
            <span className="text-[14px] font-medium text-gray-500 py-2 ml-0.5">{currentCurrency}</span>
            <ArrowDown2 size={20} className="text-gray-500" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((currency) => {
            const isApiCurrency = 'code' in currency;
            const currencyCode = isApiCurrency ? currency.code : currency.currency;
            const currencyName = isApiCurrency ? currency.name : currency.currencyLong;
            const CurrencyIcon = isApiCurrency ? null : currency.icon;

            return (
              <SelectItem key={currencyCode} value={currencyCode}>
                <div className="flex items-center gap-2">
                  <div className="size-[18px] bg-green-600 rounded-full flex items-center justify-center">
                    {CurrencyIcon ? (
                      <CurrencyIcon className="w-3 h-3 text-white" />
                    ) : (
                      <span className="text-white text-xs font-bold">{currencyCode?.charAt(0) || '$'}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{currencyCode}</span>
                    <span className="text-xs text-gray-500">{currencyName}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Typography className="text-gray-500 font-bold">{balance}</Typography>
    </div>
  );
};

export default CurrencyDropdown;
