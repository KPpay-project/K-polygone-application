import { useState } from 'react';
import { ArrowDown2 } from 'iconsax-reactjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useFetchAllCurrencies } from '@/hooks/use-currencies';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  id: string;
  countryCode: string;
  exchangeRateUsd: string;
  isActive: boolean;
}

const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🏳️';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

export default function SecondaryCurrencyDropdown({
  value = 'USD',
  onChange
}: {
  value?: string;
  onChange?: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, loading, error } = useFetchAllCurrencies();

  const currencies: Currency[] = data?.currencies || [];

  const selected = currencies.find((c) => c.code === value) || currencies[0];

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-between items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-3 sm:mt-4 md:mt-[16px]">
        <span className="text-[14px] font-medium text-gray-400">Loading currencies...</span>
      </div>
    );
  }

  if (error || currencies.length === 0) {
    return (
      <div className="flex justify-between items-center gap-[8px] bg-red-50 p-[12px] px-[22px] rounded-[12px] mt-3 sm:mt-4 md:mt-[16px]">
        <span className="text-[14px] font-medium text-red-500">Failed to load currencies</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-between items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-3 sm:mt-4 md:mt-[16px] cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getFlagEmoji(selected?.countryCode || 'US')}</span>
            <span className="text-[14px] font-medium text-gray-500">{selected?.code || 'USD'}</span>
            <ArrowDown2 size={20} className="text-gray-500" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-2 max-h-[400px] overflow-y-auto">
        <Input
          placeholder="Search currency..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="mb-2 focus:ring-0 focus:outline-none"
        />
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">No currencies found</div>
        ) : (
          filtered.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onSelect={() => {
                setOpen(false);
                if (onChange) onChange(c.code);
              }}
              className={`cursor-pointer w-full ${c.code === value ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-2xl flex-shrink-0">{getFlagEmoji(c.countryCode)}</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-gray-700">{c.code}</span>
                    <span className="text-xs text-gray-400 truncate">{c.name}</span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
