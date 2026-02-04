import { useState } from 'react';
import { ArrowDown2 } from 'iconsax-reactjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const currencies = [
  { code: 'USD', symbol: '$', name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA franc' },
  { code: 'GHC', symbol: '₵', name: 'Ghanaian Cedi' }
];

export default function SecondaryCurrencyDropdown({
  value = 'USD',
  onChange
}: {
  value?: string;
  onChange?: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = currencies.find((c) => c.code === value) || currencies[0];
  const filtered = currencies.filter(
    (c) => c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-between items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-3 sm:mt-4 md:mt-[16px] cursor-pointer">
          <div className="flex items-center gap-1">
            <div className="size-[20px] bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{selected.symbol}</span>
            </div>
            <span className="text-[14px] font-medium text-gray-500 py-2 ml-0.5">{selected.code}</span>
            <ArrowDown2 size={20} className="text-gray-500" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2">
        <Input
          placeholder="Search currency..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="mb-2 focus:ring-0 focus:outline-none"
        />
        {filtered.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onSelect={() => {
              setOpen(false);
              if (onChange) onChange(c.code);
            }}
            className={`cursor-pointer ${c.code === value ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <div className="size-[20px] bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{c.symbol}</span>
              </div>
              <span className="text-[14px] font-medium text-gray-500 py-2 ml-0.5">{c.code}</span>
              <span className="text-xs text-gray-400 ml-2">{c.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
