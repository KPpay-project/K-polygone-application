import type { ReactNode } from 'react';

interface WalletInterfaceProps {
  totalWallets?: number;
  walletId?: string;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onCreateWallet?: () => void;
  onCopyId?: () => void;
}

interface WalletData {
  id: string;
  label: string;
  symbol: string;
  amount: string;
  color: string;
}

interface WalletCardProps {
  wallet: {
    id: string;
    color: string;
    icon?: ReactNode;
    symbol: string;
    amount: number;
    walletId?: string;
    isFrozen?: boolean;
  };
  index?: number;
  showBalance: boolean;
  onToggleBalance: () => void;
  onCopyWalletId: (id: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

type IconType = (props: { size?: number; className?: string }) => JSX.Element;

interface WalletAction {
  key: string;
  label: string;
  Icon: IconType;
  onSelect: () => void;
}

export type { WalletInterfaceProps, WalletData, WalletCardProps, WalletAction };
