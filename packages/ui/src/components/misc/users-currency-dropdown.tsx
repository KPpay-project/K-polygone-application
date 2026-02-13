import React, { useMemo } from 'react';
import { Label } from '../ui/label';
import { InputWithSearch } from './input-with-search';

export type CurrencyOption = {
  currencyCode: string;
  balanceId: string;
  walletId: string;
  symbol?: string;
  name?: string;
};

export interface WalletOption {
  id?: string;
  balances?: {
    currency?: {
      code: string;
      symbol?: string;
      name?: string;
    };
  }[];
}

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
  wallets: WalletOption[];
};

export const UsersCurrencyDropdown: React.FC<UsersCurrencyDropdownProps> = ({
  name = 'currency',
  value,
  placeholder = 'Select currency',
  disabled = false,
  dedupeByCurrency = false,
  onChange,
  className,
  label = 'Select currency',
  selectedCurrency,
  onCurrencyChange,
  wallets = [],
}) => {
  const options: CurrencyOption[] = useMemo(() => {
    if (!Array.isArray(wallets)) return [];
    const out: CurrencyOption[] = [];
    for (const w of wallets) {
      const walletId: string = w.id ?? '';
      const balances = Array.isArray(w.balances) ? w.balances : [];

      for (const b of balances) {
        const currencyCode: string = b.currency?.code ?? '';
        const symbol: string = b.currency?.symbol ?? '';
        const name: string = b.currency?.name ?? '';
        const balanceId: string = `${walletId}-${currencyCode}`;
        if (!currencyCode || !walletId) continue;
        out.push({ currencyCode, balanceId, walletId, symbol, name });
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
  }, [wallets, dedupeByCurrency]);

  const encode = (opt: CurrencyOption) => `${opt.currencyCode}:${opt.walletId}:${opt.balanceId}`;

  const decode = (val: string): CurrencyOption | null => {
    const [currencyCode, walletId, balanceId] = val.split(':');
    if (!currencyCode || !walletId || !balanceId) return null;

    return (
      options.find(
        (o) =>
          o.currencyCode === currencyCode && o.walletId === walletId && o.balanceId === balanceId,
      ) ?? {
        currencyCode,
        walletId,
        balanceId,
      }
    );
  };

  const handleSelect = (val: string) => {
    const selected = val ? decode(val) : null;

    if (onCurrencyChange) {
      onCurrencyChange(selected?.currencyCode ?? '');
    }

    onChange?.(selected);
  };

  const selectedByCurrency = selectedCurrency
    ? options.find((o) => o.currencyCode === selectedCurrency)
    : undefined;

  const selectedOption =
    selectedByCurrency ||
    (value
      ? options.find(
          (o) =>
            o.currencyCode === value.currencyCode &&
            o.walletId === value.walletId &&
            o.balanceId === value.balanceId,
        ) || value
      : undefined);

  const selectValue = selectedOption ? encode(selectedOption) : '';

  const searchOptions = useMemo(
    () =>
      options.map((opt) => ({
        label: `${opt.currencyCode}${opt.symbol ? ` (${opt.symbol})` : ''}`,
        value: encode(opt),
      })),
    [options],
  );

  return (
    <div className={'my-3'}>
      <Label>{label}</Label>
      <InputWithSearch
        options={searchOptions}
        value={selectValue}
        onChange={handleSelect}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-[8px] ${className ?? ''}`}
        searchPlaceholder="Search currency..."
      />
      {name && <input type="hidden" name={name} value={selectValue} />}
    </div>
  );
};
