import { useState } from 'react';
import { ArrowDown2 } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';

interface Currency {
  code: string;
  symbol: string;
  color: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', color: 'bg-green-600' },
  { code: 'EUR', symbol: '€', color: 'bg-blue-600' },
  { code: 'GBP', symbol: '£', color: 'bg-purple-600' },
  { code: 'NGN', symbol: '₦', color: 'bg-orange-600' },
  { code: 'XOF', symbol: 'CFA', color: 'bg-yellow-600' },
  { code: 'ZMW', symbol: 'ZK', color: 'bg-red-600' }
];

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export function CurrencyDropdown({ selectedCurrency, onCurrencyChange }: CurrencyDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  const handleSelect = (currency: Currency) => {
    onCurrencyChange(currency.code);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="flex justify-between items-center gap-[8px] bg-white border border-gray-300 p-[10px] px-[18px] rounded-[10px] mt-[16px] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-[8px]">
          <span className="text-gray-500 text-[12px]">{t('transfer.changeCurrency')} :</span>
          <div className={`w-[20px] h-[20px] ${selected.color} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{selected.symbol}</span>
          </div>
          <span className="text-[14px] font-light text-gray-900 ml-0.5">{t(`currencies.${selected.code}`)}</span>
        </div>
        <ArrowDown2
          size={18}
          className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-[10px] mt-2 shadow-lg">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center gap-[8px] p-[10px] px-[18px] hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(currency)}
            >
              <div className={`w-[20px] h-[20px] ${currency.color} rounded-full flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{currency.symbol}</span>
              </div>
              <span className="text-[14px] text-gray-900">{t(`currencies.${currency.code}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
