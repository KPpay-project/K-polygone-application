import React, { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label.tsx';
import { useGetMyWallets, useGetUserWallets } from '@/hooks/api';

type CurrencyOption = {
  currencyCode: string;
  balanceId: string;
  walletId: string;
};

type UsersCurrencyDropdownProps = {
  name?: string;
  value?: CurrencyOption | null;
  placeholder?: string;
  disabled?: boolean;
  dedupeByCurrency?: boolean;
  onChange?: (option: CurrencyOption | null) => void;
  className?: string;
  label?: string;
  selectedCurrency?: string;
  onCurrencyChange?: (currencyCode: string) => void;
};

const UsersCurrencyDropdown: React.FC<UsersCurrencyDropdownProps> = ({
  name = 'currency',
  value,
  placeholder = 'Select currency',
  disabled = false,
  dedupeByCurrency = false,
  onChange,
  className,
  label = 'Select currency',
  selectedCurrency,
  onCurrencyChange
}) => {
  const { data: userWalletsData } = useGetMyWallets();
  const userWallets = userWalletsData?.myWallet ?? [];
  console.log(useGetUserWallets, 'showing');
  const [search, setSearch] = useState('');

  const options: CurrencyOption[] = useMemo(() => {
    if (!Array.isArray(userWallets)) return [];
    const out: CurrencyOption[] = [];
    for (const w of userWallets) {
      const walletId: string = w.id ?? '';
      const balances = Array.isArray(w.balances) ? w.balances : [];

      for (const b of balances) {
        const currencyCode: string = b.currency?.code ?? '';
        const balanceId: string = `${walletId}-${currencyCode}`;
        if (!currencyCode || !walletId) continue;
        out.push({ currencyCode, balanceId, walletId });
      }
    }
    if (!dedupeByCurrency) return out;
    const seen = new Set<string>();
    const deduped: CurrencyOption[] = [];
    for (const opt of out) {
      if (seen.has(opt.currencyCode)) continue;
      seen.add(opt.currencyCode);
      deduped.push(opt);
    }
    return deduped;
  }, [userWallets, dedupeByCurrency]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) => opt.currencyCode.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const encode = (opt: CurrencyOption) => `${opt.currencyCode}:${opt.walletId}:${opt.balanceId}`;

  const decode = (val: string): CurrencyOption | null => {
    const [currencyCode, walletId, balanceId] = val.split(':');
    if (!currencyCode || !walletId || !balanceId) return null;

    return (
      options.find((o) => o.currencyCode === currencyCode && o.walletId === walletId && o.balanceId === balanceId) ?? {
        currencyCode,
        walletId,
        balanceId
      }
    );
  };

  const handleSelect = (val: string) => {
    const selected = decode(val);

    if (onCurrencyChange) {
      onCurrencyChange(selected?.currencyCode ?? '');
    }

    onChange?.(selected);
  };

  const selectedByCurrency = selectedCurrency ? options.find((o) => o.currencyCode === selectedCurrency) : undefined;

  const selectedOption =
    selectedByCurrency ||
    (value
      ? options.find(
          (o) =>
            o.currencyCode === value.currencyCode && o.walletId === value.walletId && o.balanceId === value.balanceId
        ) || value
      : undefined);

  const selectValue = selectedOption ? encode(selectedOption) : undefined;

  return (
    <div className={'my-3'}>
      <Label>{label}</Label>
      <Select name={name} disabled={disabled} onValueChange={handleSelect} value={selectValue}>
        <SelectTrigger className={`w-full mt-[8px] shadow-none ${className ?? ''}`}>
          {selectedOption ? <span>{selectedOption.currencyCode}</span> : <SelectValue placeholder={placeholder} />}
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input placeholder="Search currency..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {filteredOptions.map((opt) => (
            <SelectItem key={`${opt.walletId}:${opt.balanceId}`} value={encode(opt)}>
              {opt.currencyCode}
            </SelectItem>
          ))}
          {filteredOptions.length === 0 && <div className="p-2 text-sm text-muted-foreground">No results</div>}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UsersCurrencyDropdown;
