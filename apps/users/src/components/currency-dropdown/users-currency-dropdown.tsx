import React from 'react';
import { useGetMyWallets } from '@/hooks/api';
import { UsersCurrencyDropdown as SharedUsersCurrencyDropdown, CurrencyOption } from '@repo/ui';

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

const UsersCurrencyDropdown: React.FC<UsersCurrencyDropdownProps> = (props) => {
  const { data: userWalletsData } = useGetMyWallets();
  const userWallets = userWalletsData?.myWallet ?? [];

  return <SharedUsersCurrencyDropdown {...props} wallets={userWallets} />;
};

export default UsersCurrencyDropdown;
